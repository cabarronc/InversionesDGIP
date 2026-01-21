import { Component, OnInit} from '@angular/core';
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
import { paperclipIcon,infoSolidIcon, imageIcon} from "@progress/kendo-svg-icons";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DecimalPipe } from '@angular/common';



@Component({
  selector: 'app-simulador',
  standalone: true,
   imports: [ KENDO_ICONS,TooltipModule,ReactiveFormsModule,KENDO_DROPDOWNS,KENDO_SLIDER, KENDO_GAUGES,KENDO_LABELS, KENDO_LAYOUT,KENDO_BUTTONS,KENDO_PROGRESSBARS,KENDO_INPUTS,KENDO_INDICATORS,FormsModule,DecimalPipe],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.scss'
})
export class SimuladorComponent implements OnInit {
CalculoDp() {
throw new Error('Method not implemented.');
}

public icons = { paperclip: paperclipIcon, infoSolidIcon:infoSolidIcon, imageIcon:imageIcon };
 fecha: Date = new Date()
 resultado = 1245300.75;
 public CalProm!: number;
 currentUser: User | null = null;
 proyecto:string= "QA0205";
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
   public areaList: Array<string> = [
    "Boston",
    "Chicago",
    "Houston",
    "Los Angeles",
    "Miami",
    "New York",
    "Philadelphia",
    "San Francisco",
    "Seattle",
  ];
  TotalDp: number = 90;
  TotalMir: number = 80;
  CalGlob!: number;
  public animation = true;
valorSeleccionado: number | null = null;
  public OpDp4: Array<{ text: string; value: number | null }> = [
    { text: "Bajo", value: 4},
    { text: "Medio bajo", value: 3 },
    { text: "Medio", value: 2 },
    { text: "Alto", value: 1 },
    { text: "Muy alto", value: 0 },
    { text: "Selecciona", value: null },
  ]; 

  constructor(private authService: AuthService) {
    
    
    console.log(this.valorSeleccionado);
  }
  ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:",this.currentUser)
    });
    this.MethodTotalDp();
    console.log(this.valorSeleccionado);
    
    }

    public MethodTotalDp(): any {
    this.CalGlob = this.TotalDp + this.TotalMir;
    this.CalProm = this.CalGlob / 2;
    switch (this.TotalDp) {
      case 50: this.updateAppearance("#f50707");
        break;
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 58:
      case 59:
      case 60:
      case 61:
      case 70: this.updateAppearance("#ee9f05");
        break;
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 79:
      case 80: this.updateAppearance("#1C4822");
        break;
      case 81:
      case 82:
      case 83:
      case 84:
      case 85:
      case 86:
      case 87:
      case 88:
      case 89:
      case 90:
      default:


    }

  }
private updateAppearance(
    background: string
  ): void {
    this.progressStyles['background'] = background

  }

 
}
