import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LeccionesService } from '../../services/lecciones.service';
import { firstValueFrom } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import {
  RespuestaConsolidacionLecciones,
  IndicadoresGenerales,
  IndicadorCategoria,
  IndicadorConcepto,
  IndicadorDependencia,
  IndicadorDependenciaCategoria,
  
} from '../../services/lecciones.service'
import { SkeletonModule } from 'primeng/skeleton';
import { signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-lecciones-aprendidas',
  imports: [CardModule, TagModule, MessageModule, ButtonModule, ProgressSpinnerModule, TableModule, ChartModule,
    SkeletonModule, MultiSelectModule, FormsModule, TooltipModule, DialogModule, DividerModule, IconFieldModule],
  templateUrl: './lecciones-aprendidas.component.html',
  styleUrl: './lecciones-aprendidas.component.scss',
})
export class LeccionesAprendidasComponent implements OnInit {
  isDisabledIntegracionLecciones: boolean = false
  isdisabled: boolean = false
  archivosLecciones: any[] = [];
  info: any[] = [];
  exito: boolean = false
  indicadores!: IndicadoresGenerales;
  indicadores_categoria: IndicadorCategoria[] = [];
  indicadores_concepto: IndicadorConcepto[] = [];
  indicadores_dependencia: IndicadorDependencia[] = [];
  indicadores_dep_categoria: IndicadorDependenciaCategoria[] = [];
  // ==========================================
  // CONFIGURACIÓN DE GRÁFICOS
  // ==========================================
  data_categoria: any;
  options_categoria: any;

  data_dependencia: any;
  options_dependencia: any;

  data_dep_categoria: any;
  options_dep_categoria: any;

  data_concepto: any;
  options_concepto: any;


  // Versión de datos para notificar cambios
  dataVersion = signal(0);

  // Filtros con signals
  filtroDep = signal<string[]>([]);
  filtroQ = signal<string[]>([]);
  filtroCategoria = signal<string[]>([]);
  filtroConcepto = signal<string[]>([]);

  opcionesDep = signal<any[]>([]);
  opcionesQ = signal<any[]>([]);
  filtrosMinimizados = signal(false);


  // Explorador de lecciones: filtros con Signals
  busquedaLecciones = signal<string>('');

  filtroResultadoLeccion = signal<string>('todos');

  // Diálogo de detalle
  detalleVisible = signal<boolean>(false);
  detalleSeleccionado = signal<any | null>(null);

//Fecha de actualizacion
fechaArchivo = signal<string | null>(null);

  ngOnInit(): void {
      this.obtenerArchivosLecciones();

    const recuperado = this.recuperarDatosLocalmente();

    if (recuperado) {
        this.exito = true;

        this.createChartCategoria();
        this.createChartDependencia();
        this.createChartDepCategoria();
        this.createChartConcepto();
    } else {
        this.exito = false;
        console.log('No hay información guardada. Presiona Generar.');
    }
  }
  constructor(private leccionesService: LeccionesService, private messageService: MessageService,) {

  }

  opcionesDependencia = computed(() => {
    this.dataVersion();

    const valores = [...new Set(
      this.info.map(item => item.Dep).filter(Boolean)
    )];

    return valores
      .sort()
      .map(valor => ({
        label: valor,
        value: valor
      }));
  });

  datosPorDependencia = computed(() => {
    this.dataVersion();

    const filtro = this.filtroDep();

    return this.info.filter(item =>
      filtro.length === 0 || filtro.includes(item.Dep)
    );
  });

  opcionesProyecto = computed(() => {
    const datos = this.datosPorDependencia();

    const valores = [...new Set(
      datos.map(item => String(item.Q))
    )];

    return valores
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(valor => ({
        label: valor,
        value: valor
      }));
  });

  datosPorProyecto = computed(() => {
    const datos = this.datosPorDependencia();
    const filtro = this.filtroQ();

    return datos.filter(item =>
      filtro.length === 0 || filtro.includes(String(item.Q))
    );
  });

  opcionesCategoria = computed(() => {
    const datos = this.datosPorProyecto();

    const valores = [...new Set(
      datos.map(item => item['Categoría']).filter(Boolean)
    )];

    return valores
      .sort()
      .map(valor => ({
        label: valor,
        value: valor
      }));
  });

  datosPorCategoria = computed(() => {
    const datos = this.datosPorProyecto();
    const filtro = this.filtroCategoria();

    return datos.filter(item =>
      filtro.length === 0 || filtro.includes(item['Categoría'])
    );
  });

