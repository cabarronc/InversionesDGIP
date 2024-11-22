import { Component, Input,ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { ApiService } from '../../../services/api.service';
import { fileWordIcon, imageIcon ,menuIcon, SVGIcon, copyIcon,fileExcelIcon,chartDoughnutIcon} from '@progress/kendo-svg-icons';
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
import {
  KENDO_NOTIFICATION,
  NotificationService,
} from "@progress/kendo-angular-notification";
import { KENDO_PROGRESSBARS } from '@progress/kendo-angular-progressbar';
@Component({
  selector: 'app-circular-content',
  standalone: true,
  imports: [NavBarComponent,KENDO_BUTTONS, KENDO_INDICATORS,ButtonsModule,DateInputsModule,IntlModule,LabelModule,FormFieldModule,IconsModule,
    KENDO_FLOATINGLABEL,KENDO_LABEL,KENDO_INPUTS,ReactiveFormsModule,KENDO_DATEINPUTS,KENDO_NOTIFICATION,LayoutModule,KENDO_PROGRESSBARS],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './circular-content.component.html',
  styleUrl: './circular-content.component.scss'
})
export class CircularContentComponent {
  progress = 0;
  progress_puntosAtencion = 0;
  progress_graficos = 0;
  data2:any;
  copiado_respuesta:any
  integracion_respuesta:any
  cumplimiento_respuesta:any
  vencidas_respuesta:any
  puntosAtencion:any
  graficosrespuesta:any
  fecha: Date = new Date()
  public data = {
    numero_circular: "",
    fecha: this.fecha
  };
  public reverse =true
  public isDisabled = false;
  public isCoping = false;
  public isGenerarCumplimiento = false;
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public fileExcelIcon: SVGIcon=fileExcelIcon
  public chartDoughnutIcon:SVGIcon=chartDoughnutIcon
  public form: FormGroup;
  interval: any;
  @Input() selectedItem: string | undefined;
  isIntegracion: boolean = false;
  public isGenerarVencidas: boolean = false;
  public isPuntos: boolean = false;
  public isGraficos:boolean = false;
  
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
    console.log(data)
    this.progress = 1;
     // Inicia un intervalo para actualizar el progreso gradualmente
     this.interval = setInterval(() => {
      if (this.progress < 99) {
        this.progress += 1; // Aumenta gradualmente el valor de la barra
      }
    }, 3200); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
    this.apiService.getData(data).pipe(
      finalize(() => {
        // Al finalizar la llamada, fija el progreso en 100
        this.progress = 100;
        this.isDisabled = false;
        setTimeout(() => {
          this.progress = 0;
        }, 3000); // Cambia 2000 a 4000 si quieres 4 segundos
      })
    ).
    subscribe(
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
          clearInterval(this.interval);
            this.progress = 0 // Detén el intervalo una vez que la llamada ha finalizado

        },
        (error) => {
          this.isDisabled = false;
          clearInterval(this.interval); // Detén el intervalo si hay error
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
        console.log('Datos obtenidos:', this.copiado_respuesta);
        
      },
      (error) => {
        this.isCoping = false;
         clearInterval(this.interval); // Detén el intervalo si hay error
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
  public PuntosAtencion():void
  {
    this.isPuntos = true
    this.notificationService.show({
      content: "Espere, Generando...",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    this.progress_puntosAtencion = 1;
    // Inicia un intervalo para actualizar el progreso gradualmente
    this.interval = setInterval(() => {
     if (this.progress_puntosAtencion < 99) {
       this.progress_puntosAtencion += 1; // Aumenta gradualmente el valor de la barra
     }
   }, 1080); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
    this.apiService.PuntosAtencion().pipe(
      finalize(() => {
        // Al finalizar la llamada, fija el progreso en 100
        this.progress_puntosAtencion = 100;
        this.isDisabled = false;
        setTimeout(() => {
          this.progress_puntosAtencion = 0;
        }, 6000); // Cambia 2000 a 4000 si quieres 4 segundos
      })
    ).subscribe(
      (response) => {
        this.puntosAtencion = response;
        this.isPuntos = false;
        this.notificationService.show({
          content: "Generacion Correcta!!",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', this.puntosAtencion);
        clearInterval(this.interval);
        this.progress_puntosAtencion = 0 // Detén el intervalo una vez que la llamada ha finalizado
      },
      (error) => {
        this.isPuntos = false
        this.progress_puntosAtencion = 0 // Detén el intervalo una vez que la llamada ha finalizado
        clearInterval(this.interval); // Detén el intervalo si hay error
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
//------------------------------------------GRAFCIOS-----------------------------
  public Graficos():void
  {
    this.isGraficos = true
    this.notificationService.show({
      content: "Espere, Generando...",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    this.progress_graficos = 1;
    // Inicia un intervalo para actualizar el progreso gradualmente
    this.interval = setInterval(() => {
     if (this.progress_graficos < 99) {
       this.progress_graficos += 1; // Aumenta gradualmente el valor de la barra
     }
   }, 300); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
    this.apiService.Graficos().pipe(
      finalize(() => {
        // Al finalizar la llamada, fija el progreso en 100
        this.progress_graficos = 100;
        this.isDisabled = false;
        setTimeout(() => {
          this.progress_graficos = 0;
        }, 6000); // Cambia 2000 a 4000 si quieres 4 segundos
      })
    ).subscribe(
      (response) => {
        this.graficosrespuesta = response;
        this.isGraficos = false;
        this.notificationService.show({
          content: "Generacion Correcta!!",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', this.graficosrespuesta);
        clearInterval(this.interval);
        this.progress_graficos = 0 // Detén el intervalo una vez que la llamada ha finalizado
      },
      (error) => {
        this.isGraficos = false;
        this.progress_graficos = 0 // Detén el intervalo una vez que la llamada ha finalizado
        clearInterval(this.interval); // Detén el intervalo si hay error
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

  public CumplimientoMetas():void{
    this.isGenerarCumplimiento = true
    this.notificationService.show({
      content: "Esto Puede tomar unos minutos",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    this. apiService.Cumplimiento().subscribe(
      (response) =>{
        this.cumplimiento_respuesta = response;
        this.isGenerarCumplimiento = false;
        this.notificationService.show({
          content: "Generacion Correcta",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
      },
      (error)=>{
        this.isGenerarCumplimiento = false;
        this.notificationService.show({
          content: "Existe un error",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "error", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });

      }
    )
  }

  public ActividadesVencidas():void{
    this.isGenerarVencidas = true
    this. apiService.Vencidas().subscribe(
      (response) =>{
        this.vencidas_respuesta = response;
        this.isGenerarVencidas = false;
        this.notificationService.show({
          content: "Generacion Correcta",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
      },
      (error)=>{
        this.isGenerarVencidas = false
        this.notificationService.show({
          content: "Existe un error",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "error", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });

      }
    )

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
