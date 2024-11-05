import { Component, Input,ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { ApiService } from '../../../services/api.service';
import { fileWordIcon, imageIcon ,menuIcon, SVGIcon, copyIcon} from '@progress/kendo-svg-icons';
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
import {
  KENDO_NOTIFICATION,
  NotificationService,
} from "@progress/kendo-angular-notification";

@Component({
  selector: 'app-circular-content',
  standalone: true,
  imports: [NavBarComponent,KENDO_BUTTONS, KENDO_INDICATORS,ButtonsModule,DateInputsModule,IntlModule,LabelModule,FormFieldModule,IconsModule,
    KENDO_FLOATINGLABEL,KENDO_LABEL,KENDO_INPUTS,ReactiveFormsModule,KENDO_DATEINPUTS,KENDO_NOTIFICATION],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './circular-content.component.html',
  styleUrl: './circular-content.component.scss'
})
export class CircularContentComponent {
  data2:any;
  copiado_respuesta:any
  integracion_respuesta:any
  fecha: Date = new Date()
  public data = {
    numero_circular: "",
    fecha: this.fecha
  };
  public isDisabled = false;
  public isCoping = false
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public form: FormGroup;
  @Input() selectedItem: string | undefined;
  isIntegracion: boolean = false;
  
  constructor(private apiService: ApiService,private notificationService: NotificationService) {
    this.form = new FormGroup({
      numero_circular: new FormControl(this.data.numero_circular, [Validators.required]),
      fecha: new FormControl(this.data.fecha, [Validators.required,]),
    });    
  }

  public GenerarCicular(): void {
    if (this.form.invalid) {
      console.log("Formulario inválido: llena todos los campos requeridos.");
      this.notificationService.show({
        content: "Formulario inválido: llena todos los campos requeridos.",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
      return;  // Sale de la función si el formulario no es válido
    }

    this.isDisabled = true;
    this.data.numero_circular = this.form.value.numero_circular;
    this.data.fecha = this.form.value.fecha;
    this.notificationService.show({
      content: "Espere, tardara algunos minutos",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    //console.log("data",this.data)
    let data = JSON.stringify(this.data);
    this.apiService.getData(data).subscribe(
        (response) => {
          this.data2 = response;
          this.isDisabled = false;
          this.notificationService.show({
            content: "Genereación Correcta",
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
          console.log('Datos obtenidos:', this.data2);
        },
        (error) => {
          this.notificationService.show({
            content: "Existe un error",
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "error", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
          console.error('Error al obtener datos:', error);
        }
      );
  }
  public clearForm(): void {
    this.form.reset();
  }

  public CopiarCircular():void
  {
    this.isCoping =true
    this.notificationService.show({
      content: "Espere. copiando",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    this.apiService.CircularCopy().subscribe(
      (response) => {
        this.copiado_respuesta = response;
        this.isCoping = false;
        this.notificationService.show({
          content: "Copiado Correcto",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', this.data2);
      },
      (error) => {
        this.notificationService.show({
          content: "Existe un error",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "error", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.error('Error al obtener datos:', error);
      }
    );
  }
  public Integracion():void{
    this.isIntegracion = true;
    this.apiService.Integracion().subscribe(
      (response) => {
        this.integracion_respuesta = response;
        this.isIntegracion = false;
        this.notificationService.show({
          content: "Integracion Correcta",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', this.data2);
      },
      (error) => {
        this.isIntegracion = false;
        this.notificationService.show({
          content: "Existe un error",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "error", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.error('Error al obtener datos:', error);
      }
    );

  }
}
