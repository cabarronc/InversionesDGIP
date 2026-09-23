import { Component, computed, effect, signal, viewChild, ViewChild } from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { Table, TableModule, TableEditCompleteEvent  } from 'primeng/table';
import { ObraService } from '../../services/obra.service';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { SortEvent } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';

import * as XLSX from 'xlsx';
import { PocketbaseService } from '../../services/pocketbase.service';
export interface DatosSED {
  id_registro_sed: string;
  cantestatal: number | null;
  cantfederal: number | null;
  cantmpal: number | null;
  cantpropios: number | null;
  canttros: number | null;
  clave_historica: string;
  clave_programatica: string;
  clave_recodificada: string;
  clave_sie: string;
  componente: string;
  dependencia: string;
  descripmeta: string;
  documentado2026: string;
  eje: string;
  es_anio_actual: boolean;
  estatus: string;
  fecha: string;
  fuente: string;
  hora: string;
  id: number;
  id_municipio: number;
  idmeta: number;
  momento: string;
  mtoestatal: number | null;
  mtofederal: number | null;
  mtompal: number | null;
  mtopropios: number | null;
  mtotros: number | null;
  municipio_nombre: string;
  nombre: string;
  nombre_plurianual: string;
  objetivo_particular: string;
  obra: boolean;
  periodo: string;
  q_concentrador: string;
  ramo: string;
  registro_presupuestal: string;
  siglas: string;
  situacionProyecto: string;
  unidad_medida: string;
  ur_historica: string;
  ur_recodificada: string;
  urd_historica: string | null;
  urd_recodificada: string | null;
}
export interface ObraExtendida {
  meta_estandarizada: string;
  clave_recodificada: string;
  Nombre_Proyecto: string;
  Siglas: string;
  Modificado_SAP: number;
  Modificado_SED: number;
  Difererencia: number;
  Conciliado: boolean;
  DatosSED: DatosSED[];
  DatosSAP: Omit<Obra, 'meta_estandarizada'>[];
}
export interface Obra {
  id_registro_sap: string;
  ASI: number;
  Area_Funcional: string;
  COMP: number;
  DEV: number;
  DEVO: number;
  Denominacion_Fondo: string;
  Descripcion_Centro_Gestor: string;
  Devengado_CONAC: number;
  Division: string;
  EJER: number;
  Entidad_CP: string;
  Fondo: string;
  Llave_Entidad: string;
  MOD: number;
  Nombre_Proyecto: string;
  Origen_Circular: string;
  Origen_Redefinido: string;
  PAG: number;
  PRE_COMP: number;
  Partida: string;
  Periodo_contable: number;
  Ramo: string;
  SAL: number;
  SGEG_OPD: string;
  SUP: number;
  Siglas: string;
  TOT_EJER: number;
  claveCompuesta: string;
  clave_recodificada: string;
  descripcion_centro_gestor_recodificado: string;
  descripcion_centro_gestor_recodificado_02: string;
  meta_estandarizada: string;
  ramo_aux: string;
  ur_recodificada: string;
  es_anio_actual: boolean;
  fecha_actualizacion: string;
}

@Component({
  selector: 'app-obra',
  imports: [ChartModule, ButtonModule, ProgressSpinnerModule, SkeletonModule, CardModule, CurrencyPipe,
    DecimalPipe, SelectButtonModule, FormsModule, SelectModule, TableModule, TagModule, InputTextModule, InputNumberModule, FluidModule],
  templateUrl: './obra.component.html',
  styleUrl: './obra.component.scss',
})
export class ObraComponent {
  @ViewChild('chartOrigen') chartOrigen?: UIChart;
  chartOrigenVisible = true;
  isSorted: boolean | null = null;
  dt = viewChild<Table>('dt');
  public Obra: Obra[] = [];
  public ObrasExtendida: ObraExtendida[] = [];
  public ObrasEntidad: Obra[] = [];
  public ObrasGEG: Obra[] = [];
  fechaActual: string = '';
  loading = signal(false);
  cargado = signal(false);
  // Opciones del filtro
  filtroOpciones = [
    { label: 'Ejercicio', value: null },
    { label: 'Actual', value: true },
    { label: 'Refrendos', value: false }
  ];
  filtroSiglas = signal<string | null>(null); //Filtro de dependencia y entidades
  filtroOrigenOpciones = [
    { label: 'Origen', value: null },
    { label: 'Estatal', value: 'Estatal' },
    { label: 'Federal', value: 'Federal' },
    { label: 'Ramo 33', value: 'Ramo 33' },
    { label: 'Deuda', value: 'Deuda' }

  ];
  filtroActual = signal<boolean | null>(null);//Filtro Ejercicio o refrendos
  filtroOrigen = signal<string | null>(null);//Filtro Origen del Recurso
  // KPIs
  kpis = signal({
    totalAsignado: 0,
    totalModificado: 0,
    totalDvengado: 0,
    totalEjercido: 0,
    porcentajeAvance: 0,
    saldo: 0,
    totalProyectos: 0
  });

