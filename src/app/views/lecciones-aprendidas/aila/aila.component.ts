import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, interval, Subscription, firstValueFrom } from 'rxjs';
// AJUSTA SOLO esta referencia y el nombre de la clase a tu servicio existente.
import { LeccionesService } from '../../../services/lecciones.service';
import { AilaCatalogosService } from '../../../services/aila-catalogos.service';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  AilaService, CampoTexto, CasoRepresentativo, CategoriaAILA,
  FiltrosAnaliticos, RespuestaAILA, ResultadoAILA, Sintesis, TipoAnalisis
} from '../../../services/aila.service';
import { DialogModule } from 'primeng/dialog';
interface Tarjeta { titulo: string; valor: number | string; nota?: string; }
interface CampoVista { clave: CampoTexto; titulo: string; texto: string; }
interface CategoriaVista {
  nombre: string; estado: string; nota: string; campos: CampoVista[];
  originales: CategoriaAILA; avisos: string[];
}
interface CasoGrupo { titulo: string; casos: CasoRepresentativo[]; }

@Component({
  selector: 'app-aila',
  imports: [CommonModule, FormsModule, AccordionModule, ButtonModule,DialogModule,
    MessageModule, ProgressBarModule, SelectModule, TableModule, TagModule],
  templateUrl: './aila.component.html', styleUrl: './aila.component.scss'
})
export class AilaComponent implements OnInit {
  private readonly api = inject(AilaService);
  private readonly destroyRef = inject(DestroyRef);
  readonly cargando = signal(false);
  readonly segundos = signal(0);
  readonly error = signal('');
  readonly respuesta = signal<RespuestaAILA | null>(null);
  private reloj?: Subscription;
  mostrarLimitaciones = false;
  tipo: TipoAnalisis = 'analitico';
  proyecto = '';
  categoria = '';
  concepto = '';
  readonly catalogosService = inject(AilaCatalogosService);
  readonly catalogos = this.catalogosService.catalogos;
  filtrosSeleccionados: Required<FiltrosAnaliticos> = { dependencias: [], proyectos: [], categorias: [], conceptos: [] };
  get conceptosDeCategoria(): string[] { return this.catalogos().conceptosPorCategoria[this.categoria] ?? []; }
  private readonly leccionesService = inject(LeccionesService);

  ngOnInit(): void {
    // El catálogo guardado ya está disponible. No bloquear la vista esperando el JSON.
    // void this.generarConsolidadoLecciones();
  }

  public async generarConsolidadoLecciones(): Promise<void> {
    await this.catalogosService.actualizarDesde(async () => {
      const resp = await firstValueFrom(this.leccionesService.GenerarDescargasLecciones());
      return resp.datos;
    });
  }
  readonly opciones = [
    { label: 'Indicadores del conjunto', value: 'analitico' },
    { label: 'Experiencias de un concepto', value: 'cualitativo' },
    { label: 'Análisis de un proyecto', value: 'proyecto' }
  ];
  readonly campos: { clave: CampoTexto; titulo: string }[] = [
    { clave: 'situacion', titulo: 'Situación presentada' },
    { clave: 'acciones', titulo: 'Acciones realizadas' },
    { clave: 'leccion', titulo: 'Lecciones aprendidas' }
  ];

  tituloResultado = '';
  tipoResultado: TipoAnalisis = 'analitico';
  tarjetas: Tarjeta[] = [];
  camposResultado: CampoVista[] = [];
  categoriasResultado: CategoriaVista[] = [];
  gruposCasos: CasoGrupo[] = [];
  avisos: string[] = [];
  limitaciones: string[] = [];
  coincidencias: string[] = [];
  referencias: { id: string; proyecto_q: string }[] = [];
  filasLogro: { resultado: string; total: number }[] = [];
  filasCalidad: { campo: string; completos: number | string; vacios: number | string; porcentaje: number | null }[] = [];
  filasCategorias: { categoria: string; total: number }[] = [];
  textoResumen = '';
  auditoria: { tiempo: string; consultas: number | string; cache: number | string } | null = null;

  opcionesCatalogo(valores: readonly string[]): { label: string; value: string }[] {
    return valores.map(valor => ({ label: valor, value: valor }));
  }

  get tiempoEspera(): string {
    return `${Math.floor(this.segundos() / 60)} min ${this.segundos() % 60} s`;
  }
  get estadoResultado(): string { return this.respuesta()?.estado ?? ''; }
  get resultado(): ResultadoAILA | null { return this.respuesta()?.resultado ?? null; }

