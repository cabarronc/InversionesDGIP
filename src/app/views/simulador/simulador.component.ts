import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { KENDO_GAUGES } from "@progress/kendo-angular-gauges";
import { KENDO_SLIDER } from "@progress/kendo-angular-inputs";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { AuthService, User } from '../../services/auth.service';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_PROGRESSBARS } from "@progress/kendo-angular-progressbar";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";

import { KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormsModule } from '@angular/forms';
import { KENDO_ICONS } from "@progress/kendo-angular-icons";
import { paperclipIcon, infoSolidIcon, imageIcon,accessibilityIcon,dollarIcon,buildingsOutlineIcon } from "@progress/kendo-svg-icons";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DecimalPipe } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase.service';



@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [KENDO_ICONS, TooltipModule, ReactiveFormsModule, KENDO_DROPDOWNS, KENDO_SLIDER, KENDO_GAUGES, KENDO_LABELS, KENDO_LAYOUT, KENDO_BUTTONS, KENDO_PROGRESSBARS, KENDO_INPUTS, KENDO_INDICATORS, FormsModule, DecimalPipe, CommonModule],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.scss'
})
export class SimuladorComponent implements OnInit {
 
  CalculoDp() {
    throw new Error('Method not implemented.');
  }

  public icons = { paperclip: paperclipIcon, infoSolidIcon: infoSolidIcon, imageIcon: imageIcon ,accessibilityIcon: accessibilityIcon,dollarIcon:dollarIcon, buildingsOutlineIcon:buildingsOutlineIcon };
  listItems: any[] = [];
  fecha: Date = new Date()
  Pon1!:number | null;
  Pon2!:number | null;
  Pon3!:number | null;
  Pon4!:number | null;
  Pon5!:number | null;
  Pon6!:number | null;
  Pon7!:number | null;
  public CalProm!: number;
  currentUser: User | null = null;

  // listItems = [
  //   { id: 'QA4567', nombre: 'nombre dummy 1', descripcion: 'El Programa consiste en un proceso de formación socioeducativo que va dirigido a la población guanajuatense de 15 años en adelante, con la finalidad de incrementar su desarrollo personal y sus capacidades para visualizarse como un actor de transformación social, mediante un modelo en el que la persona se coloca al centro de su desarrollo, fortaleciendo sus capacidades, habilidades y actitudes, desarrollando la autogestión, integración y compromiso social, reconociendo y respetando la equidad, viviendo en valores en la familia y comunidad, ampliando su visión para mejorar sus oportunidades, y transformando su entorno en comunidad. El programa está estructurado en 4 módulos integrados por un total de 25 sesiones: Módulo 1, Descubriendo quién soy; Módulo 2, Viviendo en comunidad; Módulo 3, Constructores del cambio hacia la felicidad; y Módulo 4, Organizándonos para el nuevo comienzo. Una vez que concluye el proceso de formación, se realizan acciones comunitarias que involucran la participación de las personas que conformaron los grupos, a partir de la detección de problemáticas en su entorno, con el fin de buscar soluciones que beneficien a todas y todos los miembros de la comunidad, contribuyendo a la construcción de una sociedad más justa y equitativa. Para acceder a los servicios del Programa, las personas interesadas deberán presentar su solicitud en el formato establecido. La unidad responsable de la Secretaría conformará los grupos con las personas interesadas, informándoles la programación para el desarrollo de los módulos. Las personas beneficiarias deberán acudir a las sesiones programadas, registrar su asistencia en cada sesión, y cumplir con los entregables de cada módulo, debiendo cumplir con una asistencia mínima del 75% de las sesiones para recibir un reconocimiento de participación.', precio: 1200 },
  //   { id: 'QX4567', nombre: 'nombre dummy 2', descripcion: 'Descripcion 2', precio: 25 },
  //   { id: 'QS3456', nombre: 'nombre dummy 3', descripcion: 'Descripcion 3', precio: 80 }
  // ];
  itemSeleccionado: any = null;