  data_origen: any;
  options_origen: any;
  data_mensual: any;
  options_mensual: any;
  //TABLA JERARQUICA
  initialValue!: ObraExtendida[];
  private ObrasOriginal: ObraExtendida[] = [];
  expandedRows: { [key: string]: boolean } = {};
  municipios = [
    { id_municipio: 1, municipio_nombre: 'ABASOLO' },
    { id_municipio: 2, municipio_nombre: 'ACAMBARO' },
    { id_municipio: 3, municipio_nombre: 'SAN MIGUEL DE ALLENDE' },
    { id_municipio: 4, municipio_nombre: 'APASEO EL ALTO' },
    { id_municipio: 5, municipio_nombre: 'APASEO EL GRANDE' },
    { id_municipio: 6, municipio_nombre: 'ATARJEA' },
    { id_municipio: 7, municipio_nombre: 'CELAYA' },
    { id_municipio: 8, municipio_nombre: 'MANUEL DOBLADO' },
    { id_municipio: 9, municipio_nombre: 'COMONFORT' },
    { id_municipio: 10, municipio_nombre: 'CORONEO' },
    { id_municipio: 11, municipio_nombre: 'CORTAZAR' },
    { id_municipio: 12, municipio_nombre: 'CUERAMARO' },
    { id_municipio: 13, municipio_nombre: 'DOCTOR MORA' },
    { id_municipio: 14, municipio_nombre: 'DOLORES HIDALGO' },
    { id_municipio: 15, municipio_nombre: 'GUANAJUATO' },
    { id_municipio: 16, municipio_nombre: 'HUANIMARO' },
    { id_municipio: 17, municipio_nombre: 'IRAPUATO' },
    { id_municipio: 18, municipio_nombre: 'JARAL DEL PROGRESO' },
    { id_municipio: 19, municipio_nombre: 'JERECUARO' },
    { id_municipio: 20, municipio_nombre: 'LEON' },
    { id_municipio: 21, municipio_nombre: 'MOROLEON' },
    { id_municipio: 22, municipio_nombre: 'OCAMPO' },
    { id_municipio: 23, municipio_nombre: 'PENJAMO' },
    { id_municipio: 24, municipio_nombre: 'PUEBLO NUEVO' },
    { id_municipio: 25, municipio_nombre: 'PURISIMA DEL RINCON' },
    { id_municipio: 26, municipio_nombre: 'ROMITA' },
    { id_municipio: 27, municipio_nombre: 'SALAMANCA' },
    { id_municipio: 28, municipio_nombre: 'SALVATIERRA' },
    { id_municipio: 29, municipio_nombre: 'SAN DIEGO DE LA UNION' },
    { id_municipio: 30, municipio_nombre: 'SAN FELIPE' },
    { id_municipio: 31, municipio_nombre: 'SAN FRANCISCO DEL RINCON' },
    { id_municipio: 32, municipio_nombre: 'SAN JOSE ITURBIDE' },
    { id_municipio: 33, municipio_nombre: 'SAN LUIS DE LA PAZ' },
    { id_municipio: 34, municipio_nombre: 'SANTA CATARINA' },
    { id_municipio: 35, municipio_nombre: 'SANTA CRUZ DE JUVENTINO ROSAS' },
    { id_municipio: 36, municipio_nombre: 'SANTIAGO MARAVATIO' },
    { id_municipio: 37, municipio_nombre: 'SILAO DE LA VICTORIA' },
    { id_municipio: 38, municipio_nombre: 'TARANDACUAO' },
    { id_municipio: 39, municipio_nombre: 'TARIMORO' },
    { id_municipio: 40, municipio_nombre: 'TIERRA BLANCA' },
    { id_municipio: 41, municipio_nombre: 'URIANGATO' },
    { id_municipio: 42, municipio_nombre: 'VALLE DE SANTIAGO' },
    { id_municipio: 43, municipio_nombre: 'VICTORIA' },
    { id_municipio: 44, municipio_nombre: 'VILLAGRAN' },
    { id_municipio: 45, municipio_nombre: 'XICHU' },
    { id_municipio: 46, municipio_nombre: 'YURIRIA' },
    { id_municipio: 50, municipio_nombre: 'Cobertura Estatal' },
    { id_municipio: 51, municipio_nombre: 'Por Determinar' }
  ];
  constructor(private obraService: ObraService, private pocketBaseService: PocketbaseService,) {
    effect(() => {
      // se re-ejecuta automáticamente cuando cambian obraFiltrada(), obrasGegFiltrada(), etc.
      if (this.cargado()) {
        this.calcularKPIs();
        this.createChartGEG();
        this.createChartEnt();
        this.createChartOrigen();
        this.createChartMensual();
      }
    });

  }
  data_geg: any;
  data_ent: any;
  options: any;
  private observer!: MutationObserver;

