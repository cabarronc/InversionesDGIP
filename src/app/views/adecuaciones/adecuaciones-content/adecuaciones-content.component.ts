import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { fileWordIcon, imageIcon ,menuIcon, SVGIcon, copyIcon,fileExcelIcon,chartDoughnutIcon, plusCircleIcon, minusIcon, minusCircleIcon, dollarIcon, questionCircleIcon} from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_FLOATINGLABEL } from "@progress/kendo-angular-label";
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { KENDO_DATEINPUTS } from "@progress/kendo-angular-dateinputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs"
import { IntlModule } from "@progress/kendo-angular-intl";
import { LabelModule } from "@progress/kendo-angular-label";
import { FormFieldModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { IconsModule } from "@progress/kendo-angular-icons";
import { LayoutModule } from "@progress/kendo-angular-layout";
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
import { KENDO_GRID,ExcelModule } from "@progress/kendo-angular-grid";
import * as moment from 'moment-timezone';

interface DataDep {
  nombre: string;
  siglas: string;
}

export interface OficioResponse {
  aprobado: boolean
  num_circular: number,
  fecha : string,
  asunto: string,
  aten_circular: string,
  proyecto: string,
  dep: string,
  monto: string,
  justificacion: string,
  sap:string,
  fam:string,
  copias:string
}
@Component({
  selector: 'app-adecuaciones-content',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, ButtonsModule, DateInputsModule, IntlModule, LabelModule, FormFieldModule, IconsModule,
    KENDO_FLOATINGLABEL, KENDO_LABEL, KENDO_INPUTS, ReactiveFormsModule, KENDO_DATEINPUTS, KENDO_NOTIFICATION, LayoutModule, KENDO_PROGRESSBARS,
    WindowModule, FormsModule, DropDownsModule, KENDO_TOOLTIPS,KENDO_PDFVIEWER,WindowModule,KENDO_GRID,ExcelModule],
  templateUrl: './adecuaciones-content.component.html',
  styleUrl: './adecuaciones-content.component.scss'
})
export class AdecuacionesContentComponent implements OnInit{
  @ViewChild("deplist") public list?: AutoCompleteComponent;
  @Input() selectedItem: string | undefined;
  public form: FormGroup;
  public cheked = true
  public cheked2 = true
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public fileExcelIcon: SVGIcon=fileExcelIcon
  public plusCircleIcon: SVGIcon = plusCircleIcon;
  public chartDoughnutIcon:SVGIcon=chartDoughnutIcon;
  public minusIcon: SVGIcon = minusIcon;
  public minusCircleIcon: SVGIcon = minusCircleIcon;
  public dollarIcon: SVGIcon = dollarIcon
  public questionCircleIcon: SVGIcon = questionCircleIcon
  public asunto:string = ""
  public oficio_atencion:string = ""
  public dep:string=""
  public proy:string=""
  fecha: Date = new Date()
  public maxlength = 300;
  public charachtersCount: number;
  public counter: string
  numero_circular:string=''
  cantidad: string = ''; // Almacena la cantidad ingresada
  resultadoFinal: string = ''; // Resultado combinado
  public mask = "999,000,000.00";
  isGenered:boolean = true
 
  public dependencias: Array<{ nombre: string,siglas:string }> = [
  ];
  public copias: Array<{ siglas: string,nombre:string }> = [
  ];
  public Proyecto: Array<{Proyecto: string,siglas:string,dependencia:string}> = [
  ];
 public copia:string =""
  public dependenciasSelected: Array<{ nombre: string }> = [
  ];
  files: any[] = [];
  progress_ampl:number = 0
  public isDisabled = false;
  idRegistroSeleccionado: string = '';
  public getAmpliaciones:any[] = [];

