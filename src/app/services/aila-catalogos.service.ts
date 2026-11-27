import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface CatalogosAILA {
  proyectos: string[];
  dependencias: string[];
  categorias: string[];
  conceptos: string[];
  conceptosPorCategoria: Record<string, string[]>;
}
interface CacheCatalogos {
  version: 1;
  actualizadoEn: string;
  catalogos: CatalogosAILA;
}
const vacios = (): CatalogosAILA => ({
  proyectos: [], dependencias: [], categorias: [], conceptos: [],
  conceptosPorCategoria: Object.create(null) as Record<string, string[]>
});

@Injectable({ providedIn: 'root' })
export class AilaCatalogosService {
  // La caché se separa por backend. No guarda las experiencias completas.
  private readonly clave = `aila:catalogos:v1:${environment.apiUrl}`;
  private readonly valor = signal<CatalogosAILA>(vacios());
  readonly catalogos = this.valor.asReadonly();
  readonly actualizando = signal(false);
  readonly error = signal('');
  readonly avisoPersistencia = signal('');
  readonly actualizadoEn = signal<string | null>(null);
  private pendiente: Promise<boolean> | null = null;

  constructor() {
    this.recuperar();
  }

  /** Carga inmediata de localStorage; la consulta remota se solicita aparte. */
  private recuperar(): void {
    if (typeof window === 'undefined') return;
    try {
      const texto = window.localStorage.getItem(this.clave);
      if (!texto) return;
      const cache: unknown = JSON.parse(texto);
      if (!this.cacheValida(cache)) return;
      this.valor.set({
        ...cache.catalogos,
        conceptosPorCategoria: Object.assign(Object.create(null), cache.catalogos.conceptosPorCategoria)
      });
      this.actualizadoEn.set(cache.actualizadoEn);
    } catch {
      this.avisoPersistencia.set('No se pudo recuperar el catálogo local. Se intentará cargar desde el servidor.');
    }
  }

  /**
   * Reutiliza tu método HTTP. Si dos componentes lo llaman simultáneamente,
   * comparten la petición en curso. No se hacen reintentos automáticos.
   */
  actualizarDesde(cargar: () => Promise<unknown>): Promise<boolean> {
    if (this.pendiente) return this.pendiente;
    this.actualizando.set(true);
    this.error.set('');
    this.pendiente = Promise.resolve().then(cargar).then(datos => {
      this.actualizar(datos);
      return true;
    }).catch(() => {
      this.error.set(this.actualizadoEn()
        ? 'No se pudo actualizar el catálogo. Puedes seguir usando la última versión guardada.'
        : 'No se pudo cargar el catálogo. Intenta actualizarlo nuevamente.');
      return false;
    }).finally(() => {
      this.actualizando.set(false);
      this.pendiente = null;
    });
    return this.pendiente;
  }

  /** Llamar también cuando ya se dispone de un nuevo consolidado completo. */
  actualizar(datos: unknown): void {
    if (!Array.isArray(datos)) throw new Error('Se esperaba resp.datos como arreglo.');
    const proyectos = new Set<string>();
    const dependencias = new Set<string>();
    const categorias = new Set<string>();
    const conceptos = new Set<string>();
    const relaciones = new Map<string, Set<string>>();
    // Se conservan los valores exactos porque el endpoint analítico compara
    // literalmente. Se excluyen nulos y textos compuestos solo por espacios.
    const texto = (v: unknown): string | null => typeof v === 'string' && v.trim() ? v : null;
    let filasReconocidas = 0;
    for (const fila of datos) {
      if (!fila || typeof fila !== 'object' || Array.isArray(fila)) {
        throw new Error('El consolidado contiene un registro no válido.');
      }
      const r = fila as Record<string, unknown>;
      if (['Q', 'Dep', 'Categoría', 'Concepto a valorar'].some(k => k in r)) filasReconocidas++;
      const q = texto(r['Q']);
      const dep = texto(r['Dep']);
      const cat = texto(r['Categoría']);
      const concepto = texto(r['Concepto a valorar']);
      if (q) proyectos.add(q);
      if (dep) dependencias.add(dep);
      if (cat) categorias.add(cat);
      if (concepto) conceptos.add(concepto);
      if (cat && concepto) {
        if (!relaciones.has(cat)) relaciones.set(cat, new Set());
        relaciones.get(cat)!.add(concepto);
      }
    }
    if (datos.length && filasReconocidas !== datos.length) {
      throw new Error('La respuesta no corresponde a las filas originales del consolidado.');
    }
    const ordenar = (s: Set<string>): string[] => [...s].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
    const conceptosPorCategoria: Record<string, string[]> = Object.create(null);
    for (const [cat, valores] of relaciones) conceptosPorCategoria[cat] = ordenar(valores);
    const catalogos: CatalogosAILA = {
      proyectos: ordenar(proyectos), dependencias: ordenar(dependencias),
      categorias: ordenar(categorias), conceptos: ordenar(conceptos), conceptosPorCategoria
    };
    const actualizadoEn = new Date().toISOString();
    // Reemplaza la foto anterior, no acumula datos que ya fueron eliminados.
    this.valor.set(catalogos);
    this.actualizadoEn.set(actualizadoEn);
    this.error.set('');
    this.avisoPersistencia.set('');
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(this.clave, JSON.stringify({ version: 1, actualizadoEn, catalogos } satisfies CacheCatalogos));
    } catch {
      this.avisoPersistencia.set('Catálogo actualizado en memoria. El navegador no permitió guardarlo para la próxima visita.');
    }
  }

  private cacheValida(v: unknown): v is CacheCatalogos {
    if (!v || typeof v !== 'object') return false;
    const r = v as Record<string, unknown>;
    if (r['version'] !== 1 || typeof r['actualizadoEn'] !== 'string' || !Number.isFinite(Date.parse(r['actualizadoEn']))) return false;
    const c = r['catalogos'];
    if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
    const cat = c as Record<string, unknown>;
    const lista = (x: unknown): x is string[] => Array.isArray(x) && x.every(s => typeof s === 'string' && s.trim());
    if (!['proyectos','dependencias','categorias','conceptos'].every(k => lista(cat[k]))) return false;
    const rel = cat['conceptosPorCategoria'];
    return !!rel && typeof rel === 'object' && !Array.isArray(rel) && Object.values(rel).every(lista);
  }
}
