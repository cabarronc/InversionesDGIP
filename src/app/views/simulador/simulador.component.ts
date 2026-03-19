import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { KENDO_GAUGES } from "@progress/kendo-angular-gauges";
import { KENDO_SLIDER } from "@progress/kendo-angular-inputs";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { AuthService, User } from '../../services/auth.service';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_DIALOGS } from "@progress/kendo-angular-dialog";
declare var window: any;
import { KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormsModule } from '@angular/forms';
import { KENDO_ICONS } from "@progress/kendo-angular-icons";
import { paperclipIcon, infoSolidIcon, imageIcon, accessibilityIcon, dollarIcon, buildingsOutlineIcon, trashIcon, mapMarkerIcon } from "@progress/kendo-svg-icons";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DecimalPipe } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { StorageService } from '../../services/storage.service';
import {
  KENDO_PROGRESSBARS,
  LabelSettings,
} from "@progress/kendo-angular-progressbar";
import { FaceComponent } from '../animaciones/face/face.component';
import { NumberFormatService } from '../../helpers/number-format.service';
// Validacion de No cero y menor a 50mil
export function noCeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toString().trim();

  if (!value) {
    return null;
  }

  const numberValue = Number(value);

  if (numberValue === 0) {
    return { noCero: true };
  }

  if (numberValue < 50000) {
    return { mayorA50Mil: true };
  }

  return null;
}

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [KENDO_ICONS, TooltipModule, ReactiveFormsModule, KENDO_DROPDOWNS, KENDO_SLIDER, KENDO_GAUGES, KENDO_LABELS, KENDO_LAYOUT,
    KENDO_BUTTONS, KENDO_PROGRESSBARS, KENDO_INPUTS, KENDO_INDICATORS, FormsModule, DecimalPipe, CommonModule, KENDO_DIALOGS, NotificationModule],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.scss'
})
export class SimuladorComponent implements OnInit {
  estadoActual: 'happy' | 'neutral' | 'sad' = 'neutral';
  public mask_monto = "999,000,000";
  recibirEstado(mood: string) {
    console.log('Nuevo estado:', mood);
  }
  @ViewChild('notification', { read: ViewContainerRef })
  public notificationContainer!: ViewContainerRef;

  CalculoDp() {
    throw new Error('Method not implemented.');
  }
  mostrarConfirmacion = false;
  dictaminacion = ''
  mensajeError = '';
  mensajeConfirmacionterminacion = '';
  mostrar = false;
  mostrar_c = false;
  pdfUrl: string = '';
  mostrarPdf = false;
  public resultadoFinal = ''
  public form: FormGroup;
  public formSimulacion: FormGroup;
  public icons = {
    paperclip: paperclipIcon, infoSolidIcon: infoSolidIcon, imageIcon: imageIcon, accessibilityIcon: accessibilityIcon, dollarIcon: dollarIcon,
    buildingsOutlineIcon: buildingsOutlineIcon, trashIcon: trashIcon, mapMarkerIcon: mapMarkerIcon
  };
  listItems: any[] = [];
  listSim: any[] = [];
  clave: string = ''
  fecha: Date = new Date()
  Pon1!: number | null;
  Pon2!: number | null;
  Pon3!: number | null;
  Pon4!: number | null;
  Pon5!: number | null;
  Pon6!: number | null;
  Pon7!: number | null;
  Pon8!: number | null;
  Pon9!: number | null;
  Pon10!: number | null;
  Pon11!: number | null;
  Pon12!: number | null;
  Pon13!: number | null;
  Pon14!: number | null;
  Pon15!: number | null;
  color1!: string | null;
  color2!: string | null;
  color3!: string | null;
  color4!: string | null;
  color5!: string | null;
  color6!: string | null;
  color7!: string | null;
  color8!: string | null;
  color9!: string | null;
  color10!: string | null;
  color11!: string | null;
  color12!: string | null;
  color13!: string | null;
  color14!: string | null;
  color15!: string | null;
  cantidadBol = true
  cantidadProyMax = false
  public CalProm!: number;
  public label: LabelSettings = {
    visible: true,
    format: "percent",
    position: "start",
  };
  top = 0;
  left = 0;
  top2 = 0;
  left2 = 0;
  currentUser: User | null = null;
  topBarraRacionalidad: number = 113;
  topBarraImpactoSocial: number = 139;
  topBarraImpactoEconomico: number = 166;
  public opened = false;
  public dataSaved = false;
  public opened2 = false;
  public dataSaved2 = false;
  public currentStep = 0;
  public crear = true;
  public simuala = false;
  public compara = false;
  public continuidad = false
  public label1 = 'Crear'
  public label2 = 'Simular'
  public label3 = 'Comparar'
  public label4 = 'Terminar'
  public steps = [
    { label: this.label1, isValid: true, emoji: "⚙️" },
    { label: this.label2, isValid: true, emoji: "🖥️" },
    { label: this.label3, isValid: true, emoji: "🆚" },
    { label: this.label4, isValid: true, emoji: "✅" },
  ];
  itemSeleccionado: any = null;
  SimulacionSeleccionada: any = null;
  SinContinuidad = true
  Getsimulaciones: any[] = []
  variables: number[] = [];
  ids: number[] = [];
  // Estilos de la barra de progreso
  public progressStyles: { [key: string]: string } = {
    color: "",
    background: ""
  };
  public progressStyles2: { [key: string]: string } = {
    color: "",
    background: ""
  };
  public progressStyles3: { [key: string]: string } = {
    color: "",
    background: ""
  };
  // Variables de Totales
  TotalRacionalidad!: number | null;
  TotalSocial!: number | null;
  TotalEconomico!: number | null;
  CalGlob!: number | null;
  public animation = true;
  valorSeleccionado: number | null = null;
  valorSeleccionado1: number | null = null;
  valorSeleccionado2: number | null = null;
  valorSeleccionado3: number | null = null;
  valorSeleccionado4: number | null = null;
  valorSeleccionado5: number | null = null;
  valorSeleccionado6: number | null = null;
  valorSeleccionado7: number | null = null;
  valorSeleccionado8: number | null = null;
  valorSeleccionado9: number | null = null;
  valorSeleccionado10: number | null = null;
  valorSeleccionado11: number | null = null;
  valorSeleccionado12: number | null = null;
  valorSeleccionado13: number | null = null;
  valorSeleccionado14: number | null = null;
  valorSeleccionado15: number | null = null;