  opcionesConcepto = computed(() => {
    const datos = this.datosPorCategoria();

    const valores = [...new Set(
      datos.map(item => item['Concepto a valorar']).filter(Boolean)
    )];

    return valores
      .sort()
      .map(valor => ({
        label: valor,
        value: valor
      }));
  });

  datosFiltrados = computed(() => {
    const datos = this.datosPorCategoria();
    const filtro = this.filtroConcepto();

    return datos.filter(item =>
      filtro.length === 0 ||
      filtro.includes(item['Concepto a valorar'])
    );
  });


  cambiarDependencia(valores: string[]): void {
    this.filtroDep.set(valores);
    this.filtroQ.set([]);
    this.filtroCategoria.set([]);
    this.filtroConcepto.set([]);
  }

  cambiarProyecto(valores: string[]): void {
    this.filtroQ.set(valores);
    this.filtroCategoria.set([]);
    this.filtroConcepto.set([]);
  }

  cambiarCategoria(valores: string[]): void {
    this.filtroCategoria.set(valores);
    this.filtroConcepto.set([]);
  }

  cambiarConcepto(valores: string[]): void {
    this.filtroConcepto.set(valores);
  }

  indicadoresFiltrados = computed(() => {
    const datos = this.datosFiltrados();

    const totalProyectos = new Set(
      datos.map(item => `${item.Dep}|${item.Q}`)
    ).size;

    const totalEvaluaciones = datos.length;

    const evaluacionesValidas = datos.filter(
      item => item.Valor_Logro !== null &&
        item.Valor_Logro !== undefined
    );

    const evaluacionesRealizadas = evaluacionesValidas.length;

    const sinEvaluar = totalEvaluaciones - evaluacionesRealizadas;

    const sumaResultados = evaluacionesValidas.reduce(
      (total, item) => total + Number(item.Valor_Logro),
      0
    );

    const indiceCumplimiento = evaluacionesRealizadas > 0
      ? (sumaResultados / (2 * evaluacionesRealizadas)) * 100
      : 0;

    const porcentajeEvaluado = totalEvaluaciones > 0
      ? (evaluacionesRealizadas / totalEvaluaciones) * 100
      : 0;

    return {
      total_proyectos: totalProyectos,
      indice_cumplimiento: Number(indiceCumplimiento.toFixed(2)),
      evaluaciones_realizadas: evaluacionesRealizadas,
      evaluaciones_sin_evaluar: sinEvaluar,
      total_evaluaciones: totalEvaluaciones,
      porcentaje_evaluado: Number(porcentajeEvaluado.toFixed(2))
    };
  });

  indicadoresCategoriaFiltrados = computed(() => {
    const datos = this.datosFiltrados();

    const categorias = [...new Set(
      datos.map(item => item['Categoría'])
    )];

    return categorias.map(categoria => {
      const registros = datos.filter(
        item => item['Categoría'] === categoria
      );

      const validos = registros.filter(
        item => item.Valor_Logro !== null &&
          item.Valor_Logro !== undefined
      );

      const suma = validos.reduce(
        (total, item) => total + Number(item.Valor_Logro),
        0
      );

      return {
        'Categoría': categoria,
        total_evaluaciones: registros.length,
        evaluaciones_validas: validos.length,
        suma_resultados: suma,
        sin_evaluar: registros.length - validos.length,
        indice_cumplimiento: validos.length
          ? Number((suma / (2 * validos.length) * 100).toFixed(2))
          : 0,
        porcentaje_evaluado: registros.length
          ? Number((validos.length / registros.length * 100).toFixed(2))
          : 0
      };
    });
  });

  leccionesExplorador = computed(() => {

    const datos = this.datosFiltrados();

    const busqueda = this.busquedaLecciones()
      .trim()
      .toLocaleLowerCase();

    const resultado = this.filtroResultadoLeccion();

    return datos.filter(item => {

      // Filtro por resultado de evaluación
      const valor = item.Valor_Logro;

      const pasaResultado =
        resultado === 'todos' ||
        (
          resultado === 'sin_evaluar' &&
          (valor === null || valor === undefined)
        ) ||
        (
          resultado !== 'sin_evaluar' &&
          valor !== null &&
          valor !== undefined &&
          Number(valor) === Number(resultado)
        );

      // Búsqueda en los campos de texto
      const textoBusqueda = [
        item.Q,
        item.Dep,
        item['Categoría'],
        item['Concepto a valorar'],
        item['Situación presentada'],
        item['Acciones realizadas'],
        item['Lección aprendida']
      ]
        .map(valor => String(valor ?? ''))
        .join(' ')
        .toLocaleLowerCase();

      const pasaBusqueda =
        busqueda === '' || textoBusqueda.includes(busqueda);

      return pasaResultado && pasaBusqueda;
    });

  });