  getColorByValue(value: number): string {
  if (value < 10) return '#d61b1b';
  if (value < 5) return '#F69006';
  if (value < 2) return '#FAFA02';
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

  public progressStyles: { [key: string]: string } = {
    color: "",
    background: ""
  };

  TotalRacionalidad!: number| null;
  TotalSocial!: number| null;
  TotalEconomico!: number| null;
  CalGlob!: number| null;
  public animation = true;
  valorSeleccionado: number | null = null;
  valorSeleccionado1: number | null = null;
  valorSeleccionado2: number | null = null;
  valorSeleccionado3: number | null = null;
  valorSeleccionado4: number | null = null;
  valorSeleccionado5: number | null = null;
  valorSeleccionado6: number | null = null;
  valorSeleccionado7: number | null = null;
  

  public OpDp4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alto", value: 0 },
    { text: "Alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Medio", value: 3 },
    { text: "Bajo", value: 4 },
  ];
    public OpRP1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alto", value: 0 },
    { text: "Alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Bajo", value: 3 },
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

     public OpIS1: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alto", value: 0 },
    { text: "Alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Bajo", value: 3 },
  ];
  getTemplateClass(value: number): string {
    if (value == 0) return 'template9';
    if (value == 1) return 'template8';
    if (value == 2) return 'template7';
    if (value == 3) return 'template6';
    if (value == 4) return 'template3';
    
    return 'template';
  }

  constructor(private authService: AuthService,private pocketBaseService: PocketbaseService) {


    console.log(this.valorSeleccionado1);
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:", this.currentUser)
    });
    this.MethodTotal();
    this.LoadProy();
    console.log(this.valorSeleccionado1);

  }

  LoadProy(){
    this.pocketBaseService.getCollectionProySim().then(
      (data) =>{
        this.listItems = data
        console.log("Lista de Proyectos:",data)
        
      },
      (error)=>{
        console.error('Error al cargar las tareas:', error);
      }
    )
  }
  onProyChange(item: any) {
    this.itemSeleccionado = item;
    this.valorSeleccionado1 = null 
    this.valorSeleccionado2 = null 
    this.valorSeleccionado3 = null 
    this.valorSeleccionado4 = null 
    this.valorSeleccionado5 = null 
    this.valorSeleccionado6 = null
    this.Pon1 = 0
    this.Pon2 = 0
    this.Pon3 = 0
    this.Pon4 = 0
    this.Pon5 = 0
    this.Pon6 = 0
    this.RespuestaRP1(this.Pon1)
    this.RespuestaRP2(this.Pon2)
  }
  public Respuesta1(value: any): void {
  
 if (value.value == 0) {
    this.Pon1 = 19;
    this.MethodTotal()
    }
    else if (value.value == 1) {
     this.Pon1 = 14.25;
     this.MethodTotal()
    }
    else if (value.value == 2) {
    this.Pon1 = 9.5;
    this.MethodTotal()
    }
    else if (value.value == 3) {
    this.Pon1 = 4.75;
    this.MethodTotal()
    }

     else if (value.value == null) {
    this.Pon1 = 0;
    this.MethodTotal()
    }
} 
public Respuesta2(value: any): void {
  
 if (value.value == 0) {
    this.Pon1 = 19;
    this.MethodTotal()
    }
    else if (value.value == 1) {
     this.Pon1 = 14.25;
     this.MethodTotal()
    }
    else if (value.value == 2) {
    this.Pon1 = 9.5;
    this.MethodTotal()
    }
    else if (value.value == 3) {
    this.Pon1 = 4.75;
    this.MethodTotal()
    }

     else if (value.value == null) {
    this.Pon1 = 0;
    this.MethodTotal()
    }
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
  public MethodTotal(): any {
    const pon1 = this.Pon1 ?? 0
    const pon2 = this.Pon2 ?? 0
    const pon3 = this.Pon3 ?? 0
    const pon4 = this.Pon4 ?? 0
    const pon5 = this.Pon5 ?? 0
    const pon6 = this.Pon6 ?? 0
    this.TotalRacionalidad = pon1  + pon2  + pon3 + pon4 + pon5 + pon6
    console.log("calificacion racionalidad",this.TotalRacionalidad)
    this.TotalSocial = 0
    this.TotalEconomico =0
    this.CalGlob = (this.TotalRacionalidad ?? 0) + (this.TotalSocial ?? 0) + (this.TotalEconomico ?? 0);
    this.CalProm = this.CalGlob / 2;
    const ranges = [
      { max: 50, color: '#f50707' },
      { max: 70, color: '#ee9f05' },
      { max: 80, color: '#368541' },
      { max: 90, color: '#2e7d32' }
    ];

    // this.TotalRacionalidad = this.Pon1  
    const range = ranges.find(r => this.TotalRacionalidad! <= r.max);
    this.updateAppearance(range?.color ?? '#000');
  }

  private updateAppearance(
    background: string
  ): void {
    this.progressStyles['background'] = background

  }


}