  cantidad_simulacion: number = 0
  cantidad_proy: number = 0
  //------------------------------ Racionalidad Pública --------------------------
  // Gasto de administración 
  public OpRP1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Gastaré hasta un 5% del presupuesto en esos conceptos", value: 3 },
    { text: "Gastaré de un 11 a un 15% en esos conceptos", value: 2 },
    { text: "Gastaré de un 11 a un 15% en esos conceptos", value: 1 },
    { text: "Gastaré más del 15% en esos conceptos", value: 0 },

  ];
  // Grado de preparación técnica
  public OpRP2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Se tienen todos los estudios, trámites o documentos que se necesitan para realizar mi proyecto", value: 4 },
    { text: "Falta algún estudio o trámite, o alguno de los documentos está incompleto, pero falta poco para completarlos", value: 3 },
    { text: "Los estudios, trámites o documentos están incompletos y llevará algo de tiempo completarlos", value: 2 },
    { text: "No se tienen los estudios, trámites o documentos que se necesitan para realizar mi proyecto", value: 1 },

  ];
  // Desempeño Historico
  public OpRP3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Se cumplieron las metas planteadas, se concluyó en tiempo y no se gastó más de lo planeado", value: 4 },
    { text: "Se cumplieron las metas planteadas sin gastar más de lo planeado, pero no se concluyó en tiempo", value: 3 },
    { text: "Se cumplieron las metas planteadas, pero se gastó más de lo planeado y no se concluyó en tiempo", value: 2 },
    { text: "No se cumplieron las metas planteadas, y se gastó más de lo planeado o no se concluyó en tiempo", value: 1 },

  ];
  // Fuente Financiamiento
  public OpRP4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "El total de mi proyecto puede pagarse con recursos “etiquetados”", value: 3 },
    { text: "Más del 90% del presupuesto de mi proyecto puede pagarse con recursos “etiquetados”", value: 2 },
    { text: "Hasta un 90% del presupuesto de mi proyecto puede pagarse con recursos “etiquetados”", value: 1 },
    { text: "El total de mi proyecto debe pagarse con recursos “de libre disposición”", value: 0 },

  ];
  // Inversion Productiva
  public OpRP5: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Todo el presupuesto de mi proyecto es para inversión productiva", value: 4 },
    { text: "Más del 85% del presupuesto es para inversión productiva", value: 3 },
    { text: "Entre un 31 y un 85% del presupuesto es para inversión productiva", value: 2 },
    { text: "Hasta un 30% del presupuesto es para inversión productiva", value: 1 },
    { text: "Mi proyecto no considera inversión productiva", value: 0 },

  ];
  // Cobertura de la poblacion objetivo
  public OpRP6: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Más del 80% de la población objetivo será beneficiada directamente", value: 4 },
    { text: "Entre un 56 y un 80% de la población objetivo será beneficiada directamente", value: 3 },
    { text: "Entre un 31 y un 55% de la población objetivo será beneficiada directamente", value: 2 },
    { text: "Menos del 31% de la población objetivo será beneficiada directamente", value: 1 },

  ];
  public OpRP7: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Más del 50% del presupuesto será aportado por esas fuentes", value: 4 },
    { text: "Entre un 91 y un 50% del presupuesto será aportado por esas fuentes", value: 3 },
    { text: "Entre un 66 y 90 % del presupuesto será aportado por esas fuentes", value: 2 },
    { text: "Hasta 65% del presupuesto será aportado por esas fuentes", value: 1 },
    { text: "No se tiene planeada la aportación de recursos de esas fuentes, sólo del presupuesto estatal", value: 0 },

  ];
  //----------------------------Impacto Social
  // Igualdad de Genero * 
  public OpIS1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Sí, mi proyecto incluye acciones específicas para mejorar directamente las oportunidades de las mujeres en alguno de esos aspectos", value: 2 },
    { text: "Sí, mi proyecto incluye acciones para mejorar las oportunidades de las mujeres en alguno de esos aspectos, pero de manera indirecta", value: 1 },
    { text: "Mi proyecto no incluye acciones específicas para mejorar las oportunidades de las mujeres en esos aspecto", value: 0 },
  ];
  // Atencion a municipios con rezago social
  public OpIS2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Realizaré mi proyecto en un municipio con rezago social medio", value: 2 },
    { text: "Realizaré mi proyecto en un municipio con rezago social bajo", value: 1 },
    { text: "Realizaré mi proyecto en un municipio con rezago social muy bajo", value: 0 },
  ];
  // Subsidios Sociales *
  public OpIS3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto entregará ayudas sociales directamente a las personas", value: 2 },
    { text: "Mi proyecto entregará ayudas sociales a asociaciones o instituciones que atienden a personas vulnerables", value: 1 },
    { text: "Mi proyecto no consiste en entregar ayudas sociales", value: 0 },

  ];
  // Incidencia ODS
  public OpIS4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto incluye alguna de las siguientes acciones: promover la educación, capacitación y empleo de personas jóvenes; realizar obras en parques, plazas e instalaciones deportivas públicas; realizar obras de agua potable y drenaje para viviendas; incrementar el ingreso de las personas; promover la finalización del nivel preparatoria", value: 3 },
    { text: "Mi proyecto incluye algunas de las siguientes acciones: capacitar a personas empleadas; crear empleos permanentes en cualquier actividad; incrementar la conectividad a internet", value: 2 },
    { text: "Mi proyecto incluye alguna de las siguientes acciones: mejorar la alimentación de personas vulnerables; promover la finalización del nivel secundaria; disminuir las muertes por enfermedades crónicas; alfabetizar a personas 15 años o más; realizar obras de electrificación para viviendas", value: 1 },
    { text: "Mi proyecto no incluye ninguna de las acciones anteriores", value: 0 },

  ];
  // Incidencia Pobreza
  public OpIS5: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto incluye alguna de las siguientes acciones: promover el estudio del nivel educativo obligatorio, según la edad de las personas; mejorar la alimentación de personas vulnerables", value: 3 },
    { text: "Mi proyecto incluye alguna de las siguientes acciones: incrementar el ingreso de las personas en pobreza; mejorar los materiales y el número de habitaciones de las viviendas", value: 2 },
    { text: "Mi proyecto incluye alguna de las siguientes acciones: mejorar el acceso de las personas a servicios de salud; realizar obras de agua potable, drenaje y electrificación para viviendas", value: 1 },
    { text: "Mi proyecto no incluye ninguna de las acciones anteriores", value: 0 },

  ];
  // ------------------------------- Impacto Ecónomico
  // Empleos temporales
  public OpIE1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto tendrá efecto en la creación de más de 175 empleos temporales", value: 3 },
    { text: "Mi proyecto tendrá efecto en la creación de 76 a 175 empleos temporales", value: 2 },
    { text: "Mi proyecto tendrá efecto en la creación de hasta 75 empleos temporales", value: 1 },
    { text: "Mi proyecto no tendrá efecto en la creación de empleos temporales", value: 0 },

  ];
  // Actividad Economica
  public OpIE2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto puede vincularse con la actividad manufacturera (fabricación o ensamble de productos)", value: 2 },
    { text: "Mi proyecto puede vincularse con alguna de las siguientes actividades: comercio (compra y venta de bienes, materias primas y suministros); transporte de personas y de carga; hotelería, alojamiento y preparación de alimentos y bebidas", value: 1 },
    { text: "Mi proyecto no puede vincularse con alguna de las actividades anteriores", value: 0 },
  ];
  //Empleos permanentes
  public OpIE3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Mi proyecto tendrá efecto en la creación de más de 1,000 empleos permanentes", value: 2 },
    { text: "Mi proyecto tendrá efecto en la creación de hasta 1,000 empleos permanentes", value: 1 },
    { text: "Mi proyecto no tendrá efecto en la creación de empleos permanentes", value: 0 },
  ];

  //contador de letras
  public charachtersCount: number;
  public counter: string
  public maxlength = 1200;
  public charachtersCountNom: number;
  public counterNom: string
  public maxlengthNom = 150;
  previousStep = 0;

  windowInfoAbierto = false;

  public image = "https://github.com/cabarronc/RecursosMultimedia/blob/main/Atenci%C3%B3n%20a%20municipios%20con%20rezago%20social.pdf?raw=true";

  constructor(private authService: AuthService, private numberFormatService: NumberFormatService,
    private pocketBaseService: PocketbaseService, private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef, private storageService: StorageService) {

    this.form = new FormGroup({
      // clave: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z]{2}\d{4}$/)]),
      nombre: new FormControl("", [Validators.required]),
      descripcion: new FormControl("", [Validators.required]),
      continuidad: new FormControl(this.continuidad),
      monto: new FormControl("", [Validators.required, noCeroValidator])
    });
    this.formSimulacion = new FormGroup({
      Res1: new FormControl("", [Validators.required]),
      Res2: new FormControl("", [Validators.required]),
      Res3: new FormControl("", [Validators.required]),
      Res4: new FormControl("", [Validators.required]),
      Res5: new FormControl("", [Validators.required]),
      Res6: new FormControl("", [Validators.required]),
      Res7: new FormControl("", [Validators.required]),
      Res8: new FormControl("", [Validators.required]),
      Res9: new FormControl("", [Validators.required]),
      Res10: new FormControl("", [Validators.required]),
      Res11: new FormControl("", [Validators.required]),
      Res12: new FormControl("", [Validators.required]),
      Res13: new FormControl("", [Validators.required]),
      Res14: new FormControl("", [Validators.required]),
      Res15: new FormControl("", [Validators.required]),
    });

    //descripcion
    this.charachtersCount = this.form.value.justificacion ? this.form.value.justificacionlength : 0;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
    //nombre
    this.charachtersCountNom = this.form.value.nombre ? this.form.value.nombre : 0;
    this.counterNom = `${this.charachtersCountNom}/${this.maxlengthNom}`;
  }

  validarContinuidad() {
    const res3 = this.formSimulacion.get('Res3');

    if (this.itemSeleccionado?.continuidad) {
      res3?.setValidators([Validators.required]);

    } else {
      res3?.clearValidators();
      res3?.setValue(''); // opcional: limpia el valor
    }
    res3?.updateValueAndValidity();
  }
  get textoContinuidad(): string {
    return this.form.get('continuidad')?.value
      ? 'Mi proyecto cuenta con etapas previas'
      : '';
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:", this.currentUser)
    });
    this.MethodTotal();
    this.LoadProy();
    this.cargarSimulacionComparador()
    const width = 450;
    const height = 300;
    const width2 = 450;
    const height2 = 40;


    this.left = (window.innerWidth - width) / 2;
    this.top = (window.innerHeight - height) / 2 + window.scrollY;
    this.left2 = (window.innerWidth - width2) / 2;
    this.top2 = (window.innerHeight - height2) / 2 + window.scrollY;
    const estructura = [7, 5, 3];
    this.variables = estructura.flatMap((cantidad, grupo) =>
      Array.from({ length: cantidad }, (_, i) => (grupo + 1) + (i + 1) / 10)
    );
    this.ids = Array.from({ length: 15 }, (_, i) => i + 1);
  }
  ngAfterViewInit() {
    const navbar = document.querySelector('.navbar');
    const height = navbar?.clientHeight || 0;

    document.documentElement.style.setProperty('--navbar-height', height + 'px');
    const modal = document.getElementById('nivelModal');

    modal?.addEventListener('hidden.bs.modal', () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

  }
  //Funciones Auxiliares
  limpiarDescripcion() {
    this.form.get("descripcion")?.setValue('');
    this.counter = ""
  }
  limpiarNombre() {
    this.form.get("nombre")?.setValue('');
    this.counterNom = ""
  }
  public onValueChangeDesc(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  public onValueChangeNombre(ev: string): void {
    this.charachtersCountNom = ev.length;
    this.counterNom = `${this.charachtersCountNom}/${this.maxlengthNom}`;
  }

  abrirInfo() {
    this.abrirPdf()
    this.windowInfoAbierto = true;
  }
  abrirModal(nivel: string) {
    this.dictaminacion = nivel;
  }

  cerrarInfo() {
    this.windowInfoAbierto = false;
  }

  //Diseño con  3 variables con cero
  getTemplateClass_22(value: number): string {
    if (value == 0) return 'template3';
    if (value == 1) return 'template6';
    if (value == 2) return 'template9';
    return 'template';
  }
  //Diseño Empleo permanentes
  getTemplateClass_permanentes(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template8';
    if (value == 2) return 'template9';
    return 'template';
  }
  //Diseño Igualdad de Genero
  getTemplateClassIgualdadGenero(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template8';
    if (value == 2) return 'template9';
    return 'template';
  }
  //Diseño con  3 variables sin cero
  getTemplateClass_22_SinCero(value: number): string {
    if (value == 1) return 'template3';
    if (value == 2) return 'template6';
    if (value == 3) return 'template9';
    return 'template';
  }
  //Diseño con  4 variables con cero
  getTemplateClass_33(value: number): string {
    if (value == 0) return 'template3';
    if (value == 1) return 'template6';
    if (value == 2) return 'template7';
    if (value == 3) return 'template9';
    return 'template';
  }
  //Diseño Empleo temporal
  getTemplateClass_Temporal(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template7';
    if (value == 2) return 'template8';
    if (value == 3) return 'template9';
    return 'template';
  }
  //Diseño con  4 variables con cero
  getTemplateClassODS(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template7';
    if (value == 2) return 'template8';
    if (value == 3) return 'template9';
    return 'template';
  }
  //Diseño con  4 variables sin cero
  getTemplateClass_33_SinCero(value: number): string {
    if (value == 1) return 'template3';
    if (value == 2) return 'template6';
    if (value == 3) return 'template7';
    if (value == 4) return 'template9';
    return 'template';
  }
  //Diseño cobertura
  getTemplateClass_cobertura(value: number): string {
    if (value == 1) return 'templateNeutro';
    if (value == 2) return 'template7';
    if (value == 3) return 'template8';
    if (value == 4) return 'template9';
    return 'template';
  }
  //Diseño desempeño
  getTemplateClass_desempeno(value: number): string {
    if (value == 1) return 'template3';
    if (value == 2) return 'template7';
    if (value == 3) return 'template8';
    if (value == 4) return 'template9';
    return 'template';
  }
  //Diseño financimiento
  getTemplateClass_fin(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template7';
    if (value == 2) return 'template8';
    if (value == 3) return 'template9';
    return 'template';
  }
  //Diseño con  5 variables con cero
  getTemplateClass(value: number): string {
    if (value == 0) return 'template3';
    if (value == 1) return 'template6';
    if (value == 2) return 'template7';
    if (value == 3) return 'template8';
    if (value == 4) return 'template9';

    return 'template';
  }
  //Diseño con  5 variables con cero
  getTemplateClassConcurrencia(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template6';
    if (value == 2) return 'template7';
    if (value == 3) return 'template8';
    if (value == 4) return 'template9';

    return 'template';
  }
  //Diseño Inversion productiva
  getTemplateClass_productiva(value: number): string {
    if (value == 0) return 'templateNeutro';
    if (value == 1) return 'template6';
    if (value == 2) return 'template7';
    if (value == 3) return 'template8';
    if (value == 4) return 'template9';

    return 'template';
  }


  //Diseño con  5 variables sin cero
  getTemplateClass_SinCero(value: number): string {
    if (value == 1) return 'template3';
    if (value == 2) return 'template6';
    if (value == 3) return 'template7';
    if (value == 4) return 'template8';
    if (value == 5) return 'template9';

    return 'template';
  }
  generarClave(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const letra1 = letras.charAt(Math.floor(Math.random() * letras.length));
    const letra2 = letras.charAt(Math.floor(Math.random() * letras.length));

    const numeros = Math.floor(1000 + Math.random() * 9000);
    // garantiza 4 dígitos (1000–9999)

    return `${letra1}${letra2}${numeros}`;
  }
  clavesGeneradas = new Set<string>();

  generarClaveUnica(): string {
    let clave: string;

    do {
      clave = this.generarClave();
    } while (this.clavesGeneradas.has(clave));

    this.clavesGeneradas.add(clave);
    return clave;
  }
  //Funciones Principales
  guardar_local() {
    // const nuevoRegistro = this.form.value;
    this.clave = this.generarClaveUnica()
    const nuevoRegistro = {
      clave: this.clave,
      nombre: this.form.get('nombre')?.value,
      continuidad: this.form.get('continuidad')?.value,
      descripcion: this.form.get('descripcion')?.value,
      monto: this.form.get('monto')?.value,
      monto_f: this.resultadoFinal

    }

    const registros = this.storageService.getLocal<any[]>('proyectos') || [];
    registros.push(nuevoRegistro);
    this.storageService.setLocal('proyectos', registros);
    console.log('Registros guardados:', registros);
    return nuevoRegistro
  }
  guardar_local_simulacion() {
    this.MethodTotal()
    this.dictaminacion = this.getTextByValue(this.CalProm)
    console.log("dictaminacion:", this.dictaminacion)
    // 🟢 4️⃣ Si todo está válido, crear registro
    const nuevoRegistro = {
      nombre: this.itemSeleccionado!.nombre,
      clave: this.itemSeleccionado!.clave,
      descripcion: this.itemSeleccionado!.descripcion,
      continuidad: this.itemSeleccionado!.continuidad,
      dictaminacion: this.dictaminacion,
      resultados: {
        res1: this.formSimulacion.get('Res1')?.value,
        pon1: this.Pon1 ?? 0,
        color1: this.color1 ?? '',
        res2: this.formSimulacion.get('Res2')?.value,
        pon2: this.Pon2 ?? 0,
        color2: this.color2 ?? '',
        res3: this.formSimulacion.get('Res3')?.value,
        pon3: this.Pon3 ?? 0,
        color3: this.color3 ?? '',
        res4: this.formSimulacion.get('Res4')?.value,
        pon4: this.Pon4 ?? 0,
        color4: this.color4 ?? '',
        res5: this.formSimulacion.get('Res5')?.value,
        pon5: this.Pon5 ?? 0,
        color5: this.color5 ?? '',
        res6: this.formSimulacion.get('Res6')?.value,
        pon6: this.Pon6 ?? 0,
        color6: this.color6 ?? '',
        res7: this.formSimulacion.get('Res7')?.value,
        pon7: this.Pon7 ?? 0,
        color7: this.color7 ?? '',
        res8: this.formSimulacion.get('Res8')?.value,
        pon8: this.Pon8 ?? 0,
        color8: this.color8 ?? '',
        res9: this.formSimulacion.get('Res9')?.value,
        pon9: this.Pon9 ?? 0,
        color9: this.color9 ?? '',
        res10: this.formSimulacion.get('Res10')?.value,
        pon10: this.Pon10 ?? 0,
        color10: this.color10 ?? '',
        res11: this.formSimulacion.get('Res11')?.value,
        pon11: this.Pon11 ?? 0,
        color11: this.color11 ?? '',
        res12: this.formSimulacion.get('Res12')?.value,
        pon12: this.Pon12 ?? 0,
        color12: this.color12 ?? '',
        res13: this.formSimulacion.get('Res13')?.value,
        pon13: this.Pon13 ?? 0,
        color13: this.color13 ?? '',
        res14: this.formSimulacion.get('Res14')?.value,
        pon14: this.Pon14 ?? 0,
        color14: this.color14 ?? '',
        res15: this.formSimulacion.get('Res15')?.value,
        pon15: this.Pon15 ?? 0,
        color15: this.color15 ?? '',
      },
      fecha: new Date().toISOString(),
      racionalidad: this.TotalRacionalidad,
      social: this.TotalSocial,
      economico: this.TotalEconomico,
      total: this.CalProm
    };

    const registros = this.storageService.getLocal<any[]>('simulaciones') || [];

    const index = registros.findIndex(r => r.clave === nuevoRegistro.clave);

    if (index !== -1) {
      registros[index] = nuevoRegistro;
    } else {
      registros.push(nuevoRegistro);
    }

    this.storageService.setLocal('simulaciones', registros);

    // const finalMessage = `Se simuló el proyecto: ${nuevoRegistro.nombre}`;

    // this.notificationService.show({
    //   content: finalMessage,
    //   appendTo: this.viewContainerRef,
    //   hideAfter: 2500,
    //   animation: { type: "slide", duration: 2500 },
    //   type: { style: "success", icon: true },
    //   position: { horizontal: "center", vertical: "bottom" },
    // });

    console.log('Registros guardados:', registros);


    // 🔄 Reset
    // this.formSimulacion.reset();
    // this.itemSeleccionado = null;

    // for (let i = 1; i <= 15; i++) {
    //   this[`Pon${i}` as keyof this] = null as any;
    // }

    // this.LoadProy();
    // this.MethodTotal();
    return nuevoRegistro
  }
  guardar_sesion() {
    const nuevoRegistro = this.form.value;
    const registros = this.storageService.getSession<any[]>('proyectos') || [];
    registros.push(nuevoRegistro);
    this.storageService.setSession('proyectos', registros);
    console.log('Registros guardados:', registros);
  }

  async guardar() {
    if (this.form.invalid) return;
    const nuevoRegistro = this.guardar_local()
    console.log(nuevoRegistro)
    try {
      const response = await this.pocketBaseService.crearProy(
        'proyectoSimulador',
        nuevoRegistro
      );

      console.log('Registro guardado:', response);
      const proteyctoCreado = response['nombre']
      const finalMessage = `Se creo correctamente el proyecto: ${proteyctoCreado}`;
      console.log('Registro guardado2:', finalMessage);

      this.notificationService.show({
        content: finalMessage,
        // appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "success", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      this.clave = ''
      this.form.reset();
      this.form.reset({
        continuidad: false
      });
      this.LoadProy();
      console.log(this.continuidad)

    } catch (error: any) {
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        'Algo salió mal al guardar el registro';

      console.error('Error al guardar:', error);
      this.notificationService.show({
        content: errorMessage,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
    }
  }

  async guardar_simulacion() {

    if (this.formSimulacion.invalid) return;

    const nuevoRegistro = this.guardar_local_simulacion();
    console.log("registro de simulacion", nuevoRegistro);

    try {

      let response;

      // 🔎 Buscar si ya existe por clave
      const existente = await this.pocketBaseService.buscarPorClave(
        'respuestaSimulador',
        nuevoRegistro.clave
      );

      if (existente) {

        // ✏️ ACTUALIZAR
        response = await this.pocketBaseService.actualizarSim(
          'respuestaSimulador',
          existente.id,
          nuevoRegistro
        );
        this.cargarSimulacionComparador()
        console.log("Registro actualizado");

      } else {

        // 🆕 CREAR
        response = await this.pocketBaseService.crearSim(
          'respuestaSimulador',
          nuevoRegistro
        );
        this.cargarSimulacionComparador()
        console.log("Registro creado");

      }

      // const protyectoCreado = response['nombre'];
      // const finalMessage = `Se guardó correctamente el Proyecto: ${protyectoCreado}`;

      // this.notificationService.show({
      //   content: finalMessage,
      //   appendTo: this.viewContainerRef,
      //   hideAfter: 2500,
      //   animation: { type: "slide", duration: 2500 },
      //   type: { style: "success", icon: true },
      //   position: { horizontal: "center", vertical: "top" },
      // });

      this.topBarraRacionalidad = 120;
      this.topBarraImpactoSocial = 230;
      this.topBarraImpactoEconomico = 405;

      this.LoadProy();
      this.cargarSimulacionComparador()

    } catch (error: any) {

      const errorMessage =
        error?.response?.message ||
        error?.message ||
        'Algo salió mal al guardar el registro';

      console.error('Error al guardar:', error);

      this.notificationService.show({
        content: errorMessage,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });

    }

  }
  //desplegar los proyectos de inversion
  LoadProy() {
    this.listItems = this.storageService.getLocal<any[]>('proyectos') || [];
    this.listSim = this.storageService.getLocal<any[]>('simulaciones') || [];
    this.cantidad_proy = this.listItems.length
    this.cantidad_simulacion = this.listSim.length
    const cantidad_proy = this.listItems.length
    const cantidad_simulacion = this.listSim.length
    console.log(cantidad_proy)
    console.log(cantidad_simulacion)
    if (cantidad_proy >= 5){
      this.cantidadProyMax = true;
    }
    else if (cantidad_proy >= 3 && cantidad_simulacion >= 3){
      this.currentStep = 2;
      this.cantidadBol = false;
      this.steps[0].label = 'Creado';
      this.steps[1].label = 'Simulado';
      this.steps[2].label = 'Comparando...';

    } else if (cantidad_proy >= 1) {
      this.currentStep = 1;
      this.steps[0].label = 'Creado';
      this.steps[1].label = 'Simulando...';

    } else if (cantidad_proy === 0) {
      this.currentStep = 0;
      this.steps[0].label = 'Creando...';

    } else {
      this.currentStep = 1;
    }

  }


  //Logica de los estados del steper
  onStepChange(stepIndex: number) {
    const cantidad_proyectos = this.storageService.getLocal<any[]>('proyectos')?.length ?? 0;
    const cantidad_simulaciones = this.storageService.getLocal<any[]>('simulaciones')?.length ?? 0;
    if (stepIndex === 0) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 1;
      });
      this.notificationService.show({
        content: "No puedes regresar al paso anterior",
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });

      return;
    }
    if (stepIndex === 0 && cantidad_proyectos === 0) {
      setTimeout(() => {
        this.currentStep = this.previousStep;

      });
      return;
    }
    //Simula
    if (stepIndex === 1 && cantidad_proyectos === 0) {
      setTimeout(() => {
        this.currentStep = this.previousStep;
      });
      this.notificationService.show({
        content: "Debes crear primero tu proyecto",
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return;
    }
    if (stepIndex === 1 && cantidad_proyectos < 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 1;
      });
      this.notificationService.show({
        content: "Debes crear primero tu proyecto2",
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return;
    }
    if (stepIndex === 1 && cantidad_proyectos >= 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 2;
      });
      this.notificationService.show({
        content: "No puedes regresar al paso anterior",
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return;
    }
    //Compara
    if (stepIndex === 2 && cantidad_proyectos >= 1) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 1;
      });
      this.notificationService.show({
        content: "Debes crear y simular al menos tres proyectos",
        // appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return;
    }

    if (stepIndex === 2 && cantidad_proyectos < 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep;
      });
      this.notificationService.show({
        content: "No puedes regresar al paso anterior",
        // appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return;
    }
    else if (stepIndex === 3) {
      
      // this.formSimulacion.reset()
      // for (let i = 1; i <= 15; i++) {
      //   this[`Pon${i}` as keyof this] = null as any;
      // }
      this.LoadProy()
      this.MethodTotal()
      this.cantidadBol = false
      stepIndex = 3;

    }

    this.previousStep = stepIndex;
    this.currentStep = stepIndex;
  }

  public close(): void {
    this.opened = false;
    this.form.reset()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  public open(): void {
    this.opened = true;
  }
  mostrarError(mensaje: string) {

    this.mensajeError = mensaje;
    this.mostrar = true;

    setTimeout(() => {
      this.mostrar = false; // activa animación de salida
    }, 3000);

    setTimeout(() => {
      this.mensajeError = ''; // lo elimina del DOM
    }, 3300);
  }
  mostrarCorrecto(mensaje: string) {

    this.mensajeConfirmacionterminacion = mensaje;
    console.log("que traemos", this.mensajeConfirmacionterminacion)
    this.mostrar_c = true;

    setTimeout(() => {
      this.mostrar_c = false; // activa animación de salida
    }, 3000);

    setTimeout(() => {
      this.mensajeConfirmacionterminacion = ''; // lo elimina del DOM
    }, 3300);
  }
  public submit(): void {

    const nombresCampos: any = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      continuidad: 'Continuidad',
      monto:'Monto'
    };

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const camposFaltantes: string[] = [];
      Object.keys(this.form.controls).forEach(campo => {
        const control = this.form.get(campo);

        if (control?.invalid) {
          camposFaltantes.push(nombresCampos[campo] || campo);
        }
      });

      const mensaje = camposFaltantes.length === 1
        ? `Falta el campo: ${camposFaltantes[0]}`
        : `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`;
      this.mostrarError(mensaje);
      return;
    }
    this.mensajeError = '';
    this.dataSaved = true;
    this.guardar()
    this.close();

  }
  public close2(): void {
    this.opened2 = false;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  public open2(): void {
    this.opened2 = true;
  }

  public comparar(): void {
    this.dataSaved2 = true;
    this.close2();
  }
  public cancelar() {
    console.log("vamos a cancelar la simulacion")
  }
  public cargarSimulacion(clave: string) {

    const registros = this.storageService.getLocal<any[]>('simulaciones') || [];

    const simulacion = registros.find(r => r.clave === clave);

    if (!simulacion) {
      this.formSimulacion.reset(); // limpia si no hay datos
      for (let i = 1; i <= 15; i++) {
        this[`Pon${i}` as keyof this] = null as any;
      }
      this.MethodTotal()

      return;
    }

    this.formSimulacion.patchValue({
      Res1: simulacion.resultados.res1,
      Res2: simulacion.resultados.res2,
      Res3: simulacion.resultados.res3,
      Res4: simulacion.resultados.res4,
      Res5: simulacion.resultados.res5,
      Res6: simulacion.resultados.res6,
      Res7: simulacion.resultados.res7,
      Res8: simulacion.resultados.res8,
      Res9: simulacion.resultados.res9,
      Res10: simulacion.resultados.res10,
      Res11: simulacion.resultados.res11,
      Res12: simulacion.resultados.res12,
      Res13: simulacion.resultados.res13,
      Res14: simulacion.resultados.res14,
      Res15: simulacion.resultados.res15,

    });
    this.Pon1 = simulacion.resultados.pon1
    this.Pon2 = simulacion.resultados.pon2
    this.Pon3 = simulacion.resultados.pon3
    this.Pon4 = simulacion.resultados.pon4
    this.Pon5 = simulacion.resultados.pon5
    this.Pon6 = simulacion.resultados.pon6
    this.Pon7 = simulacion.resultados.pon7
    this.Pon8 = simulacion.resultados.pon8
    this.Pon9 = simulacion.resultados.pon9
    this.Pon10 = simulacion.resultados.pon10
    this.Pon11 = simulacion.resultados.pon11
    this.Pon12 = simulacion.resultados.pon12
    this.Pon13 = simulacion.resultados.pon13
    this.Pon14 = simulacion.resultados.pon14
    this.Pon15 = simulacion.resultados.pon15
    this.color1 = simulacion.resultados.color1
    this.color2 = simulacion.resultados.color2
    this.color3 = simulacion.resultados.color3
    this.color4 = simulacion.resultados.color4
    this.color5 = simulacion.resultados.color5
    this.color6 = simulacion.resultados.color6
    this.color7 = simulacion.resultados.color7
    this.color8 = simulacion.resultados.color8
    this.color9 = simulacion.resultados.color9
    this.color10 = simulacion.resultados.color10
    this.color11 = simulacion.resultados.color11
    this.color12 = simulacion.resultados.color12
    this.color13 = simulacion.resultados.color13
    this.color14 = simulacion.resultados.color14
    this.color15 = simulacion.resultados.color15
    this.dictaminacion = simulacion.dictaminacion
    console.log("Ponderacion", this.color2)
    this.MethodTotal()

  }

  public cargarSimulacionComparador() {

    const registros = this.storageService.getLocal<any[]>('simulaciones') || [];
    this.Getsimulaciones = registros;


  }


  abrirPdf() {
    this.mostrarPdf = false;

    setTimeout(() => {
      this.pdfUrl = this.getPdfUrl();
      this.mostrarPdf = true;
    });
  }

  getPdfUrl(): string {
    const pdf = 'https://raw.githubusercontent.com/cabarronc/RecursosMultimedia/main/Atención%20a%20municipios%20con%20rezago%20social_4.pdf';

    return `https://docs.google.com/gview?url=${encodeURIComponent(pdf)}&embedded=true&v=${Date.now()}`;
  }
  //Sroll Virtual
  irAlPrimerError() {

    const primerError = document.querySelector(
      '.ng-invalid[formControlName]'
    ) as HTMLElement;

    if (primerError) {

      primerError.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      setTimeout(() => {
        primerError.focus();
      }, 300);

    }

  }

  //Metodo para simular 
  public simular() {

    console.log("itemseleccionado", this.itemSeleccionado?.clave);

    const camposFaltantes: string[] = [];

    const nombresCampos: any = {
      Res1: 'Gasto de Administración',
      Res2: 'Preparación Técnica',
      Res3: 'Desempeño Histórico',
      Res4: 'Fuente Financiamiento',
      Res5: 'Inversión Productiva',
      Res6: 'Cobertura de la Población Objetivo',
      Res7: 'Concurrencia',
      Res8: 'Atención Rezago Social',
      Res9: 'Igualdad de Género',
      Res10: 'Subsidios Sociales',
      Res11: 'Incidencia en los ODS',
      Res12: 'Incidencia en los Indicadores de Pobreza',
      Res13: 'Incidencia Empleos Temporales',
      Res14: 'Actividad Económica',
      Res15: 'Incidencia en Empleos Permanentes',
    };

    // 🔴 1️⃣ Validar formulario
    if (this.formSimulacion.invalid) {
      this.formSimulacion.markAllAsTouched();

      Object.keys(this.formSimulacion.controls).forEach(campo => {
        const control = this.formSimulacion.get(campo);
        if (control?.invalid) {
          camposFaltantes.push(nombresCampos[campo] || campo);
        }
      });
      setTimeout(() => {
        this.irAlPrimerError();
      }, 400);

    }

    // 🔴 2️⃣ Validar proyecto seleccionado (SIEMPRE)
    if (!this.itemSeleccionado?.clave) {
      camposFaltantes.push('Proyecto');
    }

    // 🔴 3️⃣ Si hay errores → mostrar y detener ejecución
    if (camposFaltantes.length > 0) {

      const mensaje = camposFaltantes.length === 1
        ? `Falta la variable: ${camposFaltantes[0]}`
        : `Faltan las siguientes variables: ${camposFaltantes.join(', ')}`;

      this.notificationService.show({
        content: mensaje,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      setTimeout(() => {
        this.irAlPrimerError();
      }, 1000);

      return; // 🚨 Detiene aquí si hay errores
    }

    this.guardar_simulacion()
    this.cargarSimulacionComparador()
    console.log("dictaminacion", this.dictaminacion)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const modalElement = document.getElementById('nivelModal');

    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }

  }
  cancelar_simulacion() {
    this.formSimulacion.reset()
    this.itemSeleccionado = null
    for (let i = 1; i <= 15; i++) {
      this[`Pon${i}` as keyof this] = null as any;
    }
    this.MethodTotal()

  }
  limpia_simulacion() {
    this.formSimulacion.reset()
    this.itemSeleccionado = null
    for (let i = 1; i <= 15; i++) {
      this[`Pon${i}` as keyof this] = null as any;
    }
    this.MethodTotal()
    localStorage.removeItem('proyectos');
    localStorage.removeItem('simulaciones');
    this.LoadProy()
    this.cantidadBol = true
    this.cantidadProyMax = false;
    this.currentStep = 0;
    this.steps[0].label = 'Creando...'
    this.steps[1].label = 'Simular'
    this.steps[2].label = 'Comparar'
    this.steps[3].label = 'Terminar'
    const mensaje = 'Se libero el espacio de trabajo'
    this.mostrarCorrecto(mensaje);

  }
  onProyChange(item: any) {
    this.itemSeleccionado = item;
    this.validarContinuidad()
    this.dictaminacion = ''

    if (!item) {
      this.formSimulacion.patchValue({ Res3: null })
      this.color3 = ''
      console.log("vacio", this.formSimulacion.get('Res3')?.value)
      this.topBarraRacionalidad = 113
      this.topBarraImpactoSocial = 139
      this.topBarraImpactoEconomico = 166
      this.formSimulacion.reset()
      for (let i = 1; i <= 15; i++) {
        this[`Pon${i}` as keyof this] = null as any;
      }
      this.MethodTotal()
      this.validarContinuidad()
      this.dictaminacion = ''
      return;
    }
    else {
      const longitudDescripcion = this.itemSeleccionado?.descripcion?.length || 0;
      console.log("longitud de la descripcion", longitudDescripcion)
      this.cargarSimulacion(item.clave);
      this.MethodTotal()
      if (longitudDescripcion > 200) {
        this.topBarraRacionalidad = 185
        this.topBarraImpactoSocial = 212
        this.topBarraImpactoEconomico = 239
      } else {
        this.topBarraRacionalidad = 185
        this.topBarraImpactoSocial = 212
        this.topBarraImpactoEconomico = 239
      }

      if (!(this.itemSeleccionado?.continuidad ?? true)) {
        this.formSimulacion.get('Res3')?.disable();
        this.color3 = ''
      } else {
        this.formSimulacion.get('Res3')?.enable();
      }
      console.log("onProyChange item", this.itemSeleccionado)
    }
    //   setTimeout(()=>{
    //   window.dispatchEvent(new Event('resize'));
    // });


  }

  //Gasto Adm
  public RespuestaRP1(value: any): void {
    //Rojo
    if (value.value == 0) {
      this.Pon1 = 0;
      this.color1 = '#f10808'
      // this.MethodTotal()
    }
    //Naranja
    else if (value.value == 1) {
      this.Pon1 = 5;
      this.color1 = '#e26613'
      // this.MethodTotal()
    }
    //Amarillo
    else if (value.value == 2) {
      this.Pon1 = 10;
      this.color1 = '#c4c706'
      // this.MethodTotal()
    }
    //Verde
    else if (value.value == 3) {
      this.Pon1 = 15;
      this.color1 = '#046b1e'
      // this.MethodTotal()
    }

    else if (value.value == null) {
      this.Pon1 = 0;
      // this.MethodTotal()
    }
  }
  //Grado de Prepa
  public RespuestaRP2(value: any): void {
    if (this.itemSeleccionado?.continuidad) {
      if (value.value == 1) {
        this.Pon2 = 3.75;
        this.color2 = '#f10808'
        // this.MethodTotal()
      }
      else if (value.value == 2) {
        this.Pon2 = 7.5;
        this.color2 = '#e26613'
        // this.MethodTotal()
      }
      else if (value.value == 3) {
        this.color2 = '#c4c706'
        this.Pon2 = 11.25;
        // this.MethodTotal()
      }
      else if (value.value == 4) {
        this.Pon2 = 15;
        this.color2 = '#046b1e'
        // this.MethodTotal()
      }
      else if (value.value == null) {
        this.Pon2 = 0;
        // this.MethodTotal()
      }
    }
    else {
      if (value.value == 1) {
        this.Pon2 = 6.25;
        this.color2 = '#f10808'
        // this.MethodTotal()
      }
      else if (value.value == 2) {
        this.Pon2 = 12.5;
        this.color2 = '#e26613'
        // this.MethodTotal()
      }
      else if (value.value == 3) {
        this.Pon2 = 18.75;
        this.color2 = '#c4c706'
        // this.MethodTotal()
      }
      else if (value.value == 4) {
        this.Pon2 = 25;
        this.color2 = '#046b1e'
        // this.MethodTotal()
      }
      else if (value.value == null) {
        this.Pon2 = 0;
        // this.MethodTotal()
      }

    }
  }
  //Desempeño Historico
  public RespuestaRP3(value: any): void {
    if (this.itemSeleccionado?.continuidad) {
      if (value.value == 1) {
        this.color3 = '#f10808'
        this.Pon3 = 2.5;
        // this.MethodTotal()
      }
      else if (value.value == 2) {
        this.Pon3 = 5;
        this.color3 = '#c4c706'
        // this.MethodTotal()
      }
      else if (value.value == 3) {
        this.color3 = '#3ecf6d'
        this.Pon3 = 7.5;
        // this.MethodTotal()
      }
      else if (value.value == 4) {
        this.Pon3 = 10;
        this.color3 = '#046b1e'
        // this.MethodTotal()
      }
      else if (value.value == null) {
        this.Pon3 = 0;
        // this.MethodTotal()
      }
    }
    else {
      if (value.value == 1) {
        this.Pon3 = 0;
        this.color3 = ''
        // this.MethodTotal()
      }
      else if (value.value == 2) {
        this.Pon3 = 0;
        this.color3 = ''
        // this.MethodTotal()
      }
      else if (value.value == 3) {
        this.Pon3 = 0;
        this.color3 = ''
        // this.MethodTotal()
      }
      else if (value.value == 4) {
        this.Pon3 = 0;
        this.color3 = ''
        // this.MethodTotal()
      }
      else if (value.value == null) {
        this.Pon3 = 0;
        this.color3 = ''
        // this.MethodTotal()
      }

    }
  }
  //Fuente
  public RespuestaRP4(value: any): void {
    if (value.value == 0) {
      this.color4 = '#64686d'
      this.Pon4 = 0;
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon4 = 2.33;
      this.color4 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon4 = 4.66;
      this.color4 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon4 = 7;
      this.color4 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon4 = 0;
      // this.MethodTotal()
    }
  }
  //inversion Productiva
  public RespuestaRP5(value: any): void {
    if (value.value == 0) {
      this.Pon5 = 0;
      this.color5 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon5 = 1.5;
      this.color5 = '#e26613'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon5 = 3;
      this.color5 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon5 = 4.5;
      this.color5 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 4) {
      this.Pon5 = 6;
      this.color5 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon5 = 0;
      // this.MethodTotal()
    }
  }
  //Cobertura
  public RespuestaRP6(value: any): void {
    if (value.value == 1) {
      this.Pon6 = 1.25;
      this.color6 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon6 = 2.5;
      this.color6 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon6 = 3.75;
      this.color6 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 4) {
      this.Pon6 = 5;
      this.color6 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon6 = 0;
      // this.MethodTotal()
    }
  }
  //Concurrencia
  public RespuestaRP7(value: any): void {
    if (value.value == 0) {
      this.Pon7 = 0;
      this.color7 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon7 = 0.75;
      this.color7 = '#e26613'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon7 = 1.5;
      this.color7 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon7 = 2.25;
      // this.MethodTotal()
      this.color7 = '#3ecf6d'
    }
    else if (value.value == 4) {
      this.Pon7 = 3;
      // this.MethodTotal()
      this.color7 = '#046b1e'
    }
    else if (value.value == null) {
      this.Pon7 = 0;
      // this.MethodTotal()
    }
  }
  // ---------------------Impacto Social
  // igualdad de Genero
  public RespuestaIS1(value: any): void {
    if (value.value == 0) {
      this.Pon8 = 0;
      this.color8 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon8 = 3.75;
      this.color8 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon8 = 7.5;
      this.color8 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon8 = 0;
      // this.MethodTotal()
    }
  }
  //Atencion a municipios con rezago social
  public RespuestaIS2(value: any): void {
    if (value.value == 0) {
      this.Pon9 = 0;
      this.color9 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon9 = 3.5;
      this.color9 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon9 = 7;
      this.color9 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon9 = 0;
      // this.MethodTotal()
    }
  }
  //Subsidios Sociales
  public RespuestaIS3(value: any): void {
    if (value.value == 0) {
      this.Pon10 = 0;
      this.color10 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon10 = 3.25;
      this.color10 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon10 = 6.5;
      this.color10 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon10 = 0;
      // this.MethodTotal()
    }
  }
  //Incidencia ODS
  public RespuestaIS4(value: any): void {
    if (value.value == 0) {
      this.Pon11 = 0;
      this.color11 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon11 = 2;
      this.color11 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon11 = 4;
      this.color11 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon11 = 6;
      this.color11 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon11 = 0;
      // this.MethodTotal()
    }
  }
  //Incidencia Pobreza
  public RespuestaIS5(value: any): void {
    if (value.value == 0) {
      this.Pon12 = 0;
      this.color12 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon12 = 1.33;
      this.color12 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon12 = 2.66;
      this.color12 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon12 = 4;
      this.color12 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon12 = 0;
      // this.MethodTotal()
    }
  }
  ///////Impacto Economico
  // Empleo temporal
  public RespuestaISE1(value: any): void {
    if (value.value == 0) {
      this.Pon13 = 0;
      this.color13 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon13 = 1;
      this.color13 = '#c4c706'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon13 = 2;
      this.color13 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon13 = 3;
      this.color13 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon13 = 0;
      // this.MethodTotal()
    }
  }
  //Actividad Econimca
  public RespuestaISE2(value: any): void {
    if (value.value == 0) {
      this.Pon14 = 0;
      this.color14 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon14 = 1;
      this.color14 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon14 = 2;
      this.color14 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon14 = 0;
      // this.MethodTotal()
    }
  }
  // Empleo permanente
  public RespuestaISE3(value: any): void {
    if (value.value == 0) {
      this.Pon15 = 0;
      this.color15 = '#64686d'
      // this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon15 = 1.5;
      this.color15 = '#3ecf6d'
      // this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon15 = 3;
      this.color15 = '#046b1e'
      // this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon15 = 0;
      // this.MethodTotal()
    }
  }
  public MethodTotal(): any {
    const pon1 = this.Pon1 ?? 0
    const pon2 = this.Pon2 ?? 0
    const pon3 = this.Pon3 ?? 0
    const pon4 = this.Pon4 ?? 0
    const pon5 = this.Pon5 ?? 0
    const pon6 = this.Pon6 ?? 0
    const pon7 = this.Pon7 ?? 0
    const pon8 = this.Pon8 ?? 0
    const pon9 = this.Pon9 ?? 0
    const pon10 = this.Pon10 ?? 0
    const pon11 = this.Pon11 ?? 0
    const pon12 = this.Pon12 ?? 0
    const pon13 = this.Pon13 ?? 0
    const pon14 = this.Pon14 ?? 0
    const pon15 = this.Pon15 ?? 0
    this.TotalRacionalidad = (pon1) + (pon2) + (pon3) + (pon4) + (pon5) + (pon6) + (pon7)
    // this.TotalRacionalidad = (pon1)*1.6126 + (pon2)*1.6130 + (pon3)*1.6120 + (pon4)*1.6142 + (pon5)*1.6133 + (pon6)*1.6133 + (pon7)*1.61
    console.log("calificacion racionalidad", this.TotalRacionalidad)
    this.TotalSocial = pon8 + pon9 + pon10 + pon11 + pon12
    this.TotalEconomico = pon13 + pon14 + pon15
    this.CalGlob = (this.TotalRacionalidad ?? 0) + (this.TotalSocial ?? 0) + (this.TotalEconomico ?? 0)
    this.CalProm = this.CalGlob;
    this.updateAppearance(this.getColor(this.TotalRacionalidad ?? 0, 61));
    this.updateAppearance2(this.getColor(this.TotalSocial ?? 0, 31));
    this.updateAppearance3(this.getColor(this.TotalEconomico ?? 0, 8));

  }
  private getColor(valor: number, maximo: number): string {
    const porcentaje = (valor / maximo) * 100;

    if (porcentaje <= 50) return '#f50707';
    if (porcentaje <= 70) return '#ee9f05';
    if (porcentaje <= 80) return '#368541';
    return '#2e7d32';
  }

  getTextByValue(value: number): string {
    if (value < 38) return 'Baja';
    if (value <= 46) return 'Media';
    if (value > 46) return 'Alta';
    return '#02FA27';
  }

  getColorByValue(value: number): string {
    if (value < 38) return '#a6d4fa';
    if (value <= 46) return '#4da3ff';
    if (value > 46) return '#0d6efd';
    return '#0d6efd';
  }
  getGaugeColors() {
    const value = this.CalProm ?? 0;

    return [
      {
        from: 0,
        to: value,
        color: this.getColorByValue(value),
      }
    ];
  }
  getGaugeColorsComparador(value: number) {
    const val = value ?? 0;

    return [
      {
        from: 0,
        to: val,
        color: this.getColorByValue(val),
      }
    ];
  }
  private updateAppearance(
    background: string
  ): void {
    this.progressStyles['background'] = background
  }
  private updateAppearance2(
    background: string
  ): void {
    this.progressStyles2['background'] = background
  }
  private updateAppearance3(
    background: string
  ): void {
    this.progressStyles3['background'] = background
  }
  onInput(event: any) {
    let valor = event.target.value.replace(/[^0-9]/g, ''); // 🔵 Permitir números y punto decimal
    console.log(valor)
    if (!valor || isNaN(parseFloat(valor))) {
      this.resultadoFinal = '';
      return;
    }

    let numero = parseFloat(valor);
    let cantidadFormateada = this.numberFormatService.formatAsCurrency(numero); // 🔵 Formatea número
    let cantidadEnTexto = this.numberFormatService.numberToWords(numero); // 🔵 Convierte a texto

    this.resultadoFinal = `${cantidadFormateada} (${cantidadEnTexto})`; // 🔵 Genera la salida final
  }
  limpiarMascaraMonto() {
    this.resultadoFinal = '';
    this.form.get("monto")?.setValue('');
  }



  limpia_simulacion_confirm() {
    this.mostrarConfirmacion = true;
  }

  cerrarDialogo() {
    this.mostrarConfirmacion = false;
  }

  confirmarAccion() {
    this.mostrarConfirmacion = false;
    this.limpia_simulacion();
  }
}