  abrirDetalleLeccion(item: any): void {

    console.log('Registro seleccionado:', item);

    this.detalleSeleccionado.set({ ...item });

    this.detalleVisible.set(true);

    console.log(
      'Situación:',
      this.detalleSeleccionado()?.['Situación presentada']
    );

    console.log(
      'Acciones:',
      this.detalleSeleccionado()?.['Acciones realizadas']
    );

    console.log(
      'Lección:',
      this.detalleSeleccionado()?.['Lección aprendida']
    );
  }

  limpiarBusquedaLecciones(): void {
    this.busquedaLecciones.set('');
    this.filtroResultadoLeccion.set('todos');
  }

  limpiarFiltros(): void {
    this.filtroDep.set([]);
    this.filtroQ.set([]);
    this.filtroCategoria.set([]);
    this.filtroConcepto.set([]);
  }

  async obtenerArchivosLecciones(): Promise<void> {
    try {
      this.archivosLecciones = await firstValueFrom(
        this.leccionesService.ObtenerArchivosLecciones()

      );

    } catch (error) {
      console.error('Error al consultar archivos:', error);
    }
  }

  async descargarLeccion(nombreArchivo: string): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.leccionesService.DescargarArchivoLecciones(nombreArchivo)
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al descargar archivo:', error);
    }
  }


  public async generarConsolidadoLecciones(): Promise<void> {

    const today = new Date();
    const anio = today.getFullYear().toString();

    const filename = `Consolidado_Lecciones_Aprendidas_${anio}`;

    this.isDisabledIntegracionLecciones = true;
    this.isdisabled = true;

    this.messageService.add({
      key: 'lecciones',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando consolidado...',
      sticky: true
    });

    try {

      // ==========================================
      // 1. GENERACIÓN DEL CONSOLIDADO
      // ==========================================
      const resp: RespuestaConsolidacionLecciones = await firstValueFrom(
        this.leccionesService.GenerarDescargasLecciones()
      );

      // ==========================================
      // 2. RECUPERAR INFORMACIÓN E INDICADORES
      // ==========================================
      this.info = resp.datos;
      this.fechaArchivo.set(resp.fecha_modificacion ?? null);
      this.indicadores = resp.indicadores;
      this.indicadores_categoria = resp.indicadores_categoria;
      this.indicadores_concepto = resp.indicadores_concepto;
      this.indicadores_dependencia = resp.indicadores_dependencia;
      this.indicadores_dep_categoria = resp.indicadores_dep_categoria;
      this.exito = true
      this.dataVersion.update(valor => valor + 1);
      this.guardarDatosLocalmente();
      console.log('Datos recibidos:', this.info);
      console.log('Indicadores generales:', this.indicadores);
      console.log('Indicadores por categoría:', this.indicadores_categoria);
      console.log('Indicadores por concepto:', this.indicadores_concepto);
      console.log('Indicadores por dependencia:', this.indicadores_dependencia);
      console.log('Indicadores dependencia y categoría:', this.indicadores_dep_categoria);
      this.createChartCategoria();
      this.createChartDependencia();
      this.createChartDepCategoria();
      this.createChartConcepto();

      console.log('Ruta del Excel:', resp.ruta);

      // ==========================================
      // 3. CONVERTIR BASE64 A BLOB
      // ==========================================
      const byteCharacters = atob(resp.archivo);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // ==========================================
      // 4. DESCARGAR EXCEL
      // ==========================================
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = resp.nombreArchivo || `${filename}.xlsx`;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('Excel generado correctamente');

      // ==========================================
      // 5. FINALIZAR
      // ==========================================
      this.isDisabledIntegracionLecciones = false;
      this.isdisabled = false;

      this.messageService.clear('lecciones');

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Consolidado generado correctamente',
        life: 1500
      });

      this.obtenerArchivosLecciones();

    } catch (error) {

      console.error('Error generando consolidado:', error);

      this.isDisabledIntegracionLecciones = false;
      this.isdisabled = false;

      this.messageService.clear('lecciones');

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un error en la generación del consolidado',
        life: 1500
      });

      return;
    }
  }
  dataCategoriaFiltrada = computed(() => {
    const datos = this.datosFiltrados();

    const categorias = [...new Set(
      datos.map(item => item['Categoría'])
    )];

    return {
      labels: categorias,
      datasets: [{
        label: 'Índice de cumplimiento',
        data: categorias.map(categoria => {
          const registros = datos.filter(
            item => item['Categoría'] === categoria
          );

          const validos = registros.filter(
            item => item.Valor_Logro !== null &&
              item.Valor_Logro !== undefined
          );

          const suma = validos.reduce(
            (total, item) => total + Number(item.Valor_Logro), 0
          );

          return validos.length
            ? Number((suma / (2 * validos.length) * 100).toFixed(2))
            : 0;
        })
      }]
    };
  });
  private createChartCategoria(): void {

    const datos = this.indicadores_categoria;

    this.data_categoria = {
      labels: datos.map(item => item['Categoría']),

      datasets: [
        {
          label: 'Índice de cumplimiento (%)',
          data: datos.map(item => item.indice_cumplimiento),
          backgroundColor: '#42A5F5',
          borderRadius: 5
        }
      ]
    };

    this.options_categoria = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value: number) => `${value}%`
          }
        }
      }
    };
  }
  dataConceptoFiltrada = computed(() => {
    const datos = this.datosFiltrados();

    const conceptos = [...new Set(
      datos.map(item => item['Concepto a valorar'])
    )];

    const resultados = conceptos.map(concepto => {

      const registros = datos.filter(
        item => item['Concepto a valorar'] === concepto
      );

      // Respuestas válidas
      const validos = registros.filter(
        item => item.Valor_Logro !== null &&
          item.Valor_Logro !== undefined
      );

      // Distribución de respuestas
      const respuestasSi = validos.filter(
        item => Number(item.Valor_Logro) === 2
      ).length;

      const respuestasParcialmente = validos.filter(
        item => Number(item.Valor_Logro) === 1
      ).length;

      const respuestasNo = validos.filter(
        item => Number(item.Valor_Logro) === 0
      ).length;

      // Índice de cumplimiento
      const suma = validos.reduce(
        (total, item) => total + Number(item.Valor_Logro),
        0
      );

      const indice = validos.length > 0
        ? Number((suma / (2 * validos.length) * 100).toFixed(2))
        : 0;

      return {
        concepto,
        indice,
        respuestasSi,
        respuestasParcialmente,
        respuestasNo,
        sinEvaluar: registros.length - validos.length,
        total: registros.length
      };
    });

    // Ordenar de menor a mayor cumplimiento
    resultados.sort((a, b) => a.indice - b.indice);

    return {
      labels: resultados.map(item => item.concepto),

      datasets: [
        {
          type: 'bar',
          label: 'Sí',
          data: resultados.map(item => item.respuestasSi),
          backgroundColor: '#16A34A',
          stack: 'respuestas'
        },
        {
          type: 'bar',
          label: 'Parcialmente',
          data: resultados.map(item => item.respuestasParcialmente),
          backgroundColor: '#EAB308',
          stack: 'respuestas'
        },
        {
          type: 'bar',
          label: 'No',
          data: resultados.map(item => item.respuestasNo),
          backgroundColor: '#DC2626',
          stack: 'respuestas'
        }
      ],

      resultados
    };
  });