  //Filtros con signals
  obraFiltrada = computed(() => {
    const filtroActualVal = this.filtroActual();
    const filtroSiglasVal = this.filtroSiglas();
    const filtroOrigenVal = this.filtroOrigen();
    return this.Obra.filter(o => {
      const pasaActual = filtroActualVal === null || o.es_anio_actual === filtroActualVal;
      const pasaSiglas = filtroSiglasVal === null || o.Siglas === filtroSiglasVal;
      const pasaOrigen = filtroOrigenVal === null || o.Origen_Circular === filtroOrigenVal;
      return pasaActual && pasaSiglas && pasaOrigen;
    });
  });

  obrasGegFiltrada = computed(() =>
    this.obraFiltrada().filter(o => o["SGEG_OPD"] === "GEG")
  );

  obrasEntidadFiltrada = computed(() =>
    this.obraFiltrada().filter(o => o["SGEG_OPD"] === "ENTIDAD")
  );
  siglasOpciones = computed(() => {
    const siglas = new Set(this.Obra.map(o => o.Siglas));
    return [
      { label: 'Todas DoE', value: null },
      ...Array.from(siglas).sort().map(s => ({ label: s, value: s }))
    ];
  });
  private unsubEdiciones?: () => void;
private unsubEliminados?: () => void;
  async ngOnInit(): Promise<void>  {
    this.GetObra()
     this.unsubEdiciones = await this.pocketBaseService.suscribirEdiciones((e) => {
    if (e.action === 'create' || e.action === 'update') this.aplicarEdicion(e.record);
  });
  this.unsubEliminados = await this.pocketBaseService.suscribirEliminados((e) => {
    if (e.action === 'create') this.aplicarEliminacion(e.record);
  });
  }
  ngAfterViewInit() {

    this.observer = new MutationObserver(() => {
      this.createChartGEG();
      this.createChartEnt();
      this.createChartOrigen();
      this.createChartMensual();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  //Services
  public GetObra() {
    this.cargado.set(false);
    this.obraService.GetObra().subscribe(
      async  (data) => {
        console.log('data:', data);
        console.log('es arreglo:', Array.isArray(data.Obra));
        this.ObrasExtendida = data.Obra as ObraExtendida[];
        // 1. Aplica ediciones y eliminaciones ya guardadas por cualquier usuario
        const [ediciones, eliminados] = await Promise.all([
          this.pocketBaseService.cargarEdiciones(),
          this.pocketBaseService.cargarEliminados()
        ]);
        ediciones.forEach(e => this.aplicarEdicion(e));
        eliminados.forEach(e => this.aplicarEliminacion(e));

        this.ObrasOriginal = structuredClone(this.ObrasExtendida);
        console.log('Obra Original:', this.ObrasOriginal);
        this.initialValue = [...this.ObrasOriginal];
        // Lista plana como antes: cada registro SAP con su meta_estandarizada
        this.Obra = this.ObrasExtendida.flatMap(o =>
          o.DatosSAP.map(s => ({ ...s, meta_estandarizada: o.meta_estandarizada }))
        );
        this.fechaActual = this.Obra[0]?.fecha_actualizacion ?? '';


        this.ObrasEntidad = this.Obra.filter(
          obra => obra["SGEG_OPD"] === "ENTIDAD"
        );

        this.ObrasGEG = this.Obra.filter(
          obra => obra["SGEG_OPD"] === "GEG"
        );
        this.calcularKPIs();
        this.cargado.set(true);
        console.log("Obra", data.Obra)
        this.createChartGEG();
        this.createChartEnt();
        this.createChartOrigen();
        this.createChartMensual();
      },
      (error) => {
        console.log(error)

      }
    );
  }

  private aplicarEdicion(e: any) {
    if (e.tabla === 'Obra') {
      const obra = this.ObrasExtendida.find(o => o.meta_estandarizada === e.registro_id);
      if (obra) (obra as any)[e.campo] = e.valor;
    } else if (e.tabla === 'SAP') {
      for (const obra of this.ObrasExtendida) {
        const reg = obra.DatosSAP.find(s => s.id_registro_sap === e.registro_id);
        if (reg) { (reg as any)[e.campo] = e.valor; break; }
      }
    } else if (e.tabla === 'SED') {
      for (const obra of this.ObrasExtendida) {
        const reg = obra.DatosSED.find(s => s.id_registro_sed === e.registro_id);
        if (reg) { (reg as any)[e.campo] = e.valor; break; }
      }
    }
  }

  private aplicarEliminacion(e: any) {
    if (e.tabla === 'Obra') {
      this.ObrasExtendida = this.ObrasExtendida.filter(o => o.meta_estandarizada !== e.registro_id);
    } else if (e.tabla === 'SAP') {
      for (const obra of this.ObrasExtendida) {
        obra.DatosSAP = obra.DatosSAP.filter(s => s.id_registro_sap !== e.registro_id);
      }
    } else if (e.tabla === 'SED') {
      for (const obra of this.ObrasExtendida) {
        obra.DatosSED = obra.DatosSED.filter(s => s.id_registro_sed !== e.registro_id);
      }
    }
  }

  private calcularKPIs() {
    const datos = this.obraFiltrada();
    const totalAsignado = datos.reduce((acc, o) => acc + (o.ASI ?? 0), 0);
    const totalModificado = datos.reduce((acc, o) => acc + (o.MOD ?? 0), 0);
    const totalDvengado = datos.reduce((acc, o) => acc + (o.Devengado_CONAC ?? 0), 0);
    const totalEjercido = datos.reduce((acc, o) => acc + (o.TOT_EJER ?? 0), 0);
    const saldo = datos.reduce((acc, o) => acc + (o.SAL ?? 0), 0);
    const totalProyectos = new Set(datos.map(o => o.clave_recodificada)).size;

    this.kpis.set({
      totalAsignado,
      totalModificado,
      totalDvengado,
      totalEjercido,
      porcentajeAvance: totalModificado > 0 ? (totalEjercido / totalModificado) * 100 : 0,
      saldo,
      totalProyectos
    });
  }

  private createChartOrigen() {

    const datos = this.obraFiltrada();

    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue('--p-text-color').trim();

    const modFederal = datos
      .filter(o => o['Origen_Circular'] === 'Federal')
      .reduce((acc, o) => acc + (o.MOD ?? 0), 0);

    const modEstatal = datos
      .filter(o => o['Origen_Circular'] === 'Estatal')
      .reduce((acc, o) => acc + (o.MOD ?? 0), 0);

    const modRamo = datos
      .filter(o => o['Origen_Circular'] === 'Ramo 33')
      .reduce((acc, o) => acc + (o.MOD ?? 0), 0);

    const modDeuda = datos
      .filter(o => o['Origen_Circular'] === 'Deuda')
      .reduce((acc, o) => acc + (o.MOD ?? 0), 0);

    const modIndefinido = datos
      .filter(o => o['Origen_Circular'] === null)
      .reduce((acc, o) => acc + (o.MOD ?? 0), 0);

    const valores = [modEstatal, modFederal, modRamo, modDeuda, modIndefinido];
    const labels = ['Estatal', 'Federal', 'Ramo 33', 'Deuda', 'Indefinido'];
    const total = valores.reduce((acc, valor) => acc + valor, 0);

    // 👇 Aquí calculamos el porcentaje DIRECTO en el texto del label,
    // en vez de hacerlo en generateLabels
    const labelsConPorcentaje = labels.map((label, i) => {
      const porcentaje = total > 0 ? ((valores[i] / total) * 100).toFixed(2) : '0.00';
      return `${label} - ${porcentaje}%`;
    });


    this.data_origen = {
      labels: labelsConPorcentaje,
      datasets: [
        {
          data: valores,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#da0d0d']
        }
      ]
    };

    this.options_origen = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          }
        }
      }
    };


  }



  private createChartMensual() {
    const datos = this.obraFiltrada();
    const styles = getComputedStyle(document.documentElement);

    const textColor = styles.getPropertyValue('--p-text-color').trim();
    console.log('Color del texto:', textColor);
    const borderColor = styles.getPropertyValue('--p-content-border-color').trim();

    const acumuladoPorMes = datos.reduce((acc, o) => {

      const mes = o['Periodo_contable']; // *Warning

      if (!acc[mes]) {
        acc[mes] = {
          ASI: 0,
          MOD: 0,
          DEVENGADO: 0
        };
      }

      acc[mes].ASI += (o.ASI ?? 0);
      acc[mes].MOD += (o.MOD ?? 0);
      acc[mes].DEVENGADO += (o.Devengado_CONAC ?? 0); //*Warning

      return acc;

    }, {} as Record<number, {
      ASI: number;
      MOD: number;
      DEVENGADO: number;
    }>);

    const meses = Object.keys(acumuladoPorMes)
      .map(Number)
      .sort((a, b) => a - b);

    const nombresMes = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    this.data_mensual = {

      labels: meses.map(m => nombresMes[m - 1]),

      datasets: [

        {
          label: 'Asignado',
          data: meses.map(m => acumuladoPorMes[m].ASI),
          fill: false,
          borderColor: '#66BB6A',
          tension: 0.3
        },

        {
          label: 'Modificado',
          data: meses.map(m => acumuladoPorMes[m].MOD),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.3
        },

        {
          label: 'Devengado CONAC',
          data: meses.map(m => acumuladoPorMes[m].DEVENGADO),
          fill: false,
          borderColor: '#FFA726',
          tension: 0.3
        }

      ]
    };

    this.options_mensual = {

      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {

        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: borderColor
          }
        },

        y: {
          ticks: {
            color: textColor
          },
          grid: {
            color: borderColor
          }
        }

      }

    };
  }

  loadObra() {
    this.loading.set(true);
    const today = new Date();
    const codigoFecha =
      today.getFullYear().toString().slice(-2) +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    const nombre = `Obra${codigoFecha}`;

    console.log(nombre);

    this.obraService.GenerarDescargasObra(nombre).subscribe(
      (data) => {
        const blob = data.body!;

        // Descargar PPTX
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombre}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);

        console.log('PPTX generado correctamente');
        this.loading.set(false);
      },
      (error) => {
        console.log(error)

      }
    );


  }



  private createChartGEG() {
    const datosO = this.obrasGegFiltrada();
    const styles = getComputedStyle(document.documentElement);

    const textColor = styles.getPropertyValue('--p-text-color').trim();

    const borderColor =
      styles.getPropertyValue('--p-content-border-color').trim();


    const acumulado = datosO.reduce((acc, obra) => {
      const sigla = obra.Siglas;

      if (!acc[sigla]) {
        acc[sigla] = 0;
      }

      acc[sigla] += obra.MOD;

      return acc;
    }, {} as Record<string, number>);

    const datos = Object.entries(acumulado)
      .sort(([, valorA], [, valorB]) => valorB - valorA);

    const Siglas = datos.map(([sigla]) => sigla);
    const Modificados = datos.map(([, valor]) => valor);


    this.data_geg = {
      labels: Siglas,
      datasets: [
        {
          label: 'Recurso Modificado SGEG',
          data: Modificados
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x: {
          type: 'category',

          ticks: {
            color: textColor,

            // Forzar etiquetas horizontales
            minRotation: 0,
            maxRotation: 0,

            // No permitir que Chart.js las rote
            autoSkip: false,

            // Centrar las etiquetas
            align: 'center'
          },

          grid: {
            color: borderColor
          }
        },

        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 200_000_00,

          },
          grid: {
            color: borderColor
          }
        }
      }
    };
  }
  private createChartEnt() {
    const datosO = this.obrasEntidadFiltrada();
    const styles = getComputedStyle(document.documentElement);

    const textColor =
      styles.getPropertyValue('--p-text-color').trim();

    const borderColor =
      styles.getPropertyValue('--p-content-border-color').trim();


    const acumulado = datosO.reduce((acc, obra) => {
      const sigla = obra.Siglas;

      if (!acc[sigla]) {
        acc[sigla] = 0;
      }

      acc[sigla] += obra.MOD;

      return acc;
    }, {} as Record<string, number>);

    const datos = Object.entries(acumulado)
      .sort(([, valorA], [, valorB]) => valorB - valorA);

    const Siglas = datos.map(([sigla]) => sigla);
    const Modificados = datos.map(([, valor]) => valor);

    this.data_ent = {
      labels: Siglas,
      datasets: [
        {
          label: 'Recurso Modificado Entidades',
          data: Modificados
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x: {
          type: 'category',

          ticks: {
            color: textColor,

            // Forzar etiquetas horizontales
            minRotation: 0,
            maxRotation: 0,

            // No permitir que Chart.js las rote
            autoSkip: false,

            // Centrar las etiquetas
            align: 'center'
          },

          grid: {
            color: borderColor
          }
        },

        y: {
          ticks: {
            color: textColor
          },

          grid: {
            color: borderColor
          }
        }
      }
    };
  }

  //ESTRUCTURA PARA TABLA JERARQUICA
  getRefrendolabel(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'warn';
      default:
        return 'secondary';
    }
  }
  getRefrendoValue(status: boolean) {
    switch (status) {
      case true:
        return 'actual';
      case false:
        return 'refrendo';
      default:
        return 'secondary';
    }
  }

  getConciliacionlabel(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'warn';
      default:
        return 'secondary';
    }
  }
  getConcilacionValue(status: boolean) {
    switch (status) {
      case true:
        return 'Si';
      case false:
        return 'No';
      default:
        return 'indefinido';
    }
  }
  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.ObrasOriginal = [...this.initialValue];
      this.dt()?.reset();
    }
  }
  sortTableData(event: SortEvent) {
    event.data!.sort((data1: any, data2: any) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result: number;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }

  eliminarObra(obra: ObraExtendida) {
    this.ObrasExtendida = this.ObrasExtendida.filter(
      o => o.meta_estandarizada !== obra.meta_estandarizada
    );
    this.pocketBaseService.guardarEliminacion(obra.meta_estandarizada, 'Obra');
  }

  eliminarSAP(obra: ObraExtendida, sap: any) {
    obra.DatosSAP = obra.DatosSAP.filter(s => s.id_registro_sap !== sap.id_registro_sap);
     this.pocketBaseService.guardarEliminacion(sap.id_registro_sap, 'SAP');
  }

  eliminarSED(obra: ObraExtendida, sed: DatosSED) {
    obra.DatosSED = obra.DatosSED.filter(s => s.id_registro_sed !== sed.id_registro_sed);
     this.pocketBaseService.guardarEliminacion(sed.id_registro_sed, 'SED');
  }
 onSedEditComplete(event: TableEditCompleteEvent) {
   if (!event.data || !event.field) return;
  const data = event.data as DatosSED;
  const field = event.field;
  this.pocketBaseService.guardarEdicion(
    data.id_registro_sed, 'SED', field, (data as any)[field]
  );
}

onSapEditComplete(event: TableEditCompleteEvent) {
   if (!event.data || !event.field) return;

  const data = event.data;
  const field = event.field;

  this.pocketBaseService.guardarEdicion(
    data.id_registro_sap,
    'SAP',
    field,
    (data as any)[field]
  );
}
  restaurar() {
    this.ObrasExtendida = structuredClone(this.ObrasOriginal);
  }

  exportarExcel() {
    const wb = XLSX.utils.book_new();

    const padres = this.ObrasExtendida.map(({ DatosSED, DatosSAP, ...resto }) => resto);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(padres), 'Obras');

    const sed = this.ObrasExtendida.flatMap(o =>
      (o.DatosSED ?? []).map((s: any) => ({ meta_estandarizada: o.meta_estandarizada, ...s })));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sed), 'DatosSED');

    const sap = this.ObrasExtendida.flatMap(o =>
      (o.DatosSAP ?? []).map((s: any) => ({ meta_estandarizada: o.meta_estandarizada, ...s })));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sap), 'DatosSAP');

    XLSX.writeFile(wb, 'obras.xlsx');
  }

  ngOnDestroy() {
    this.observer?.disconnect();
     this.pocketBaseService.desuscribirTodo();
  }


}
