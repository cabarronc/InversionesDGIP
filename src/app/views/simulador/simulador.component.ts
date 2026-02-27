import { Component, OnInit, ViewContainerRef } from '@angular/core';
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


import { KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormsModule } from '@angular/forms';
import { KENDO_ICONS } from "@progress/kendo-angular-icons";
import { paperclipIcon, infoSolidIcon, imageIcon, accessibilityIcon, dollarIcon, buildingsOutlineIcon, trashIcon } from "@progress/kendo-svg-icons";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DecimalPipe } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { StorageService } from '../../services/storage.service';
import {
  KENDO_PROGRESSBARS,
  LabelSettings,
} from "@progress/kendo-angular-progressbar";


@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [KENDO_ICONS, TooltipModule, ReactiveFormsModule, KENDO_DROPDOWNS, KENDO_SLIDER, KENDO_GAUGES, KENDO_LABELS, KENDO_LAYOUT, KENDO_BUTTONS, KENDO_PROGRESSBARS, KENDO_INPUTS, KENDO_INDICATORS, FormsModule, DecimalPipe, CommonModule, KENDO_DIALOGS],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.scss'
})
export class SimuladorComponent implements OnInit {

  CalculoDp() {
    throw new Error('Method not implemented.');
  }
  public form: FormGroup;
  public formSimulacion: FormGroup;
  public icons = { paperclip: paperclipIcon, infoSolidIcon: infoSolidIcon, imageIcon: imageIcon, accessibilityIcon: accessibilityIcon, dollarIcon: dollarIcon, buildingsOutlineIcon: buildingsOutlineIcon, trashIcon: trashIcon };
  listItems: any[] = [];
  listSim: any[] = [];
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
  cantidadBol = true
  public CalProm!: number;
  public label: LabelSettings = {
    visible: true,
    format: "percent",
    position: "start",
  };
  currentUser: User | null = null;
  topBarraRacionalidad: number = 110;
  topBarraImpactoSocial: number = 130;
  public opened = false;
  public dataSaved = false;
  public opened2 = false;
  public dataSaved2 = false;
  public currentStep = 0;
  public crear = true;
  public simuala = false;
  public compara = false;
  public steps = [
    { label: "Crea Proyecto", isValid: this.crear, emoji: "⚙️" },
    { label: "Simula", isValid: true, emoji: "🖥️" },
    { label: "Compara", isValid: true, emoji: "🆚" },
    { label: "Finaliza", isValid: true, emoji: "✅" },
  ];
  itemSeleccionado: any = null;

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


