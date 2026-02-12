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
import { paperclipIcon, infoSolidIcon, imageIcon } from "@progress/kendo-svg-icons";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DecimalPipe } from '@angular/common';



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

  public icons = { paperclip: paperclipIcon, infoSolidIcon: infoSolidIcon, imageIcon: imageIcon };
  fecha: Date = new Date()
  resultado = 1245300.75;
  public CalProm!: number;
  currentUser: User | null = null;

  proyecto: string = "QA0205";
  proyecto_nombre: string = "Este es un proyecto de prueba llamado dummy";
  listItems = [
    { id: 'QA4567', nombre: 'nombre dummy 1', descripcion: 'El Programa consiste en un proceso de formación socioeducativo que va dirigido a la población guanajuatense de 15 años en adelante, con la finalidad de incrementar su desarrollo personal y sus capacidades para visualizarse como un actor de transformación social, mediante un modelo en el que la persona se coloca al centro de su desarrollo, fortaleciendo sus capacidades, habilidades y actitudes, desarrollando la autogestión, integración y compromiso social, reconociendo y respetando la equidad, viviendo en valores en la familia y comunidad, ampliando su visión para mejorar sus oportunidades, y transformando su entorno en comunidad. El programa está estructurado en 4 módulos integrados por un total de 25 sesiones: Módulo 1, Descubriendo quién soy; Módulo 2, Viviendo en comunidad; Módulo 3, Constructores del cambio hacia la felicidad; y Módulo 4, Organizándonos para el nuevo comienzo. Una vez que concluye el proceso de formación, se realizan acciones comunitarias que involucran la participación de las personas que conformaron los grupos, a partir de la detección de problemáticas en su entorno, con el fin de buscar soluciones que beneficien a todas y todos los miembros de la comunidad, contribuyendo a la construcción de una sociedad más justa y equitativa. Para acceder a los servicios del Programa, las personas interesadas deberán presentar su solicitud en el formato establecido. La unidad responsable de la Secretaría conformará los grupos con las personas interesadas, informándoles la programación para el desarrollo de los módulos. Las personas beneficiarias deberán acudir a las sesiones programadas, registrar su asistencia en cada sesión, y cumplir con los entregables de cada módulo, debiendo cumplir con una asistencia mínima del 75% de las sesiones para recibir un reconocimiento de participación.', precio: 1200 },
    { id: 'QX4567', nombre: 'nombre dummy 2', descripcion: 'Descripcion 2', precio: 25 },
    { id: 'QS3456', nombre: 'nombre dummy 3', descripcion: 'Descripcion 3', precio: 80 }
  ];
  itemSeleccionado: any = null;
  public colors = [
    {
      to: 25,
      color: "#8396B8",
    },
    {
      from: 25,
      to: 50,
      color: "#F69006",
    },
    {
      from: 50,
      to: 75,
      color: "#FAFA02",
    },
    {
      from: 75,
      color: "#02FA27",
    },
  ];
  public progressStyles: { [key: string]: string } = {
    color: "",
    background: ""
  };

  TotalDp!: number;
  TotalMir!: number;
  CalGlob!: number;
  public animation = true;
  valorSeleccionado: number | null = null;

  public OpDp4: Array<{ text: string; value: number | null }> = [
    { text: "Selecciona", value: null },
    { text: "Muy alto", value: 0 },
    { text: "Alto", value: 1 },
    { text: "Medio", value: 2 },
    { text: "Medio bajo", value: 3 },
    { text: "Bajo", value: 4 },
  ];
  getTemplateClass(value: number): string {
    if (value == 0) return 'template9';
    if (value == 1) return 'template8';
    if (value == 2) return 'template7';
    if (value == 3) return 'template6';
    if (value == 4) return 'template3';
    
    return 'template';
  }

  constructor(private authService: AuthService) {


    console.log(this.valorSeleccionado);
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:", this.currentUser)
    });
    this.MethodTotalDp();
    console.log(this.valorSeleccionado);

  }

  onProductoChange(item: any) {
    this.itemSeleccionado = item;
  }



  public MethodTotalDp(): any {
    this.CalGlob = this.TotalDp + this.TotalMir;
    this.CalProm = this.CalGlob / 2;
    // switch (this.TotalDp) {
    //   case 50: this.updateAppearance("#f50707");
    //     break;
    //   case 51:
    //   case 52:
    //   case 53:
    //   case 54:
    //   case 55:
    //   case 56:
    //   case 57:
    //   case 58:
    //   case 59:
    //   case 60:
    //   case 61:
    //   case 70: this.updateAppearance("#ee9f05");
    //     break;
    //   case 71:
    //   case 72:
    //   case 73:
    //   case 74:
    //   case 75:
    //   case 76:
    //   case 77:
    //   case 78:
    //   case 79:
    //   case 80: this.updateAppearance("#368541");
    //     break;
    //   case 81:
    //   case 82:
    //   case 83:
    //   case 84:
    //   case 85:
    //   case 86:
    //   case 87:
    //   case 88:
    //   case 89:
    //   case 90:
    //   default:


    // }
    const ranges = [
      { max: 50, color: '#f50707' },
      { max: 70, color: '#ee9f05' },
      { max: 80, color: '#368541' },
      { max: 90, color: '#2e7d32' }
    ];

    const range = ranges.find(r => this.TotalDp <= r.max);
    this.updateAppearance(range?.color ?? '#000');
  }

  private updateAppearance(
    background: string
  ): void {
    this.progressStyles['background'] = background

  }


}
