import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { fileWordIcon, imageIcon ,menuIcon, SVGIcon, copyIcon,fileExcelIcon,chartDoughnutIcon, plusCircleIcon, minusIcon, minusCircleIcon} from '@progress/kendo-svg-icons';
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
import { AutoCompleteComponent, DropDownsModule } from "@progress/kendo-angular-dropdowns"
import { PocketbaseService } from '../../../services/pocketbase.service';
import { ApiService } from '../../../services/api.service';

interface DataDep {
  nombre: string;
  siglas: string;
}
@Component({
  selector: 'app-adecuaciones-content',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS,ButtonsModule,DateInputsModule,IntlModule,LabelModule,FormFieldModule,IconsModule, 
      KENDO_FLOATINGLABEL,KENDO_LABEL,KENDO_INPUTS,ReactiveFormsModule,KENDO_DATEINPUTS,KENDO_NOTIFICATION,LayoutModule,KENDO_PROGRESSBARS,
      WindowModule,FormsModule,DropDownsModule],
  templateUrl: './adecuaciones-content.component.html',
  styleUrl: './adecuaciones-content.component.scss'
})
export class AdecuacionesContentComponent implements OnInit{
  @ViewChild("deplist") public list?: AutoCompleteComponent;
  @Input() selectedItem: string | undefined;
  public form: FormGroup;
  public cheked = true
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public fileExcelIcon: SVGIcon=fileExcelIcon
  public plusCircleIcon: SVGIcon = plusCircleIcon;
  public chartDoughnutIcon:SVGIcon=chartDoughnutIcon;
  public minusIcon: SVGIcon = minusIcon;
  public minusCircleIcon: SVGIcon = minusCircleIcon;
  public asunto:string = ""
  public oficio_atencion:string = ""
  public dep:string=""
  // public selected: DataDep ={nombre: "",
  //   siglas:""};
  fecha: Date = new Date()
  numero_circular:string=''
  // public data = {
  //   numero_circular: this.numero_circular,
  //   fecha: this.fecha,
  //   asunto:this.asunto,
  //   oficio_atencion: this.oficio_atencion,
  //   dep: this.dep
  // };

  public dependencias: Array<{ nombre: string,siglas:string }> = [
  ];
  public dependenciasSelected: Array<{ nombre: string }> = [
  ];
  progress_ampl:number = 0
  public isDisabled = false;
  ngOnInit(): void {
    this.loadDependencias();
    this.GetQ();
  }
  constructor( private pocketBaseService: PocketbaseService, private apiService: ApiService) {
    this.form = new FormGroup({
      numero_circular: new FormControl(this.numero_circular, [Validators.required]),
      fecha: new FormControl(this.fecha, [Validators.required,]),
      asunto: new FormControl(this.asunto, [Validators.required,]),
      oficio_atencion: new FormControl(this.oficio_atencion, [Validators.required,]),
      dependencia: new FormControl(this.dep, [Validators.required,]),
    }); 

  }
  public GetQ(){
    this.apiService.CatalaogoQ().subscribe(
      (data)=>{
console.log(data)
      },
      (error)=>{
        console.log(error)

      }
    );

  }
  GenerarAmpliacion(){

    console.log(this.form.value.numero_circular)
    console.log(this.form.value.fecha)
    console.log(this.form.value.asunto)
    console.log(this.form.value.oficio_atencion)
    console.log(this.form.value.dependencia)
    console.log(this.dep)
  }
  public valueChange(dep: string): void {
    if (dep === "") {
      return;
    }
    const contactData = this.dependencias.find((c) =>
      c.siglas.toLowerCase().includes(dep.toLocaleLowerCase())
  );
    if (contactData) {
      this.dep = contactData.nombre;
      console.log("data", contactData.nombre);
  } else {
      console.warn("No se encontró un contacto con las siglas proporcionadas.");
      this.dep = ""; // O asigna un valor predeterminado.
  }
    
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

}
