import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { fileWordIcon, imageIcon, menuIcon, SVGIcon, copyIcon, trashIcon, fileExcelIcon, chartDoughnutIcon, plusCircleIcon, plusIcon, minusIcon, minusCircleIcon, dollarIcon, questionCircleIcon, checkIcon } from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_FLOATINGLABEL } from "@progress/kendo-angular-label";
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_INPUTS, MaskedTextBoxComponent } from "@progress/kendo-angular-inputs";
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { KENDO_DATEINPUTS } from "@progress/kendo-angular-dateinputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs"
import { IntlModule } from "@progress/kendo-angular-intl";
import { LabelModule } from "@progress/kendo-angular-label";
import { FormFieldModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { IconsModule } from "@progress/kendo-angular-icons";
import { ExpansionPanelComponent, LayoutModule } from "@progress/kendo-angular-layout";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { FormsModule } from '@angular/forms';
import {
  KENDO_NOTIFICATION,
  NotificationService,
} from "@progress/kendo-angular-notification";
import { KENDO_PROGRESSBARS } from '@progress/kendo-angular-progressbar';
import { KENDO_TOOLTIPS } from "@progress/kendo-angular-tooltip"
import { AutoCompleteComponent, DropDownsModule } from "@progress/kendo-angular-dropdowns"
import { PocketbaseService } from '../../../services/pocketbase.service';
import { ApiService } from '../../../services/api.service';
import { NumberFormatService } from '../../../helpers/number-format.service';
import { AdecuacionesService } from '../../../services/adecuaciones.service';
import { FileService } from '../../../services/file.service';
import { KENDO_PDFVIEWER } from "@progress/kendo-angular-pdfviewer";
import { KENDO_GRID, ExcelModule, GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import * as moment from 'moment-timezone';
import { ColumnMenuSettings } from "@progress/kendo-angular-grid";
import { LocalizationService } from '@progress/kendo-angular-l10n';
interface DataDep {
  nombre: string;
  siglas: string;
}
import { process } from "@progress/kendo-data-query";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-adecuaciones-content',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, ButtonsModule, DateInputsModule, IntlModule, LabelModule, FormFieldModule, IconsModule,
    KENDO_FLOATINGLABEL, KENDO_LABEL, KENDO_INPUTS, ReactiveFormsModule, KENDO_DATEINPUTS, KENDO_NOTIFICATION, LayoutModule, KENDO_PROGRESSBARS,
    WindowModule, FormsModule, DropDownsModule, KENDO_TOOLTIPS, KENDO_PDFVIEWER, WindowModule, KENDO_GRID, ExcelModule, NgClass],
  templateUrl: './adecuaciones-content.component.html',
  styleUrl: './adecuaciones-content.component.scss',
})
export class AdecuacionesContentComponent implements OnInit {
  @ViewChild("deplist") public list?: AutoCompleteComponent;
  @Input() selectedItem: string | undefined;
  @ViewChildren('group1') group1Panels!: QueryList<ExpansionPanelComponent>;
  @ViewChildren('group1_r') group1Panels_r!: QueryList<ExpansionPanelComponent>;
  @ViewChild('maskedInput') maskedInput!: MaskedTextBoxComponent;
  @ViewChild('maskedInput_R') maskedInput_r!: MaskedTextBoxComponent;
  panels!: QueryList<ExpansionPanelComponent>;
  panels_r!: QueryList<ExpansionPanelComponent>;
  isExpandedGroup1: boolean = true
  public form: FormGroup;
  public form_r: FormGroup;
  public cheked = true
  public cheked2 = true
  public cheked3 = false
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public fileExcelIcon: SVGIcon = fileExcelIcon
  public plusCircleIcon: SVGIcon = plusCircleIcon;
  public chartDoughnutIcon: SVGIcon = chartDoughnutIcon;
  public minusIcon: SVGIcon = minusIcon;
  public minusCircleIcon: SVGIcon = minusCircleIcon;
  public trashIcon: SVGIcon = trashIcon;
  public dollarIcon: SVGIcon = dollarIcon
  public questionCircleIcon: SVGIcon = questionCircleIcon;
  public plusIcon: SVGIcon = plusIcon;
  public checkIcon: SVGIcon = checkIcon
  public asunto: string = ""
  public oficio_atencion: string = ""
  public dep: string = "" //Valor de la Dependencia(Necesario Form)
  public cargo: string = "" //Valor del Cargo del destinario(Necesario Form)
  public dep_dir: string = ""
  public siglas: string = ""
  public proy: string = ""
  fecha: Date = new Date()
  public maxlength = 300;
  public charachtersCount: number;
  public counter: string
  public resultadoFinal: string = ''; //Valor de Monto Global(Necesario Form)
  public resultadoFinal_input: string = '';
  public resultadoFinal2: string = ''; //Valor de Monto de cada Proyecto(Necesario Form)
  public mascara: string = '';
  public mask = "999,000,000.00";
  public mask_reducciones = "999,000,000.00";
  public isGenered: boolean = true
  public expanded: boolean = true
  public dependencias: Array<{ nombre: string, siglas: string }> = [];
  public copias: Array<{ siglas: string, nombre: string }> = [];
  public Proyecto: Array<{ Proyecto: string, siglas: string, dependencia: string }> = [];
  public Proyecto_r: Array<{ Proyecto: string, siglas: string, dependencia: string }> = [];
  public Destinatario: any[] = [];
  public Destinatario_r: any[] = [];
  public DestinatarioFiltrado:  Array<{ destinatario: string }>= [];
  public DestinatarioFiltrado_r:  Array<{ destinatario: string }>= [];
  public copia: string = ""
  public files: any[] = [];
  public isDisabled = false;
  public idRegistroSeleccionado: string = '';
  public idRegistroSeleccionado_r: string = '';
  public getAmpliaciones: any[] = [];
  public getReducciones: any[] = [];
  public menuSettings: ColumnMenuSettings = {
    lock: true,
    stick: true,
    setColumnPosition: { expanded: true },
    autoSizeColumn: true,
    autoSizeAllColumns: true,
  };
  public gridData?: unknown[];
  public group: { field: string }[] = [
    {
      field: "Estado",
    },
  ];
  public events: string[] = [];
  ///+++++++++++++++++++++++++++++++++VARIABLES DE REDUCCION
  public auth_r: boolean = true
  public exits: boolean = true
  public plus: boolean = false
  public cargo_r: string = "";
  
  public dep_dir_r: string = "";
  public siglas_r: string = "";
  public resultadoFinal_r: string = "";
  public resultadoFinal_r_input: string = "";
  public dep_r: string = ""
  public resultadoFinal2_r: string = "";
  public copia_r: string = "";
  public files_reduccion: any[] = [];
  public resultadoFinal2_input: string = '';
  public Doe: Array<{ nombre: string, siglas: string, DoE: string }> = [];
  public Doe_aux: string = "";
  public Doe_aux_r: string = "";
  public DoE_dir: string = "";
  public DoE_dir_r: string = "";
 