  ngOnInit(): void {
    this.loadDependencias();
    this.GetProyectos();
    this.loadCopias();
    this.GetFiles();
    this.obtenerAmpliaciones();
  }
  formatDate(dateString: string): string {
    return moment.utc(dateString).tz("America/Mexico_City").format("DD/MM/YYYY HH:mm");
  }
  //OBTENER ARCHIVOS
  GetFiles(){
  this.fileService.getFiles().subscribe(
    (data) => {
      this.files = data;
      console.log("archivos",this.files)
    },
    (error) => {
      console.error('Error fetching files', error);
    }
  );
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

  selectedPdf: string | null = null;  // 📌 Almacena el PDF en Base64 cuando se abre el modal
  nombre_archivo:string | null = null;
  // 📌 Función para abrir el modal con el PDF seleccionado
  openPdfModal(pdfBase64: string, name :string) {
    this.selectedPdf = pdfBase64;
    this.nombre_archivo = name;
  }

  // 📌 Función para cerrar el modal
  closePdfModal() {
    this.selectedPdf = null;
  }

  constructor( private pocketBaseService: PocketbaseService,
     private apiService: ApiService,private numberFormatService: NumberFormatService, private adecuacionesService: AdecuacionesService,
     private notificationService: NotificationService,private fileService: FileService) {
    this.form = new FormGroup({
      numero_circular: new FormControl(this.numero_circular, [Validators.required]),
      fecha: new FormControl(this.fecha, [Validators.required,]),
      asunto: new FormControl(this.asunto, [Validators.required,]),
      oficio_atencion: new FormControl(this.oficio_atencion, [Validators.required,]),
      // dependencia: new FormControl(this.dep, [Validators.required,]),
      proyecto: new FormControl(this.proy, [Validators.required,]),
      justificacion: new FormControl("", [Validators.required,]),
      solicitud_afectacion_presupuestal : new FormControl("",[Validators.required]),
      formato_adecuacion_metas : new FormControl("",[Validators.required]),
      copias : new FormControl("")
    }); 
    this.charachtersCount = this.form.value.justificacion ? this.form.value.justificacionlength : 0;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;

  }

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

  public onValueChange(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }

  public GetProyectos(){
    this.apiService.CatalaogoQ().subscribe(
      (data)=>{
        this.Proyecto = data.respuesta
      console.log(data.respuesta)
      },
      (error)=>{
        console.log(error)

      }
    );

  }
  //AGREGAR AMPLIACION
  async agregarAmpliacion() {
    let body_json = {
      aprobado: this.cheked,
      num_circular: this.form.value.numero_circular,
      fecha : this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap:this.form.value.solicitud_afectacion_presupuestal,
      fam:this.form.value.formato_adecuacion_metas,
      copias:this.copia

    }

    try {
      const respuesta = await this.pocketBaseService.addRecord('ampliaciones', body_json);
      console.log('Registro insertado:', respuesta);
    } catch (error) {
      console.error('Error al agregar el registro:', error);
    }
  }
//OBTENER AMPLAICIONES
  async obtenerAmpliaciones() {
    try {
      
      this.getAmpliaciones = await this.pocketBaseService.getRecords('ampliaciones');
      console.log('Ampliaciones:', this.getAmpliaciones);
    } catch (error) {
      console.error('Error al obtener registros:', error);
    }
  }
  editarRegistro(dataItem: any): void {
    this.idRegistroSeleccionado = dataItem.id;
    console.log("Editar registros",this.idRegistroSeleccionado)
    this.form.patchValue({
      numero_circular: dataItem.num_circular,
      asunto: dataItem.asunto,
      oficio_atencion: dataItem.aten_circular,
      proyecto: dataItem.proyecto,
      justificacion: dataItem.justificacion,
      solicitud_afectacion_presupuestal: dataItem.sap,
      formato_adecuacion_metas: dataItem.fam
    });
    console.log("form",this.form)
    // Variables adicionales que no están en el formulario
    this.dep = dataItem.dep;
    this.resultadoFinal = dataItem.monto;
    this.copia = dataItem.copias;
    this.cheked = dataItem.aprobado;
  }

  async actualizarAmpliaciones(id: string) {
    let datosActualizados = {
      aprobado: this.cheked,
      num_circular: this.form.value.numero_circular,
      fecha : this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap:this.form.value.solicitud_afectacion_presupuestal,
      fam:this.form.value.formato_adecuacion_metas,
      copias:this.copia

    }
  
    try {
      const respuesta = await this.pocketBaseService.updateRecord('ampliaciones', id, datosActualizados);
      console.log('Registro actualizado:', respuesta);
      let data = JSON.stringify(datosActualizados);
      this.adecuacionesService.GenerarOficio(data).subscribe(
        (response)=>{
          this.idRegistroSeleccionado = ""
          this.obtenerAmpliaciones()
          this.GetFiles();
          this.isDisabled = false;
          this.form.reset()
          this.dep = ''
          this.resultadoFinal =''
          this.copia = ''
          console.log(response)
          if (response.success != true){
            this.isDisabled = false;
            this.idRegistroSeleccionado = ""
            this.notificationService.show({
              content: "Algo Salio mal",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });}
            else{
              this.idRegistroSeleccionado = ""
              this.isDisabled = false;
            this.notificationService.show({
              content: "La Circular se Generro con Exito",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
        },
        (error)=>{
          console.log(error)
        }
      );
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  }
  guardarCambios(): void {
    if (!this.idRegistroSeleccionado) {
      console.error("No hay un ID de registro seleccionado");
      return;
    }
  
    this.actualizarAmpliaciones(this.idRegistroSeleccionado);
  }
  GenerarAmpliacion(){
    console.log("Aprobado: ",this.cheked) //Manejo de que platilla usar, por default True = Positivo y False= Negativo
    console.log("Q Existente: ",this.cheked2)

    console.log("Numero Circular: ",this.form.value.numero_circular)
    console.log("Fecha: ",this.form.value.fecha)
    console.log("Asunto: ",this.form.value.asunto)
    console.log("Circular Atencion:",this.form.value.oficio_atencion)
    // console.log(this.form.value.dependencia)
    
    console.log("Proyecto:",this.form.value.proyecto)
    console.log("Dependencia:",this.dep)
    console.log("Monto:",this.resultadoFinal)
    console.log("Justificacion:",this.form.value.justificacion )
    console.log("Solicitud de afectación presupuestal:",this.form.value.solicitud_afectacion_presupuestal )
    console.log("Formato de adecuación de metas:",this.form.value.formato_adecuacion_metas )
    console.log("Copia Pivote:",this.form.value.copias )
    console.log("Copia Buena:",this.copia )
    let body_json = {
      aprobado: this.cheked,
      num_circular: this.form.value.numero_circular,
      fecha : this.form.value.fecha,
      asunto: this.form.value.asunto,
      aten_circular: this.form.value.oficio_atencion,
      proyecto: this.form.value.proyecto,
      dep: this.dep,
      monto: this.resultadoFinal,
      justificacion: this.form.value.justificacion,
      sap:this.form.value.solicitud_afectacion_presupuestal,
      fam:this.form.value.formato_adecuacion_metas,
      copias:this.copia

    }
    let data = JSON.stringify(body_json);
    this.isDisabled = true;
    this.agregarAmpliacion() //AGREGAMOS A POCKET BASE
    this.adecuacionesService.GenerarOficio(data).subscribe(
      (response)=>{
        this.obtenerAmpliaciones()
        this.GetFiles();
        this.isDisabled = false;
        this.form.reset()
        this.dep = ''
        this.resultadoFinal =''
        this.copia = ''
        console.log(response)
        if (response.success != true){
          this.isDisabled = false;
          this.notificationService.show({
            content: "Algo Salio mal",
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "warning", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });}
          else{
            this.isDisabled = false;
          this.notificationService.show({
            content: "La Circular se Generro con Exito",
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
      },
      (error)=>{
        console.log(error)
      }
    );

  }
  // public valueChange(dep: string): void {
  //   if (dep === "") {

  //     return;
  //   }
  //   const contactData = this.dependencias.find((c) =>
  //     c.siglas.toLowerCase().includes(dep.toLocaleLowerCase())
  // );
  //   if (contactData) {
  //     this.dep = contactData.nombre;
  //     console.log("data", contactData.nombre);
  // } else {
  //     console.warn("No se encontró un contacto con las siglas proporcionadas.");
  //     this.dep = ""; // O asigna un valor predeterminado.
  // }
    
  // }

  public valueChange2(proy: string): void {
    if (proy === "") {
      this.dep = ""
      return;
    }
    const contactData = this.Proyecto.find((c) =>
      c.Proyecto.toLowerCase().includes(proy.toLocaleLowerCase())
  );
    if (contactData) {
      this.dep = contactData.dependencia;
      // this.form.value.dependencia = 
      console.log("data", contactData.dependencia);
  } else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
  }   
  }

  public valueChangeCopias(copia: string): void {
    if (copia === "") {
        return;
    }

    const contactData = this.copias.find((c) =>
        c.siglas.toLowerCase().includes(copia.toLowerCase())
    );

    if (contactData) {
        // Si ya existe, evitamos agregar duplicados
        if (!this.copia.split("/").includes(contactData.siglas)) {
            this.copia = this.copia ? `${this.copia}/${contactData.siglas}` : contactData.siglas;
        }
        this.form.controls["copias"].setValue("");
        console.log("data", this.copia);
    } else {
        console.warn("No se encontró un contacto con las siglas proporcionadas.");
    }
}

// 🛑 Función para eliminar un elemento específico de `this.copia`
public removeElementFromCopia(elemento: string): void {
    if (!this.copia) return;

    let elementos = this.copia.split("/").filter(el => el !== elemento);
    this.copia = elementos.join("/") || ""; // Si se eliminan todos, queda vacío

    console.log("Elemento eliminado:", elemento);
    console.log("Nueva copia:", this.copia);
}

// 🧹 Función para limpiar toda la variable `this.copia`
public clearCopia(): void {
 
    this.copia = "";
    this.form.controls["copias"].setValue(""); 
    console.log("Variable copia limpiada.");
}

  loadDependencias() {
    this.pocketBaseService.getDependencias().then(
      (data) => {
        this.dependencias = data.map((item: any) => ({
          nombre: item.nombre,
          siglas: item.siglas
        }));
        console.log(this.dependencias)
        
      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }
  loadCopias() {
    this.pocketBaseService.getCopias().then(
      (data) => {
        this.copias = data.map((item: any) => ({
          siglas: item.siglas,
          nombre: item.nombre
        }));
        console.log(this.copias)
        
      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }

}