private createChartConcepto(): void {

    this.options_concepto = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            mode: 'nearest',
            intersect: true
        },

        plugins: {
            legend: {
                position: 'top'
            },

            tooltip: {
                callbacks: {
                    title: (context: any) => {
                        const indice = context[0].dataIndex;

                        return this.dataConceptoFiltrada()
                            .labels[indice] ?? '';
                    },

                    afterBody: (context: any) => {
                        const indice = context[0].dataIndex;

                        const resultado = this.dataConceptoFiltrada()
                            .resultados[indice];

                        return resultado
                            ? `Índice de cumplimiento: ${resultado.indice}%`
                            : '';
                    }
                }
            }
        },

        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de evaluaciones'
                }
            },

            y: {
                stacked: true
            }
        }
    };
}
 
  dataDependenciaFiltrada = computed(() => {
    const datos = this.datosFiltrados();

    const dependencias = [...new Set(
      datos.map(item => item.Dep)
    )];

    return {
      labels: dependencias,
      datasets: [{
        label: 'Índice de cumplimiento',
        data: dependencias.map(dep => {
          const registros = datos.filter(item => item.Dep === dep);

          const validos = registros.filter(
            item => item.Valor_Logro !== null &&
              item.Valor_Logro !== undefined
          );

          const suma = validos.reduce(
            (total, item) => total + Number(item.Valor_Logro), 0
          );

          return validos.length
            ? Number((suma / (2 * validos.length) * 100).toFixed(2))
            : 0;
        })
      }]
    };
  });
  private createChartDependencia(): void {

    const datos = this.indicadores_dependencia;

    this.data_dependencia = {
      labels: datos.map(item => item.Dep),

      datasets: [
        {
          label: 'Índice de cumplimiento (%)',
          data: datos.map(item => item.indice_cumplimiento),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          borderRadius: 5
        }
      ]
    };

    this.options_dependencia = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value: number) => `${value}%`
          }
        }
      }
    };
  }
  dataDepCategoriaFiltrada = computed(() => {
    const datos = this.datosFiltrados();

    const dependencias = [...new Set(datos.map(item => item.Dep))];

    const categorias = [...new Set(
      datos.map(item => item['Categoría'])
    )];

    return {
      labels: categorias,
      datasets: dependencias.map(dep => ({
        label: dep,
        data: categorias.map(categoria => {
          const registros = datos.filter(
            item => item.Dep === dep &&
              item['Categoría'] === categoria
          );

          const validos = registros.filter(
            item => item.Valor_Logro !== null &&
              item.Valor_Logro !== undefined
          );

          const suma = validos.reduce(
            (total, item) => total + Number(item.Valor_Logro), 0
          );

          return validos.length
            ? Number((suma / (2 * validos.length) * 100).toFixed(2))
            : 0;
        })
      }))
    };
  });
  private createChartDepCategoria(): void {

    const datos = this.indicadores_dep_categoria;

    const categorias = [
      ...new Set(datos.map(item => item['Categoría']))
    ];

    const dependencias = [
      ...new Set(datos.map(item => item.Dep))
    ];

    const colores = ['#42A5F5', '#66BB6A', '#FFA726'];

    this.data_dep_categoria = {
      labels: categorias,

      datasets: dependencias.map((dep, index) => ({
        label: dep,

        data: categorias.map(categoria => {
          const registro = datos.find(
            item =>
              item.Dep === dep &&
              item['Categoría'] === categoria
          );

          return registro?.indice_cumplimiento ?? 0;
        }),

        backgroundColor: colores[index % colores.length],
        borderRadius: 5
      }))
    };

    this.options_dep_categoria = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: 'bottom'
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value: number) => `${value}%`
          }
        }
      }
    };
  }

  //----------------------------------------------PERSISTENCIA DE DATOS
  private guardarDatosLocalmente(): void {
    const datosDashboard = {
      info: this.info,
      indicadores: this.indicadores,
      indicadores_categoria: this.indicadores_categoria,
      indicadores_concepto: this.indicadores_concepto,
      indicadores_dependencia: this.indicadores_dependencia,
      indicadores_dep_categoria: this.indicadores_dep_categoria,
      fechaArchivo: this.fechaArchivo()
    };

    localStorage.setItem(
      'dashboard_lecciones',
      JSON.stringify(datosDashboard)
    );
  }

  private recuperarDatosLocalmente(): boolean {
    const datosGuardados = localStorage.getItem('dashboard_lecciones');

    if (!datosGuardados) {
      return false;
    }

    try {
      const datos = JSON.parse(datosGuardados);

      this.info = datos.info ?? [];
      this.indicadores = datos.indicadores;
      this.indicadores_categoria = datos.indicadores_categoria ?? [];
      this.indicadores_concepto = datos.indicadores_concepto ?? [];
      this.indicadores_dependencia = datos.indicadores_dependencia ?? [];
      this.indicadores_dep_categoria = datos.indicadores_dep_categoria ?? [];
      this.fechaArchivo.set(datos.fechaArchivo ?? null);

      // Notificar a los computed que dependen de this.info
      this.dataVersion.update(v => v + 1);

      return true;
    } catch (error) {
      console.error('Error recuperando el dashboard:', error);
      localStorage.removeItem('dashboard_lecciones');
      return false;
    }
  }
  closePdfModal() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.detalleVisible.set(false);
  
  }

}