  ngOnInit(): void {
    this.loadDependencias();
    this.GetProyectos();
    this.loadCopias();
    this.GetFiles();
    this.GetDestinatarios();
    this.GetFiles_R()
    this.obtenerAmpliaciones();
    this.obtenerReducciones();
    this.agregarProyecto();
    this.agregarProyecto_R();
  }
  ///FUNCIONES AUXILIARES Y DE REINICIRA CAMPOS
  formatDate(dateString: string): string {
    return moment.utc(dateString).tz("America/Mexico_City").format("DD/MM/YYYY HH:mm");
  }
  limpiarMascara() {
    this.resultadoFinal = '';
    this.resultadoFinal_input = ''
  }
  limpiarMascara_R() {
    this.resultadoFinal_r = ''; // Borra el valor
    this.resultadoFinal_r_input = ''
  }
  limpiarMascaraProy(i: number) {
    this.resultadoFinal2 = '';
    this.proyectos.at(i).get("monto")?.setValue('');
  }
  limpiarMascaraProy_R(i: number) {
    this.resultadoFinal2_r = '';
    this.proyectos_R.at(i).get("monto_r")?.setValue('');
  }
  limpiarJustificacion() {
    this.form.get('justificacion')?.setValue('');
  }
  limpiarJustificacio_R() {
    this.form_r.get("justificacion_r")?.setValue('');
    this.counter = ""
  }
  //OBTENER ARCHIVOS
  GetFiles() {
    this.fileService.getFilesAmpliaciones().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }
  GetFiles_R() {
    this.fileService.getFilesReducciones().subscribe(
      (data) => {
        this.files_reduccion = data;
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }
  //FUNCION PARA INTERCALAR EL ESTADO DE LOS EXPANSION PANEL DE LOS PROYECTOS(AMPLIACIONES)
  public onAction(index: number, panels: QueryList<ExpansionPanelComponent>): void {
    panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
  }
  //FUNCION PARA INTERCALAR EL ESTADO DE LOS EXPANSION PANEL DE LOS PROYECTOS(REDUCCIONES)
  public onAction_R(index: number, panels_r: QueryList<ExpansionPanelComponent>): void {
    panels_r.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
  }
  //DESCARGAR ARCHIVOS
  downloadFile(filename: string): void {
    this.fileService.downloadFile(filename).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      },
      (error) => {
        console.error('Error downloading file', error);
      }
    );
  }
  downloadFile_R(filename: string): void {
    this.fileService.downloadFileRed(filename).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      },
      (error) => {
        console.error('Error downloading file', error);
      }
    );
  }
  //MANEJO DEL MODAL DEL PDF
  selectedPdf: string | null = null;  // 📌 Almacena el PDF en Base64 cuando se abre el modal
  nombre_archivo: string | null = null;
  selectedPdf_r: string | null = null;
  nombre_archivo_r: string | null = null;
  openPdfModal(pdfBase64: string, name: string) {
    this.selectedPdf = pdfBase64;
    this.nombre_archivo = name;
  }
  openPdfModal_R(pdfBase64: string, name: string) {
    this.selectedPdf_r = pdfBase64;
    this.nombre_archivo_r = name;
  }
  closePdfModal() {
    this.selectedPdf = null;
  }
  closePdfModal_R() {
    this.selectedPdf_r = null;
  }

  constructor(private pocketBaseService: PocketbaseService,
    private apiService: ApiService, private numberFormatService: NumberFormatService, private adecuacionesService: AdecuacionesService,
    private notificationService: NotificationService, private fileService: FileService, private localizationService: LocalizationService) {
    this.form = new FormGroup({
      numero_circular: new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/)]),
      fecha: new FormControl(this.fecha, [Validators.required,]),
      asunto: new FormControl("", [Validators.required,]),
      oficio_atencion: new FormControl("", [Validators.required, Validators.pattern(/^([A-Z]+\/\d{1,4}\/\d{1,4})(\s*(,|y)\s*[A-Z]+\/\d{1,4}\/\d{1,4})*$/)]),
      proyecto: new FormControl("", [Validators.required,]),
      justificacion: new FormControl("", [Validators.required,]),
      solicitud_afectacion_presupuestal: new FormControl("", [Validators.required]),
      formato_adecuacion_metas: new FormControl("", [Validators.required]),
      copias: new FormControl(""),
      proyectos: new FormArray([]),
      destinatario: new FormControl("")

    });
    this.form_r = new FormGroup({
      numero_circular_r: new FormControl("", [Validators.required, Validators.minLength(4), Validators.pattern(/^\d{4}$/)]),
      fecha_r: new FormControl(this.fecha, [Validators.required,]),
      asunto_r: new FormControl("", [Validators.required,]),
      oficio_atencion_r: new FormControl("", [Validators.required, Validators.pattern(/^([A-Z]+\/\d{1,4}\/\d{1,4})(\s*(,|y)\s*[A-Z]+\/\d{1,4}\/\d{1,4})*$/)]),
      proyecto_r: new FormControl("", [Validators.required,]),
      justificacion_r: new FormControl("", [Validators.required,]),
      solicitud_afectacion_presupuestal_r: new FormControl("", [Validators.required]),
      formato_adecuacion_metas_r: new FormControl("", [Validators.required]),
      copias_r: new FormControl(""),
      proyectos_r: new FormArray([]),
      destinatario_r: new FormControl(""),

    });
    this.localizationService.notifyChanges();
    this.charachtersCount = this.form.value.justificacion ? this.form.value.justificacionlength : 0;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
    this.allData = this.allData.bind(this);
  }

  //LOGICA MAS PROYECTOS CREAR ESTRUCTURA
  get proyectos(): FormArray {
    return this.form.get('proyectos') as FormArray;
  }

  get proyectos_R(): FormArray {
    return this.form_r.get('proyectos_r') as FormArray;
  }

  get proyectoFormGroup(): FormGroup[] {
    return this.proyectos.controls as FormGroup[];
  }

  get proyectoFormGroup_R(): FormGroup[] {
    return this.proyectos_R.controls as FormGroup[];
  }
  // AGREGAR UN NUEVO PROYECTO AL REGISTROS
  agregarProyecto() {
    const proyectoForm = new FormGroup({
      nombre_proyecto: new FormControl('',),
      dependencia: new FormControl('',),
      monto: new FormControl("",),
    });
    this.proyectos.push(proyectoForm);
    this.resultadoFinal2 = ''
  }
  agregarProyecto_R() {
    const proyectoForm = new FormGroup({
      nombre_proyecto_r: new FormControl('',),
      dependencia_r: new FormControl('',),
      monto_r: new FormControl("",),
    });
    this.proyectos_R.push(proyectoForm);
    this.resultadoFinal2_r = ''
  }

  //ELIMINAR UN PROEYCTO DEL FORMULARIO
  eliminarProyecto(index: number, event: Event) {
    this.proyectos.removeAt(index);
    this.resultadoFinal2 = ''
    event.stopPropagation(); // Evita que el clic afecte el panel
  }
  eliminarProyecto_R(index: number, event: Event) {
    this.proyectos_R.removeAt(index);
    this.resultadoFinal2_r = ''
    event.stopPropagation();
  }

  //METODO DE LOS MONTOS PRINCIPALES
  onInput(event: any) {
    let valor = event.target.value.replace(/[^0-9.]/g, ''); // 🔵 Permitir números y punto decimal
    if (!valor || isNaN(parseFloat(valor))) {
      this.resultadoFinal = '';
      return;
    }

    let numero = parseFloat(valor);
    let cantidadFormateada = this.numberFormatService.formatAsCurrency(numero); // 🔵 Formatea número
    let cantidadEnTexto = this.numberFormatService.numberToWords(numero); // 🔵 Convierte a texto

    this.resultadoFinal = `${cantidadFormateada} (${cantidadEnTexto})`; // 🔵 Genera la salida final
  }
  onInput_R(event: any) {
    let valor = event.target.value.replace(/[^0-9.]/g, ''); // 🔵 Permitir números y punto decimal
    if (!valor || isNaN(parseFloat(valor))) {
      this.form_r.get('monto_r')?.setValue('');
      return;
    }

    let numero = parseFloat(valor);
    let cantidadFormateada = this.numberFormatService.formatAsCurrency(numero); // 🔵 Formatea número
    let cantidadEnTexto = this.numberFormatService.numberToWords(numero); // 🔵 Convierte a texto
    this.resultadoFinal_r = `${cantidadFormateada} (${cantidadEnTexto})`

  }
  //METODO DE LOS MONTOS  DE LOS PROYECTOS
  onInput2(event: any) {
    let valor = event.target.value.replace(/[^0-9.]/g, ''); // 🔵 Permitir números y punto decimal
    if (!valor || isNaN(parseFloat(valor))) {
      this.resultadoFinal2 = '';
      return;
    }

    let numero = parseFloat(valor);
    let cantidadFormateada = this.numberFormatService.formatAsCurrency(numero); // 🔵 Formatea número
    let cantidadEnTexto = this.numberFormatService.numberToWords(numero); // 🔵 Convierte a texto

    this.resultadoFinal2 = `${cantidadFormateada} (${cantidadEnTexto})`; // 🔵 Genera la salida final
  }
  onInput2_R(event: any) {
    let valor = event.target.value.replace(/[^0-9.]/g, ''); // 🔵 Permitir números y punto decimal
    if (!valor || isNaN(parseFloat(valor))) {
      this.resultadoFinal2_r = '';
      return;
    }

    let numero = parseFloat(valor);
    let cantidadFormateada = this.numberFormatService.formatAsCurrency(numero); // 🔵 Formatea número
    let cantidadEnTexto = this.numberFormatService.numberToWords(numero); // 🔵 Convierte a texto

    this.resultadoFinal2_r = `${cantidadFormateada} (${cantidadEnTexto})`; // 🔵 Genera la salida final
  }
  //MANEJO DEL CONTADOR DE PALABRAS EN LA JUSTIFICACION
  public onValueChange(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  public onValueChange_R(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  //CUANDO EL ESTADO DEL RADIO  PROCEDENTE O INPROCEDENTE, SE EJECUTA
  public onChangeProcedencias(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === false) {
      this.form.get('destinatario')?.setValidators([Validators.required]);
      console.log("valor es falso")
    }
    else {
      this.form.get('destinatario')?.setValidators([]);
      this.cargo = ""
      this.form.get('destinatario')?.setValue('');
      console.log("valor es true")
    }
    this.form.get('destinatario')?.updateValueAndValidity();
  }
  public onChangeProcedencias_R(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === false) {
      this.form_r.get('destinatario_r')?.setValidators([Validators.required]);
      console.log("valor es falso")
    }
    else {
      this.form_r.get('destinatario_r')?.setValidators([]);
      this.cargo = ""
      this.form_r.get('destinatario_r')?.setValue('');
      console.log("valor es true")
    }
    this.form_r.get('destinatario_r')?.updateValueAndValidity()
  }
  //CUANDO EL ESTADO DEL RADIO  PROYECTOS NUEVOS O EXISTENTES, SE EJECUTA
  public onChangeProyectosNuevos(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === true) {
      this.dep = ""
      console.log("valor es falso")
    }
    else {
      this.dep = ""
      console.log("valor es true")
    }
  }
  public onChangeProyectosNuevos_R(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === true) {
      this.dep_r = ""
      console.log("valor es falso")
    }
    else {
      this.dep_r = ""
      console.log("valor es true")
    }
  }
  //CUANDO EL ESTADO DEL RADIO  UN PROYECTO O MAS, SE EJECUTA
  public onChangeProyectosMas(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === true) {
      this.form.get('proyecto')?.setValue("")
      this.form.get('proyecto')?.clearValidators();
      this.form.get('proyecto')?.updateValueAndValidity();
      (this.form.get('proyectos') as FormArray).controls.forEach((control) => {
        control.get("nombre_proyecto")?.setValidators([Validators.required]);
        control.get("dependencia")?.setValidators([Validators.required]);
        control.get("monto")?.setValidators([Validators.required]);

        control.get("monto")?.updateValueAndValidity();
        control.get("nombre_proyecto")?.updateValueAndValidity();
        control.get("dependencia")?.updateValueAndValidity();
      });


    }
    else {
      // Restaurar validación original de `proyecto`
      this.form.get('proyecto')?.setValidators([Validators.required]);
      this.form.get('proyecto')?.updateValueAndValidity();

      // Quitar validadores de `proyectos`
      (this.form.get('proyectos') as FormArray).controls.forEach((control) => {
        control.get("nombre_proyecto")?.clearValidators();
        control.get("dependencia")?.clearValidators();
        control.get("monto")?.clearValidators();

        control.get("monto")?.updateValueAndValidity();
        control.get("nombre_proyecto")?.updateValueAndValidity();
        control.get("dependencia")?.updateValueAndValidity();
      });
    }
  }
  public onChangeProyectosMas_R(value: boolean): void {
    this.log(`valueChange ${value}`);
    if (value === true) {
      this.form.get('proyecto_r')?.setValue("")
      this.form_r.get('proyecto_r')?.clearValidators();
      this.form_r.get('proyecto_r')?.updateValueAndValidity();
      (this.form_r.get('proyectos_r') as FormArray).controls.forEach((control) => {
        control.get("monto_r")?.setValidators([Validators.required]);
        control.get("nombre_proyecto_r")?.setValidators([Validators.required]);
        control.get("dependencia_r")?.setValidators([Validators.required]);

        control.get("monto_r")?.updateValueAndValidity();
        control.get("nombre_proyecto_r")?.updateValueAndValidity();
        control.get("dependencia_r")?.updateValueAndValidity();
      });
    }
    else {
      // Restaurar validación original de `proyecto`
      this.form_r.get('proyecto_r')?.setValidators([Validators.required]);
      this.form_r.get('proyecto_r')?.updateValueAndValidity();

      // Quitar validadores de `proyectos`
      (this.form_r.get('proyectos_r') as FormArray).controls.forEach((control) => {
        control.get("monto_r")?.clearValidators();
        control.get("nombre_proyecto_r")?.clearValidators();
        control.get("dependencia_r")?.clearValidators();

        control.get("monto_r")?.updateValueAndValidity();
        control.get("nombre_proyecto_r")?.updateValueAndValidity();
        control.get("dependencia_r")?.updateValueAndValidity();
      });
    }
  }
  //MANTIENE LOS REGISTROS O ACCIONES  IMPORTANTES
  private log(event: string): void {
    this.events.unshift(`${event}`);
  }
  // TRAE LOS PROYECTOS DE 2024 Y 2025, LOS MANTIENE AL INICIAR(ENDPOINT)
  public GetProyectos() {
    this.apiService.CatalaogoQ().subscribe(
      (data) => {
        this.Proyecto = data.respuesta
        this.Proyecto_r = data.respuesta
        console.log("Proyectos", data.respuesta)
      },
      (error) => {
        console.log(error)

      }
    );
  }
  // TRAE LOS DESTINATARIOS Y LOS MANTIENE AL INICIAR(POCKETBASE)
  async GetDestinatarios() {
    try {
      const response = await this.pocketBaseService.getRecords("destinatarios");
      this.Destinatario = response
      this.Destinatario_r = response
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }

  }
  //////////////////////////////////////////////////////
  ///////// AGREGAR AMPLIACION A POCKETBASE  ///////////
  //////////////////////////////////////////////////////
  async agregarAmpliacion() {
    let body_json = {
      aprobado: this.cheked,
      q_existente: this.cheked2,
      mas_proyectos: this.cheked3,
      num_circular: this.form.value.numero_circular,
      fecha: this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap: this.form.value.solicitud_afectacion_presupuestal,
      fam: this.form.value.formato_adecuacion_metas,
      copias: this.copia,
      tipo_oficio: "Ampliación",
      doe: this.Doe_aux,
      proyectos: this.form.value.proyectos,
      destinatario: this.form.value.destinatario,
      cargo: this.cargo
    }

    try {
      const respuesta = await this.pocketBaseService.addRecord('ampliaciones', body_json);
      for (const proyecto of this.form.value.proyectos) {
        await this.pocketBaseService.agregarProyectoAmpliacion(
          respuesta.id,
          proyecto.nombre_proyecto,
          proyecto.dependencia,
          proyecto.monto
        );
      }
    } catch (error) {
      console.error('Error al agregar el registro:', error);
    }
  }
  ///////////////////////////////////////////////////////
  ///////// AGREGAR REDUCCIONES A POCKETBASE  ///////////
  //////////////////////////////////////////////////////
  async agregarReducciones() {
    let body_json = {
      aprobado: this.auth_r,
      q_existente: this.exits,
      mas_proyectos: this.plus,
      num_circular: this.form_r.value.numero_circular_r,
      fecha: this.form_r.value.fecha_r,
      asunto: this.form_r.value.asunto_r,
      aten_circular: this.form_r.value.oficio_atencion_r,
      proyecto: this.form_r.value.proyecto_r,
      dep: this.dep_r,
      monto: this.resultadoFinal_r,
      justificacion: this.form_r.value.justificacion_r,
      sap: this.form_r.value.solicitud_afectacion_presupuestal_r,
      fam: this.form_r.value.formato_adecuacion_metas_r,
      copias: this.copia_r,
      proyectos: this.form_r.value.proyectos_r,
      destinatario: this.form_r.value.destinatario_r,
      cargo: this.cargo_r
    }

    try {
      const respuesta = await this.pocketBaseService.addRecord('reducciones', body_json);
      for (const proyecto of this.form_r.value.proyectos_r) {
        await this.pocketBaseService.agregarProyectoReduccion(
          respuesta.id,
          proyecto.nombre_proyecto_r,
          proyecto.dependencia_r,
          proyecto.monto_r
        );
      }
    } catch (error) {
      console.error('Error al agregar el registro:', error);
    }
  }
  //**************************OBTENER AMPLIACIONES DESDE POCKET BASE(GRID)****************************
  async obtenerAmpliaciones() {
    try {
      const response = await this.pocketBaseService.getRecords("ampliaciones");
      this.getAmpliaciones = response.map(item => ({
        ...item,
        Estado: item['aprobado'] ? "Procedente" : "Improcedente"
      }));
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  }
  //**************************OBTENER REDUCCIONES DESDE POCKET BASE (GRID)****************************
  async obtenerReducciones() {
    try {
      const response = await this.pocketBaseService.getRecords("reducciones");
      this.getReducciones = response.map(item => ({
        ...item,
        Estado: item['aprobado'] ? "Procedente" : "Improcedente"
      }));
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  }
  // EXPORTAR TODOS LOS DATOS DE AMPLIACIONES
  public allData(): ExcelExportData {
    if (!this.getAmpliaciones) {
      console.error("getAmpliaciones es undefined");
      return { data: [], group: [] };
    }

    const result: ExcelExportData = {
      data: process(this.getAmpliaciones, {
        group: this.group,
        sort: [{ field: "id", dir: "asc" }],
      }).data,
      group: this.group,
    };

    return result;
  }
  // EXPORTAR TODOS LOS DATOS DE REDUCCIONES
  public allData_R(): ExcelExportData {
    if (!this.getReducciones) {
      console.error("getReducciones es undefined");
      return { data: [], group: [] };
    }

    const result: ExcelExportData = {
      data: process(this.getReducciones, {
        group: this.group,
        sort: [{ field: "id", dir: "asc" }],
      }).data,
      group: this.group,
    };
    return result;
  }
  //EDITAR REGISTROS DE AMPLIACIONES(GRID)
  public editarRegistro(dataItem: any): void {
    this.idRegistroSeleccionado = dataItem.id;
    const datatime = dataItem.fecha
    const fechaConvertida = new Date(datatime);
    this.form.patchValue({
      numero_circular: dataItem.num_circular,
      asunto: dataItem.asunto,
      fecha: fechaConvertida,
      oficio_atencion: dataItem.aten_circular,
      proyecto: dataItem.proyecto,
      justificacion: dataItem.justificacion,
      solicitud_afectacion_presupuestal: dataItem.sap,
      formato_adecuacion_metas: dataItem.fam,
      destinatario: dataItem.destinatario,
    });
    // Variables adicionales que no están en el formulario
    this.dep = dataItem.dep;
    this.resultadoFinal = dataItem.monto;
    this.copia = dataItem.copias;
    this.cheked = dataItem.aprobado;
    this.cheked2 = dataItem.q_existente;
    this.cheked3 = dataItem.mas_proyectos;
    this.cargo = dataItem.cargo

    this.pocketBaseService.getRecords_ampliacion_proy("ampliaciones_proy", dataItem.id).then((record: any) => {
      if (record.items) {
        this.actualizarFormulario(record.items);
      } else {
        console.warn("⚠️ No hay proyectos relacionados.");
      }
    }).catch((error: any) => console.error("❌ Error al obtener datos:", error));
  }
  //TRAER AL FORM MAS PROYECTOS SI ES QUE EXISTEN
  public actualizarFormulario(proyectos: any[]) {
    const proyectosFormArray = this.form.get('proyectos') as FormArray;
    proyectosFormArray.clear(); // Limpiar antes de agregar nuevos
    proyectos.forEach((proyecto: any) => {
      proyectosFormArray.push(
        new FormGroup({
          nombre_proyecto: new FormControl(proyecto.nombre_proyecto),
          dependencia: new FormControl(proyecto.dependencia),
          monto: new FormControl(proyecto.monto)
        })
      );
    });
  }
  //EDITAR REGISTROS DE REDUCCIONES(GRID)
  public editarRegistro_R(dataItem: any): void {
    this.idRegistroSeleccionado_r = dataItem.id;
    console.log("Editar registros", this.idRegistroSeleccionado_r)
    const datatime = dataItem.fecha
    const fechaConvertida = new Date(datatime);
    this.form_r.patchValue({
      numero_circular_r: dataItem.num_circular,
      asunto_r: dataItem.asunto,
      fecha_r: fechaConvertida,
      oficio_atencion_r: dataItem.aten_circular,
      proyecto_r: dataItem.proyecto,
      justificacion_r: dataItem.justificacion,
      solicitud_afectacion_presupuestal_r: dataItem.sap,
      formato_adecuacion_metas_r: dataItem.fam,
      proyectos_r: dataItem.proyectos, // No sirvio esta parte de traer los demas Q's
      destinatario_r: dataItem.destinatario,
    });
    // Variables adicionales que no están en el formulario
    this.dep_r = dataItem.dep;
    this.resultadoFinal_r = dataItem.monto;
    this.copia_r = dataItem.copias;
    this.auth_r = dataItem.aprobado;
    this.exits = dataItem.q_existente;
    this.plus = dataItem.mas_proyectos;
    this.cargo_r = dataItem.cargo
    this.pocketBaseService.getRecords_reduccion_proy("reducciones_proy", dataItem.id).then((record: any) => {
      console.log("🛠️ Datos completos con proyectos:", record);
      if (record.items) {
        this.actualizarFormulario_R(record.items);
      } else {
        console.warn("⚠️ No hay proyectos relacionados.");
      }
    }).catch((error: any) => console.error("❌ Error al obtener datos:", error));

  }
  //TRAER AL FORM MAS PROYECTOS SI ES QUE EXISTEN
  public actualizarFormulario_R(proyectos: any[]) {
    const proyectosFormArray = this.form_r.get('proyectos_r') as FormArray;
    proyectosFormArray.clear();
    proyectos.forEach((proyecto: any) => {
      proyectosFormArray.push(
        new FormGroup({
          nombre_proyecto_r: new FormControl(proyecto.nombre_proyecto),
          dependencia_r: new FormControl(proyecto.dependencia),
          monto_r: new FormControl(proyecto.monto)
        })
      );
    });
  }
  ////////////////////////////////////////////////////////////////////////////////
  ///////// ACTUALIZAR AMPLIACIONES A POCKETBASE Y ACTUALIZAR OFICIO  ////////////
  ///////////////////////////////////////////////////////////////////////////////
  async actualizarAmpliaciones(id: string) {
    let proyectosFormArray = (this.form.get('proyectos') as FormArray).value;
    let proyectosTransformados = proyectosFormArray.map((proyecto: any) => ({
      nombre_proyecto: proyecto.nombre_proyecto,
      dependencia: proyecto.dependencia,
      monto: proyecto.monto
    }));
    let datosActualizados = {
      aprobado: this.cheked,
      q_existente: this.cheked2,
      mas_proyectos: this.cheked3,
      num_circular: this.form.value.numero_circular,
      fecha: this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap: this.form.value.solicitud_afectacion_presupuestal,
      fam: this.form.value.formato_adecuacion_metas,
      copias: this.copia,
      proyectos: this.form.value.proyectos,
      destinatario: this.form.value.destinatario,
      cargo: this.cargo,
      tipo_oficio: "ampliacion",
      doe: this.Doe_aux
    }
    try {
      const respuesta = await this.pocketBaseService.updateRecord('ampliaciones', 'ampliaciones_proy', 'ampliaciones_id', id, datosActualizados, proyectosTransformados);
      let data = JSON.stringify(datosActualizados);
      this.isDisabled = true;
      this.adecuacionesService.GenerarOficio(data).subscribe(
        (response) => {
          this.idRegistroSeleccionado = ""
          this.obtenerAmpliaciones()
          this.GetFiles();
          this.isDisabled = false;
          this.form.reset();
          this.form.reset({
            fecha: new Date() // Restaura el campo de fecha al día actual
          });
          this.dep = ''
          this.resultadoFinal = ''
          this.copia = ''
          this.cargo = ''
          if (response.success != true) {
            this.isDisabled = false;
            this.idRegistroSeleccionado = ""
            this.notificationService.show({
              content: "Algo Salio mal",
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
          else {
            this.idRegistroSeleccionado = ""
            this.isDisabled = false;
            this.notificationService.show({
              content: "La Circular se Genero con Exito",
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
        },
        (error) => {
          console.log(error)
        }
      );
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////// ACTUALIZAR AMPLIACIONES A POCKETBASE Y ACTUALIZAR OFICIO  ////////////
  ///////////////////////////////////////////////////////////////////////////////
  async actualizarReducciones(id: string) {
    let proyectosFormArray = (this.form_r.get('proyectos_r') as FormArray).value;
    let proyectosTransformados = proyectosFormArray.map((proyecto: any) => ({
      nombre_proyecto: proyecto.nombre_proyecto_r,
      dependencia: proyecto.dependencia_r,
      monto: proyecto.monto_r
    }));
    let datosActualizados = {
      aprobado: this.auth_r,
      q_existente: this.exits,
      mas_proyectos: this.plus,
      num_circular: this.form_r.value.numero_circular_r,
      fecha: this.form_r.value.fecha_r,
      asunto: this.form_r.value.asunto_r,
      aten_circular: this.form_r.value.oficio_atencion_r,
      proyecto: this.form_r.value.proyecto_r,
      dep: this.dep_r,
      monto: this.resultadoFinal_r,
      justificacion: this.form_r.value.justificacion_r,
      sap: this.form_r.value.solicitud_afectacion_presupuestal_r,
      fam: this.form_r.value.formato_adecuacion_metas_r,
      copias: this.copia_r,
      proyectos: this.form_r.value.proyectos_r,
      destinatario: this.form_r.value.destinatario_r,
      cargo: this.cargo_r,
      tipo_oficio: "reduccion",
      doe: this.Doe_aux_r
    }

    try {
      const respuesta = await this.pocketBaseService.updateRecord('reducciones', 'reducciones_proy', 'reducciones_id', id, datosActualizados, proyectosTransformados);
      let data = JSON.stringify(datosActualizados);
      this.isDisabled = true;
      this.adecuacionesService.GenerarOficioReduccion(data).subscribe(
        (response) => {
          this.idRegistroSeleccionado_r = ""
          this.obtenerReducciones()
          this.GetFiles_R();
          this.isDisabled = false;
          this.form_r.reset();
          this.form_r.reset({
            fecha_r: new Date() // Restaura el campo de fecha al día actual
          });
          this.dep_r = ''
          this.resultadoFinal_r = ''
          this.resultadoFinal_r_input = ''
          this.copia_r = ''
          this.cargo_r = ''
          if (response.success != true) {
            this.isDisabled = false;
            this.idRegistroSeleccionado_r = ""
            this.notificationService.show({
              content: "Algo Salio mal",
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
          else {
            this.idRegistroSeleccionado_r = ""
            this.isDisabled = false;
            this.notificationService.show({
              content: "La Circular se Genero con Exito",
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
        },
        (error) => {
          console.log(error)
        }
      );
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  }

  //METODO QUE VALIDA EL ID QUE SE ACTUALIZARA E INVOCA SU ACTUALIZACION
  public guardarCambios(): void {
    if (!this.idRegistroSeleccionado) {
      console.error("No hay un ID de registro seleccionado");
      return;
    }

    this.actualizarAmpliaciones(this.idRegistroSeleccionado);
  }
  public guardarCambiosReducciones(): void {
    if (!this.idRegistroSeleccionado_r) {
      return;
    }
    this.actualizarReducciones(this.idRegistroSeleccionado_r);
  }

  //METODO QUE INVALIDA EL ID Y CANCELA LA ACTUALIZACION
  public cancelarCambios(): void {
    this.idRegistroSeleccionado = ""
    this.obtenerAmpliaciones()
    this.GetFiles();
    this.isDisabled = false;
    this.form.reset();
    this.form.reset({
      fecha: new Date() // Restaura el campo de fecha al día actual
    });
    this.dep = ''
    this.resultadoFinal = ''
    this.copia = ''
    this.cargo = ''
  }
  public cancelarCambiosReducciones(): void {
    this.idRegistroSeleccionado_r = ""
    this.obtenerReducciones()
    this.GetFiles_R();
    this.isDisabled = false;
    this.form_r.reset();
    this.form_r.reset({
      fecha_r: new Date() // Restaura el campo de fecha al día actual
    });
    this.dep_r = ''
    this.resultadoFinal_r = ''
    this.resultadoFinal_r_input = ''
    this.copia_r = ''
    this.cargo_r = ''
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////// GENERA OFICIOS DE AMPLIACIONES  ////////////
  ///////////////////////////////////////////////////////////////////////////////
  public GenerarAmpliacion() {
    let body_json = {
      aprobado: this.cheked,
      q_existente: this.cheked2,
      mas_proyectos: this.cheked3,
      num_circular: this.form.value.numero_circular,
      fecha: this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap: this.form.value.solicitud_afectacion_presupuestal,
      fam: this.form.value.formato_adecuacion_metas,
      copias: this.copia,
      proyectos: this.form.value.proyectos,
      destinatario: this.form.value.destinatario,
      cargo: this.cargo,
      tipo_oficio: "ampliacion",
      doe: this.Doe_aux
    }
    let data = JSON.stringify(body_json);
    this.isDisabled = true;
    this.agregarAmpliacion() //AGREGAMOS A POCKET BASE
    this.adecuacionesService.GenerarOficio(data).subscribe(
      (response) => {
        this.obtenerAmpliaciones()
        this.GetFiles();
        this.resultadoFinal_input = ""
        this.isDisabled = false;
        this.form.reset()
        this.dep = ''
        this.resultadoFinal = ''
        this.form.reset({
          fecha: new Date() // Restaura el campo de fecha al día actual
        });
        this.copia = ''
        this.cargo = ''
        console.log(response)
        if (response.success != true) {
          this.isDisabled = false;
          this.notificationService.show({
            content: "Algo Salio mal",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "warning", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
        else {
          this.isDisabled = false;
          this.notificationService.show({
            content: "La Circular se Genero con Exito",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
      },
      (error) => {
        console.log(error)
        this.isDisabled = false;
        this.notificationService.show({
          content: "La Circular se Genero con Exito",
          hideAfter: 2500,
          animation: { type: "slide", duration: 2500 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
      }
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////// GENERA OFICIOS DE REDUCCIONES  ////////////
  ///////////////////////////////////////////////////////////////////////////////
  public GenerarReduccion() {
    let body_json = {
      aprobado: this.auth_r,
      q_existente: this.exits,
      mas_proyectos: this.plus,
      num_circular: this.form_r.value.numero_circular_r,
      fecha: this.form_r.value.fecha_r,
      asunto: this.form_r.value.asunto_r,
      aten_circular: this.form_r.value.oficio_atencion_r,
      proyecto: this.form_r.value.proyecto_r,
      dep: this.dep_r,
      monto: this.resultadoFinal_r,
      justificacion: this.form_r.value.justificacion_r,
      sap: this.form_r.value.solicitud_afectacion_presupuestal_r,
      fam: this.form_r.value.formato_adecuacion_metas_r,
      copias: this.copia_r,
      proyectos: this.form_r.value.proyectos_r,
      destinatario: this.form_r.value.destinatario_r,
      cargo: this.cargo_r,
      tipo_oficio: "reduccion",
      doe: this.Doe_aux_r
    }
    console.log("reduccion_data", body_json)
    let data = JSON.stringify(body_json);
    this.isDisabled = true;
    this.agregarReducciones() //AGREGAMOS A POCKET BASE
    this.adecuacionesService.GenerarOficioReduccion(data).subscribe(
      (response) => {
        this.obtenerReducciones()
        this.GetFiles_R();
        this.resultadoFinal_r_input = ''
        this.isDisabled = false;
        this.form_r.reset()
        this.dep_r = ''
        this.resultadoFinal_r = ''
        this.form_r.reset({
          fecha_r: new Date() // Restaura el campo de fecha al día actual
        });
        this.copia_r = ''
        this.cargo_r = ''
        console.log(response)
        if (response.success != true) {
          this.isDisabled = false;
          this.notificationService.show({
            content: "Algo Salio mal",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "warning", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
        else {
          this.isDisabled = false;
          this.notificationService.show({
            content: "La Circular se Genero con Exito",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
      },
      (error) => {
        console.log(error)
        this.isDisabled = false;
        this.notificationService.show({
          content: "La Circular se Genero con Exito",
          hideAfter: 2500,
          animation: { type: "slide", duration: 2500 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
      }
    );

  }

  //ACCION QUE SE EJECUTA AL BUSCAR  Y ASIGNA VALORES(DEP Y DOE) DEPENDIENDO DE LA SELECCION DE PROYECTO EXISTENTE
  public valueChangeProyecto(proy: string): void {
    if (proy === "") {
      this.dep = ""
      this.DestinatarioFiltrado = [];
      return;
    }
    const contactData = this.Proyecto.find((c) =>
      c.Proyecto.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    if (contactData) {
      this.dep = contactData.dependencia;
      this.siglas = contactData.siglas;
       // Buscar el DoE correspondiente
      const contactData2 = this.Doe.find((c) =>
        c.siglas.toLowerCase().includes(this.siglas.toLocaleLowerCase())
      );
      if (contactData2) {
        this.Doe_aux = contactData2.DoE;
      }
      // 🔹 Filtrar los destinatarios que pertenecen a la dependencia
    this.DestinatarioFiltrado = this.Destinatario.filter(
      d => d.Doe?.toLowerCase() === this.siglas.toLowerCase()).map(d=> d.destinatario);
      console.log("siglas",this.siglas)
    console.log("des",this.DestinatarioFiltrado_r)
    
      if (this.dep_dir !== "") {
        if (this.dep_dir === this.siglas) {
          console.log("Coincide");
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "fade", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          console.log("No Coinciden");
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("data", contactData.dependencia);
      }
    } else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = "";
    }
  }


  public valueChangeProyecto_R(proy: string): void {
    if (proy === "") {
      this.dep_r = ""
      this.DestinatarioFiltrado_r = [];
      return;
    }
    const contactData = this.Proyecto_r.find((c) =>
      c.Proyecto.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    console.log("proyectoselecionado",contactData)
    if (contactData) {
      this.dep_r = contactData.dependencia;
      this.siglas_r = contactData.siglas;
      const contactData2 = this.Doe.find((c) =>
        c.siglas.toLowerCase().includes(this.siglas_r.toLocaleLowerCase())
      );
      console.log("doe seleccioando",contactData2)
      if (contactData2) {
        this.Doe_aux_r = contactData2.DoE;
      }
      console.log("destia",this.Destinatario_r)
        // 🔹 Filtrar los destinatarios que pertenecen a la dependencia
    this.DestinatarioFiltrado_r = this.Destinatario_r.filter(
      d => d.Doe?.toLowerCase() === this.siglas_r.toLowerCase()).map(d=> d.destinatario);
      console.log("siglas",this.siglas_r)
    console.log("des_r",this.DestinatarioFiltrado_r)

      if (this.dep_dir_r !== "") {
        if (this.dep_dir_r === this.siglas_r) {
          console.log("Coincide");
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          console.log("No Coinciden");
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("data", contactData.dependencia);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
    }
  }

  //ACCION QUE SE EJECUTA AL BUSCAR  Y ASIGNA VALORES(DOE) DEPENDIENDO DE LA SELECCION DE DEPENDENCIA, CASO DONDE ES UN Q NUEVO
  public valueChangeDoE(dep: string): void {
    if (dep === "") {
      return;
    }
    const contactData = this.Doe.find((c) =>
      c.nombre.toLowerCase().includes(dep.toLocaleLowerCase())
    );
    if (contactData) {
      this.Doe_aux = contactData.DoE;
      this.DoE_dir = contactData.siglas
      this.dep = contactData.nombre
      if (this.dep_dir !== "") {
        if (this.DoE_dir === this.dep_dir) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("cargo", this.Doe_aux);
        console.log("DoE", this.DoE_dir);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = "";
    }
  }
  public valueChangeDoE_R(dep: string): void {
    if (dep === "") {
      return;
    }
    const contactData = this.Doe.find((c) =>
      c.nombre.toLowerCase().includes(dep.toLocaleLowerCase())
    );
    if (contactData) {
      this.dep_r = contactData.nombre
      this.Doe_aux_r = contactData.DoE;
      this.DoE_dir_r = contactData.siglas;
      if (this.dep_dir_r !== "") {
        if (this.DoE_dir_r === this.dep_dir_r) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }

      }
      else {
        console.log("cargo", this.Doe_aux_r);
        console.log("DoE", this.DoE_dir);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
    }
  }

  //ACCION QUE SE EJECUTA AL BUSCAR  Y ASIGNA VALORES(DOE) DEPENDIENDO DE LA SELECCION DE DESTINATARIOS, CASO DONDE NO ES PROCEDENTE
  public valueChangeDestinatarios(proy: string): void {
    if (proy === "") {
      this.cargo = ""
      return;
    }
    const contactData = this.Destinatario.find((c) =>
      c.destinatario.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    if (contactData) {
      this.cargo = contactData.cargo;
      this.dep_dir = contactData.Doe
      if (this.dep !== "") {
        if (this.dep_dir === this.siglas || this.DoE_dir === this.dep_dir) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("cargo", this.cargo);
        console.log("DoE", this.dep_dir);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
    }
  }

  public valueChangeDestinatarios_R(proy: string): void {
    if (proy === "") {
      this.cargo_r = ""
      return;
    }
    const contactData = this.Destinatario_r.find((c) =>
      c.destinatario.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    if (contactData) {
      this.cargo_r = contactData.cargo;
      this.dep_dir_r = contactData.Doe
      if (this.dep_r !== "") {
        if (this.dep_dir_r === this.siglas_r || this.DoE_dir_r === this.dep_dir_r) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("cargo", this.cargo_r);
        console.log("DoE", this.dep_dir_r);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = "";
    }
  }

  // METODO QUE COMPRUEBA QUE LAS DEPENDENCIAS COINCIDAN ENTRE PROYECTOS NO ES LIMITATIVA PARA ENVIAR 
  public Comprobacion() {
    const formArray = this.form.get('proyectos') as FormArray;
    formArray.controls.forEach(control => {
      control.get("dependencia")?.updateValueAndValidity();
    });
    const dependencias = formArray.controls.map(control => control.get("dependencia")?.value);
    const dependenciasValidas = dependencias.filter(dep => dep !== "" && dep !== null && dep !== undefined);
    if (dependenciasValidas.length < 2) {
      console.warn("No hay suficientes valores válidos para comparar.");
    }
    else {
      const todasIguales = dependenciasValidas.every(dep => dep === dependenciasValidas[0]);
      if (!todasIguales) {
        console.error("Error: Todas las dependencias deben ser iguales.");
        alert("Error: las dependencias deben ser iguales.");
      }
      else {
        this.dep = dependenciasValidas[0];
        this.notificationService.show({
          content: "Correcto: las dependencias coinciden",
          hideAfter: 2500,
          animation: { type: "slide", duration: 2500 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log("Dependencia seleccionada:", this.dep);
      }
    }
  }
  public Comprobacion_R() {
    const formArray = this.form_r.get('proyectos_r') as FormArray;
    formArray.controls.forEach(control => {
      control.get("dependencia_r")?.updateValueAndValidity();
    });
    const dependencias = formArray.controls.map(control => control.get("dependencia_r")?.value);
    const dependenciasValidas = dependencias.filter(dep => dep !== "" && dep !== null && dep !== undefined);
    if (dependenciasValidas.length < 2) {
      console.warn("No hay suficientes valores válidos para comparar.");
    }
    else {
      const todasIguales = dependenciasValidas.every(dep => dep === dependenciasValidas[0]);
      if (!todasIguales) {
        alert("Error: las dependencias deben ser iguales.");
      }
      else {
        this.dep_r = dependenciasValidas[0];
        this.notificationService.show({
          content: "Correcto: las dependencias coinciden",
          hideAfter: 2500,
          animation: { type: "slide", duration: 2500 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log("Dependencia seleccionada:", this.dep_r);
      }
    }
  }

  //ACCION QUE SE EJECUTA AL BUSCAR  Y ASIGNA VALORES(DOE) DEPENDIENDO DE LA SELECCION DE PROEYCTOS, CASO DONDE SON MAS Q
  public valueChangeProyectos(index: number, proy: any): void {
    if (proy === "") {
      this.dep = ""
      return;
    }
    const contactData = this.Proyecto.find((c) =>
      c.Proyecto.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    if (contactData) {
      this.proyectos.at(index).patchValue({
        dependencia: contactData.dependencia
      });
      this.dep = contactData.dependencia
      this.siglas = contactData.siglas;
      const contactData2 = this.Doe.find((c) =>
        c.siglas.toLowerCase().includes(this.siglas.toLocaleLowerCase())
      );
      if (contactData2) {
        this.Doe_aux = contactData2.DoE;
      }
      if (this.dep_dir !== "") {
        if (this.dep_dir === this.siglas || this.DoE_dir === this.dep_dir) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "fade", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          console.log("No Coinciden");
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("data3", this.dep);
      }

    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
    }
  }
  public valueChangeProyectos_R(index: number, proy: any): void {
    if (proy === "") {
      this.dep_r = ""
      return;
    }
    const contactData = this.Proyecto.find((c) =>
      c.Proyecto.toLowerCase().includes(proy.toLocaleLowerCase())
    );
    if (contactData) {
      this.proyectos_R.at(index).patchValue({
        dependencia_r: contactData.dependencia
      });
      this.siglas_r = contactData.siglas;
      const contactData2 = this.Doe.find((c) =>
        c.siglas.toLowerCase().includes(this.siglas_r.toLocaleLowerCase())
      );
      if (contactData2) {
        this.Doe_aux_r = contactData2.DoE;
      }
      if (this.dep_dir_r !== "") {
        if (this.dep_dir_r === this.siglas_r) {
          this.notificationService.show({
            content: "El destinario pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "success", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "El destinario NO pertenece a la dependencia ",
            hideAfter: 2500,
            animation: { type: "slide", duration: 2500 },
            type: { style: "error", icon: true },
            position: { horizontal: "right", vertical: "top" },
          });
        }
      }
      else {
        console.log("data2", this.proyectos_R.value.dependencia);
      }
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
    }
  }

  //ACCION QUE SE EJECUTA AL BUSCAR  Y ASIGNA VALORES(FIRMANTES) DEPENDIENDO DE LA SELECCION DE FIRMANTES
  public valueChangeCopias(copia: string): void {
    if (copia === "") {
      return;
    }
    const contactData = this.copias.find((c) =>
      c.siglas.toLowerCase().includes(copia.toLowerCase())
    );
    if (contactData) {
      if (!this.copia.split("/").includes(contactData.siglas)) {
        this.copia = this.copia ? `${this.copia}/${contactData.siglas}` : contactData.siglas;
      }
      this.form.controls["copias"].setValue("");
    }
    else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
    }
  }
  public valueChangeCopias_R(copia: string): void {
    if (copia === "") {
      return;
    }
    const contactData = this.copias.find((c) =>
      c.siglas.toLowerCase().includes(copia.toLowerCase())
    );
    if (contactData) {
      // Si ya existe, evitamos agregar duplicados
      if (!this.copia_r.split("/").includes(contactData.siglas)) {
        this.copia_r = this.copia_r ? `${this.copia_r}/${contactData.siglas}` : contactData.siglas;
      }
      this.form_r.controls["copias_r"].setValue("");
    } else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
    }
  }

  //FUNCION PARA ELIMINAR  FIRMANTES UNO POR UNO
  public removeElementFromCopia(elemento: string): void {
    if (!this.copia) return;
    let elementos = this.copia.split("/").filter(el => el !== elemento);
    this.copia = elementos.join("/") || "";
  }
  public removeElementFromCopia_R(elemento: string): void {
    if (!this.copia_r) return;
    let elementos = this.copia_r.split("/").filter(el => el !== elemento);
    this.copia_r = elementos.join("/") || "";
  }

  //FUNCION PARA ELIMINAR TODOS LOS FIMANTES
  public clearCopia(): void {
    this.copia = "";
    this.form.controls["copias"].setValue("");;
  }
  public clearCopia_R(): void {
    this.copia_r = "";
    this.form_r.controls["copias_r"].setValue("");
    console.log("Variable copia limpiada.");
  }

  // CARGAR LAS DEPENDENCIAS DE POCKETBASE
  public loadDependencias() {
    this.pocketBaseService.getDependencias().then(
      (data) => {
        this.dependencias = data.map((item: any) => ({
          nombre: item.nombre,
          siglas: item.siglas
        }));
        this.Doe = data.map((item: any) => ({
          nombre: item.nombre,
          siglas: item.siglas,
          DoE: item.doe
        }))
      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }
  // CARGAR LAS FIRMANTES DE POCKETBASE
  public loadCopias() {
    this.pocketBaseService.getCopias().then(
      (data) => {
        this.copias = data.map((item: any) => ({
          siglas: item.siglas,
          nombre: item.nombre
        }));

      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }
}