  // Racionalidad Pública
  public OpRP1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alto", value: 3 },
    { text: "Alto", value: 2 },
    { text: "Medio", value: 1 },
    { text: "Bajo", value: 0 },
  ];
  public OpRP2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Alto", value: 0 },
    { text: "Medio-alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Bajo", value: 3 },
  ];
  public OpRP3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Adecuado", value: 0 },
    { text: "Medio-alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Bajo", value: 3 },
  ];
  public OpRP4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Etiquetda total", value: 0 },
    { text: "Etiquetada parcial alta", value: 1 },
    { text: "Etiquetada parcial", value: 2 },
    { text: "Libre disposción", value: 3 },
  ];
  public OpRP5: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Total", value: 0 },
    { text: "Alta", value: 1 },
    { text: "Media", value: 2 },
    { text: "Nula", value: 3 },
    { text: "Nula", value: 4 },
  ];
  public OpRP6: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Alta", value: 0 },
    { text: "Media", value: 1 },
    { text: "Baja", value: 2 },
    { text: "Minima", value: 3 },
  ];
  public OpRP7: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alta", value: 0 },
    { text: "Alta", value: 1 },
    { text: "Media", value: 2 },
    { text: "Baja", value: 3 },
    { text: "Sin", value: 4 },
  ];
  // Impacto Social
  public OpIS1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Con rezago medio", value: 0 },
    { text: "Con rezago bajo", value: 1 },
    { text: "Otros", value: 2 },
  ];
  public OpIS2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Directa", value: 2 },
    { text: "Indirecta", value: 1 },
    { text: "Ninguna", value: 0 },
  ];
  public OpIS3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Personales", value: 2 },
    { text: "Otros", value: 1 },
    { text: "Ninguno", value: 0 },
  ];
  public OpIS4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Prioridad alta", value: 3 },
    { text: "Prioridad media", value: 2 },
    { text: "Prioridad baja", value: 1 },
    { text: "Otros", value: 0 },
  ];
  // Impacto Ecónomico
  public OpIS5: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Prioridad alta", value: 3 },
    { text: "Prioridad media", value: 2 },
    { text: "Prioridad baja", value: 1 },
    { text: "Otros", value: 0 },
  ];
  public OpIE1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Alta", value: 3 },
    { text: "Media", value: 2 },
    { text: "Baja", value: 1 },
    { text: "Nula", value: 0 },
  ];
  public OpIE2: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Más relevante", value: 2 },
    { text: "Relevante", value: 1 },
    { text: "Otros", value: 0 },
  ];
  public OpIE3: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Alta", value: 2 },
    { text: "Baja", value: 1 },
    { text: "Nula", value: 0 },
  ];

  //contador de letras
  public charachtersCount: number;
  public counter: string
  public maxlength = 300;
  previousStep = 0;

  constructor(private authService: AuthService, private pocketBaseService: PocketbaseService, private notificationService: NotificationService, private viewContainerRef: ViewContainerRef, private storageService: StorageService) {
    this.form = new FormGroup({
      clave: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z]{2}\d{4}$/)]),
      nombre: new FormControl("", [Validators.required]),
      descripcion: new FormControl("", [Validators.required]),
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
    this.charachtersCount = this.form.value.justificacion ? this.form.value.justificacionlength : 0;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:", this.currentUser)
    });
    this.MethodTotal();
    this.LoadProy();

  }
  //Funciones Auxiliares
  limpiarDescripcion() {
    this.form.get("descripcion")?.setValue('');
    this.counter = ""
  }
  public onValueChangeDesc(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  getColorByValue(value: number): string {
    if (value < 50) return '#d61b1b';
    if (value < 83) return '#FAFA02';
    if (value > 83) return '#02FA27';
    return '#02FA27';
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
  getTemplateClass(value: number): string {
    if (value == 0) return 'template9';
    if (value == 1) return 'template8';
    if (value == 2) return 'template7';
    if (value == 3) return 'template6';
    if (value == 4) return 'template3';

    return 'template';
  }
  getTemplateClass_22(value: number): string {
    if (value == 0) return 'template3';
    if (value == 1) return 'template6';
    if (value == 2) return 'template9';
    return 'template';
  }

  getTemplateClass_33(value: number): string {
    if (value == 0) return 'template3';
    if (value == 1) return 'template6';
    if (value == 2) return 'template8';
    if (value == 3) return 'template9';


    return 'template';
  }
  //Funciones Principales
  guardar_local() {
    const nuevoRegistro = this.form.value;
    const registros = this.storageService.getLocal<any[]>('proyectos') || [];
    registros.push(nuevoRegistro);
    this.storageService.setLocal('proyectos', registros);
    console.log('Registros guardados:', registros);
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

    try {
      const response = await this.pocketBaseService.crearProy(
        'proyectoSimulador',   // nombre de tu colección en PocketBase
        this.form.value
      );

      console.log('Registro guardado:', response);
      const proteyctoCreado = response['clave']
      const finalMessage = `Se creado Correctamente el Proyecto: ${proteyctoCreado}`;
      console.log('Registro guardado2:', finalMessage);

      this.notificationService.show({
        content: finalMessage,
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 3500 },
        type: { style: "success", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });

      this.form.reset();
      this.LoadProy();

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
    // this.pocketBaseService.getCollectionProySim().then(
    //   (data) => {
    //     this.listItems = data
    //     console.log("Lista de Proyectos:", data)
    //      const cantidad = this.listItems.length;
    //       if (cantidad === 0) {
    //     this.currentStep = 0;
    //   } else if (cantidad == 1) {
    //     this.currentStep = 1;
    //   } else if (cantidad >= 3) {
    //     this.currentStep = 2;
    //   }
    //   },
    //   (error) => {
    //     console.error('Error al cargar las tareas:', error);
    //   }
    // )
    // this.listItems = this.storageService.getSession<any[]>('proyectos') || [];
    this.listItems = this.storageService.getLocal<any[]>('proyectos') || [];
    this.listSim = this.storageService.getLocal<any[]>('simulaciones') || [];
    const cantidad_proy = this.listItems.length
    const cantidad_simulacion = this.listSim.length
    console.log(cantidad_proy)
    console.log(cantidad_simulacion)
    if (cantidad_proy === 0) {
      this.currentStep = 0;

    } else if (cantidad_proy <= 2) {
      this.currentStep = 1;
    } else if (cantidad_proy === 3 && cantidad_simulacion === 3) {
      this.currentStep = 2;
      this.cantidadBol = false
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
        content: "Debes crear primero tu proyecto",
        appendTo: this.viewContainerRef,
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
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
    }
    if (stepIndex === 1 && cantidad_proyectos < 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 1;
      });
      this.notificationService.show({
        content: "Debes crear primero tu proyecto2",
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
    }
    if (stepIndex === 1 && cantidad_proyectos === 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 2;
      });
      this.notificationService.show({
        content: "No puedes regresar al paso anterior",
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
    }
    //Compara
    if (stepIndex === 2 && cantidad_proyectos >= 1) {
      setTimeout(() => {
        this.currentStep = this.previousStep + 1;
      });
      this.notificationService.show({
        content: "Debes crear y simualar al menos tres proyectos",
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
    }

    if (stepIndex === 2 && cantidad_proyectos < 3) {
      setTimeout(() => {
        this.currentStep = this.previousStep;
      });
      this.notificationService.show({
        content: "No puedes regresar al paso anterior",
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
    }
    else if (stepIndex === 3) {
      localStorage.removeItem('proyectos');
      localStorage.removeItem('simulaciones');
      
      for (let i = 1; i <= 15; i++) {
        this[`Pon${i}` as keyof this] = null as any;
      }
      this.LoadProy()
      this.MethodTotal()
      this.cantidadBol = true
      stepIndex = 0;
     
    }

    this.previousStep = stepIndex;
    this.currentStep = stepIndex;
  }

  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

  public submit(): void {
     if (this.form.invalid) {
       this.form.markAllAsTouched();
       const camposFaltantes: string[] = [];
      Object.keys(this.form.controls).forEach(campo => {
        const control = this.form.get(campo);

        if (control?.invalid) {
          camposFaltantes.push(campo);
        }
      });

      const mensaje = camposFaltantes.length === 1
        ? `Falta el campo: ${camposFaltantes[0]}`
        : `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`;
        this.notificationService.show({
        content: mensaje,
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;
     }
    this.dataSaved = true;
    this.guardar()
    this.guardar_local()
    this.close();

  }
  public close2(): void {
    this.opened2 = false;
  }

  public open2(): void {
    this.opened2 = true;
  }

  public submit2(): void {
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
    console.log("Ponderacion", this.Pon1)
    this.MethodTotal()
  }
  //Metodo para simular 
  public simular() {
    // 🔴 Validar formulario antes de continuar
    if (this.formSimulacion.invalid) {
      this.formSimulacion.markAllAsTouched();

      const nombresCampos: any = {
        Res1: 'Gasto de Adminsitración',
        Res2: 'Preparacion Técnica',
        Res3: 'Desempeño  Historico',
        Res4: 'Fuente Financiamiento',
        Res5: 'Inversión Productiva',
        Res6: 'Cobertura de la Población Objetivo',
        Res7: 'Concurrencia',
        Res8: 'Atención Rezago Social',
        Res9: 'Igualdad de Género',
        Res10: 'Subsidios Sociales',
        Res11: 'Incidencia en los ODS',
        Res12: 'Incidencia en los Indicadores de Pobreza',
        Res13: 'Incidencia Empleso Temporales',
        Res14: 'Actividad Económica',
        Res15: 'Incidencia en Empleos Permanentes',

      };
      const camposFaltantes: string[] = [];
      Object.keys(this.formSimulacion.controls).forEach(campo => {
        const control = this.formSimulacion.get(campo);

        if (control?.invalid) {
          camposFaltantes.push(nombresCampos[campo] || campo);
        }
      });

      const mensaje = camposFaltantes.length === 1
        ? `Falta la variable: ${camposFaltantes[0]}`
        : `Faltan los siguientes variables: ${camposFaltantes.join(', ')}`;

      this.notificationService.show({
        content: mensaje,
        appendTo: this.viewContainerRef,
        hideAfter: 2500,
        animation: { type: "slide", duration: 2500 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "bottom" },
      });
      return; // Detiene la ejecución
    }
    console.log("Simualciones: ", this.itemSeleccionado);
    const nuevoRegistro = {
      clave: this.itemSeleccionado.clave,
      resultados: {
        res1: this.formSimulacion.get('Res1')?.value,
        pon1: this.Pon1 ?? 0,
        res2: this.formSimulacion.get('Res2')?.value,
        pon2: this.Pon2 ?? 0,
        res3: this.formSimulacion.get('Res3')?.value,
        pon3: this.Pon3 ?? 0,
        res4: this.formSimulacion.get('Res4')?.value,
        pon4: this.Pon4 ?? 0,
        res5: this.formSimulacion.get('Res5')?.value,
        pon5: this.Pon5 ?? 0,
        res6: this.formSimulacion.get('Res6')?.value,
        pon6: this.Pon6 ?? 0,
        res7: this.formSimulacion.get('Res7')?.value,
        pon7: this.Pon7 ?? 0,
        res8: this.formSimulacion.get('Res8')?.value,
        pon8: this.Pon8 ?? 0,
        res9: this.formSimulacion.get('Res9')?.value,
        pon9: this.Pon9 ?? 0,
        res10: this.formSimulacion.get('Res10')?.value,
        pon10: this.Pon10 ?? 0,
        res11: this.formSimulacion.get('Res11')?.value,
        pon11: this.Pon11 ?? 0,
        res12: this.formSimulacion.get('Res12')?.value,
        pon12: this.Pon12 ?? 0,
        res13: this.formSimulacion.get('Res13')?.value,
        pon13: this.Pon13 ?? 0,
        res14: this.formSimulacion.get('Res14')?.value,
        pon14: this.Pon14 ?? 0,
        res15: this.formSimulacion.get('Res15')?.value,
        pon15: this.Pon15 ?? 0,
      },
      fecha: new Date().toISOString()
    }
    // const nuevoRegistro = this.formSimulacion.value
    const registros = this.storageService.getLocal<any[]>('simulaciones') || [];
    const index = registros.findIndex(r => r.clave === nuevoRegistro.clave);
    if (index !== -1) {
      registros[index] = nuevoRegistro;
    } else {
      registros.push(nuevoRegistro);
    }
    // registros.push(nuevoRegistro);
    this.storageService.setLocal('simulaciones', registros);
    const proteyctoCreado = nuevoRegistro.clave
    const finalMessage = `Se simulo el proyecto: ${proteyctoCreado}`;
    this.notificationService.show({
      content: finalMessage,
      appendTo: this.viewContainerRef,
      hideAfter: 2500,
      animation: { type: "slide", duration: 2500 },
      type: { style: "success", icon: true },
      position: { horizontal: "center", vertical: "bottom" },
    });
    console.log('Registros guardados:', registros);
    this.formSimulacion.reset()
    this.itemSeleccionado = null
    for (let i = 1; i <= 15; i++) {
      this[`Pon${i}` as keyof this] = null as any;
    }
    this.LoadProy()
    this.MethodTotal()
  }

  cancelar_simulacion() {
    this.formSimulacion.reset()
    this.itemSeleccionado = null
    for (let i = 1; i <= 15; i++) {
      this[`Pon${i}` as keyof this] = null as any;
    }
    this.MethodTotal()

  }
  onProyChange(item: any) {
    this.itemSeleccionado = item;
    console.log("onProyChange item", this.itemSeleccionado)
    if (!item) {
      this.formSimulacion.reset()
      for (let i = 1; i <= 15; i++) {
        this[`Pon${i}` as keyof this] = null as any;
      }
      this.MethodTotal()
      return;
    }
    this.cargarSimulacion(item.clave);
    this.MethodTotal()
    this.topBarraRacionalidad = 210
    this.topBarraImpactoSocial = 230

  }

  public RespuestaRP1(value: any): void {

    if (value.value == 0) {
      this.Pon1 = 19;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon1 = 11.4;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon1 = 5.7;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon1 = 1.9;
      this.MethodTotal()
    }

    else if (value.value == null) {
      this.Pon1 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP2(value: any): void {
    if (value.value == 0) {
      this.Pon2 = 13;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon2 = 7.8;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon2 = 3.9;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon2 = 1.3;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon2 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP3(value: any): void {
    if (value.value == 0) {
      this.Pon3 = 10;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon3 = 6;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon3 = 3;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon3 = 1;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon3 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP4(value: any): void {
    if (value.value == 0) {
      this.Pon4 = 7;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon4 = 4.2;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon4 = 2.1;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon4 = 0.7;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon4 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP5(value: any): void {
    if (value.value == 0) {
      this.Pon5 = 6;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon5 = 4;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon5 = 2.4;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon5 = 1.2;
      this.MethodTotal()
    }
    else if (value.value == 4) {
      this.Pon5 = 0.4;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon5 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP6(value: any): void {
    if (value.value == 0) {
      this.Pon6 = 6;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon6 = 3.6;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon6 = 1.8;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon6 = 0.6;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon6 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaRP7(value: any): void {
    if (value.value == 0) {
      this.Pon7 = 1;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon7 = 0.66;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon7 = 0.4;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon7 = 0.2;
      this.MethodTotal()
    }
    else if (value.value == 4) {
      this.Pon7 = 0.06;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon7 = 0;
      this.MethodTotal()
    }
  }
  ///////Impacto Social
  public RespuestaIS1(value: any): void {
    if (value.value == 0) {
      this.Pon8 = 1.41;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon8 = 4.25;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon8 = 8.5;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon8 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaIS2(value: any): void {
    if (value.value == 0) {
      this.Pon9 = 1.25;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon9 = 3.75;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon9 = 7.5;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon9 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaIS3(value: any): void {
    if (value.value == 0) {
      this.Pon10 = 1.08;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon10 = 3.25;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon10 = 6.5;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon10 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaIS4(value: any): void {
    if (value.value == 0) {
      this.Pon11 = 0.6;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon11 = 1.8;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon11 = 3.6;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon11 = 6;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon11 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaIS5(value: any): void {
    if (value.value == 0) {
      this.Pon12 = 0.4;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon12 = 1.2;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon12 = 2.4;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon12 = 4;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon12 = 0;
      this.MethodTotal()
    }
  }
  ///////Impacto Economico
  public RespuestaISE1(value: any): void {
    if (value.value == 0) {
      this.Pon13 = 0.3;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon13 = 0.9;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon13 = 1.8;
      this.MethodTotal()
    }
    else if (value.value == 3) {
      this.Pon13 = 3;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon13 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaISE2(value: any): void {
    if (value.value == 0) {
      this.Pon14 = 0.33;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon14 = 1;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon14 = 2;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon14 = 0;
      this.MethodTotal()
    }
  }
  public RespuestaISE3(value: any): void {
    if (value.value == 0) {
      this.Pon15 = 0.08;
      this.MethodTotal()
    }
    else if (value.value == 1) {
      this.Pon15 = 0.25;
      this.MethodTotal()
    }
    else if (value.value == 2) {
      this.Pon15 = 0.50;
      this.MethodTotal()
    }
    else if (value.value == null) {
      this.Pon15 = 0;
      this.MethodTotal()
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
    this.updateAppearance(this.getColor(this.TotalRacionalidad ?? 0, 62));
    this.updateAppearance2(this.getColor(this.TotalSocial ?? 0, 32.5));
    this.updateAppearance3(this.getColor(this.TotalEconomico ?? 0, 5.5));
  }
  private getColor(valor: number, maximo: number): string {
    const porcentaje = (valor / maximo) * 100;

    if (porcentaje <= 50) return '#f50707';
    if (porcentaje <= 70) return '#ee9f05';
    if (porcentaje <= 80) return '#368541';
    return '#2e7d32';
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
}