  ejecutar(): void {
    if (this.cargando()) return;
    this.limpiarVista();
    this.tipoResultado = this.tipo;
    this.tituloResultado = this.tipo === 'proyecto' ? this.proyecto.trim() :
      this.tipo === 'cualitativo' ? `${this.categoria.trim()} · ${this.concepto.trim()}` : 'Indicadores de la selección';
    this.cargando.set(true);
    this.segundos.set(0);
    const inicio = Date.now();
    this.reloj = interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.segundos.set(Math.floor((Date.now() - inicio) / 1000));
    });
    let peticion;
    if (this.tipo === 'proyecto') peticion = this.api.analizarProyecto(this.proyecto);
    else if (this.tipo === 'cualitativo') peticion = this.api.analizarConcepto(this.categoria, this.concepto);
    else {
      const filtros: FiltrosAnaliticos = {};
      for (const clave of Object.keys(this.filtrosSeleccionados) as (keyof FiltrosAnaliticos)[]) {
        const seleccion = this.filtrosSeleccionados[clave];
        if (seleccion.length) filtros[clave] = [...seleccion];
      }
      peticion = this.api.analizar(filtros);
    }
    peticion.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.reloj?.unsubscribe();
      this.cargando.set(false);
    })).subscribe({
      next: r => {
        if (!this.esRespuesta(r)) {
          this.error.set('El servidor devolvió una respuesta distinta al contrato esperado.');
          return;
        }
        this.presentar(r);
        if (r.estado === 'error' || r.estado === 'completado_con_errores') {
          this.error.set(r.mensaje || 'El motor reportó un error. Se muestra el avance disponible.');
        }
      },
      error: (e: HttpErrorResponse) => {
        // HTTP 500 puede contener un análisis parcial: no ocultarlo.
        if (this.esRespuesta(e.error)) this.presentar(e.error);
        const mensaje = typeof e.error?.mensaje === 'string' ? e.error.mensaje : '';
        this.error.set(mensaje || (e.status === 0 ?
          'No se recibió respuesta del servidor. Revisa conexión, URL y CORS. El análisis podría seguir ejecutándose.' :
          `No se completó la petición (HTTP ${e.status}). El servidor podría seguir procesando; no se reintenta automáticamente.`));
      }
    });
  }

  private esRespuesta(valor: unknown): valor is RespuestaAILA {
    if (!valor || typeof valor !== 'object') return false;
    const r = valor as Record<string, unknown>;
    return typeof r['estado'] === 'string' && ['analitico','cualitativo','proyecto'].includes(String(r['tipo'])) &&
      ('resultado' in r) && (r['resultado'] === null || (typeof r['resultado'] === 'object' && !Array.isArray(r['resultado'])));
  }

  private limpiarVista(): void {
    this.respuesta.set(null); this.error.set(''); this.tarjetas = [];
    this.camposResultado = []; this.categoriasResultado = []; this.gruposCasos = [];
    this.avisos = []; this.limitaciones = []; this.coincidencias = []; this.referencias = [];
    this.filasLogro = []; this.filasCalidad = []; this.filasCategorias = [];
    this.textoResumen = ''; this.auditoria = null;
  }

  private presentar(respuesta: RespuestaAILA): void {
    this.respuesta.set(respuesta);
    const r = respuesta.resultado;
    if (!r) return;
    const concepto = r.categorias?.[0]?.conceptos?.[0];
    const detalle = this.tipoResultado === 'cualitativo' ? concepto?.analisis_cualitativo : undefined;
    const a = r.auditoria ?? detalle?.auditoria;
    if (a) this.auditoria = { tiempo: this.duracion(a.segundos_total), consultas: this.numero(a.consultas), cache: this.numero(a.cache) };
    this.avisos = this.mensajes([
      ...(r.advertencias ?? []), ...(r.advertencias_casos ?? []),
      ...(r.errores ?? []), ...(r.errores_analisis ?? []), ...(r.incidencias_sintesis ?? []),
      ...(detalle?.advertencias_casos ?? [])
    ]);
    this.textoResumen = r.sintesis_integrada?.texto || r.resumen || detalle?.resumen || detalle?.conclusion || '';
    if (this.tipoResultado === 'analitico') {
      const general = r.resumen_general ?? {};
      const logro = r.resultados_logro;
      const igc = logro && (logro.total_validos ?? 0) > 0 && typeof logro.igc === 'number' && Number.isFinite(logro.igc) ? logro.igc : null;
      this.tarjetas = [
        { titulo: 'Experiencias', valor: this.numero(general.total_experiencias) },
        { titulo: 'Proyectos', valor: this.numero(general.total_proyectos) },
        { titulo: 'Conceptos', valor: this.numero(general.total_conceptos) },
        { titulo: 'Índice global de cumplimiento', valor: igc === null ? 'Sin valoraciones' : `${igc.toFixed(2)} %` }
      ];
      if (logro) {
        this.filasLogro = [
          { resultado: 'Sí', total: logro.si ?? 0 },
          { resultado: 'Parcialmente', total: logro.parcialmente ?? 0 },
          { resultado: 'No', total: logro.no ?? 0 }
        ];
        const otros = (logro.total_validos ?? 0) - this.filasLogro.reduce((s, x) => s + x.total, 0);
        if (otros > 0) {
          this.filasLogro.push({ resultado: 'Otros valores numéricos', total: otros });
          this.avisos.push('Existen valores numéricos fuera de 0, 1 y 2. El IGC se presenta tal como lo calculó el motor y requiere revisión.');
        }
        const vacios = Math.max(0, (general.total_experiencias ?? 0) - (logro.total_validos ?? 0));
        this.filasLogro.push({ resultado: 'Sin valoración numérica', total: vacios });
      }
      this.filasCalidad = Object.entries(r.calidad_informacion ?? {}).map(([campo, v]) => ({
        campo, completos: this.numero(v.completos), vacios: this.numero(v.vacios),
        porcentaje: typeof v.porcentaje_completitud === 'number' && Number.isFinite(v.porcentaje_completitud) ? v.porcentaje_completitud : null
      }));
      this.filasCategorias = (r.experiencias_por_categoria ?? []).map(v => ({ categoria: v['Categoría'] ?? 'Sin categoría', total: v.total }));
      return;
    }
    this.tarjetas = [
      { titulo: 'Experiencias seleccionadas', valor: this.numero(respuesta.total_experiencias_seleccionadas ?? r.total_experiencias) },
      { titulo: 'Experiencias procesadas', valor: this.numero(r.total_experiencias_procesadas ?? r.total_evidencias_procesadas) },
      { titulo: 'Bloques procesados', valor: this.numero(r.total_bloques_procesados) },
      { titulo: this.tipoResultado === 'proyecto' ? 'Categorías con resultado' : 'Proyectos', valor: this.tipoResultado === 'proyecto' ? (r.categorias?.length ?? 0) : this.numero(r.total_proyectos) }
    ];
    if (this.tipoResultado === 'cualitativo') {
      this.camposResultado = this.conclusiones(r.conclusiones_por_campo ? r : detalle);
      const casos = r.casos_representativos ?? detalle?.casos_representativos;
      this.gruposCasos = [
        { titulo: 'Casos favorables al concepto', casos: casos?.favorables ?? [] },
        { titulo: 'Casos con dificultades', casos: casos?.con_dificultades ?? [] }
      ];
      this.limitaciones = this.mensajes(detalle?.limitaciones ?? []);
      this.coincidencias = this.mensajes(detalle?.coincidencias ?? []);
      this.referencias = concepto?.referencias_evidencias ?? [];
    } else {
      this.categoriasResultado = (r.categorias ?? []).map(c => ({
        nombre: c.categoria, estado: c.estado_sintesis ?? '', nota: c.nota_sintesis ?? '',
        campos: this.conclusiones(c), originales: c,
        avisos: this.mensajes(c.advertencias ?? [])
      }));
    }
  }

  private conclusiones(s?: Sintesis): CampoVista[] {
    return this.campos.map(c => ({ ...c, texto: s?.conclusiones_por_campo?.[c.clave] || 'No se recibió una síntesis para este campo.' }));
  }
  private mensajes(valores: unknown[]): string[] {
    return [...new Set(valores.map(v => this.describir(v)).filter(Boolean))];
  }
  describir(valor: unknown): string {
    if (typeof valor === 'string') return valor;
    if (valor == null) return '';
    if (Array.isArray(valor)) return valor.map(v => this.describir(v)).filter(Boolean).join(' · ');
    if (typeof valor === 'object') {
      return Object.entries(valor).filter(([k]) => !['tipo'].includes(k))
        .map(([k, v]) => `${this.etiqueta(k)}: ${this.describir(v)}`).join(' · ');
    }
    return String(valor);
  }
  etiqueta(valor: string): string { return valor.replace(/_/g, ' '); }
  textoFuente(valor: string | null | undefined): string { return valor?.trim() || 'Sin texto registrado'; }
  numero(valor: unknown): number | string { return typeof valor === 'number' && Number.isFinite(valor) ? valor : '—'; }
  private duracion(valor?: number): string {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) return 'No informado';
    return `${Math.floor(valor / 60)} min ${(valor % 60).toFixed(1)} s`;
  }
  severity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (estado === 'error') return 'danger';
    if (estado.includes('alertas') || estado.includes('parcial') || estado.includes('errores') || estado.includes('sin_citar')) return 'warn';
    if (estado === 'completado') return 'success';
    return 'secondary';
  }
  descargar(): void {
    const r = this.respuesta();
    if (!r) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(r, null, 2)], { type: 'application/json;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url; enlace.download = `aila_${this.tipoResultado}_${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
