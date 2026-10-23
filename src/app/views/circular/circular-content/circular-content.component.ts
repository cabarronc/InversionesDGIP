import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
 import { firstValueFrom } from 'rxjs';

import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { ApiService } from '../../../services/api.service';
import { fileWordIcon, imageIcon, menuIcon, SVGIcon, copyIcon, fileExcelIcon, downloadIcon, aggregateFieldsIcon, chartDoughnutIcon } from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_FLOATINGLABEL } from "@progress/kendo-angular-label";
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { KENDO_DATEINPUTS } from "@progress/kendo-angular-dateinputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs"
import { IntlModule } from "@progress/kendo-angular-intl";
import { LabelModule } from "@progress/kendo-angular-label";
import { FormFieldModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { IconsModule } from "@progress/kendo-angular-icons";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { KENDO_GRID, ExcelModule, GridDataResult, DataStateChangeEvent, ColumnMenuSettings } from "@progress/kendo-angular-grid";
import {
  KENDO_NOTIFICATION,
  NotificationService,
} from "@progress/kendo-angular-notification";
import { KENDO_PROGRESSBARS } from '@progress/kendo-angular-progressbar';
import { FileService } from '../../../services/file.service';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComparacionArchivosService } from '../../../services/comparacion-archivos.service';
import { ComparacionArchivosComponent } from '../../uploads/comparacion-archivos/comparacion-archivos.component';
import { ResultsComponent } from "../../results/results.component";
import { ResultsSustitucionesComponent } from "../../results-sustituciones/results-sustituciones.component";
import { ResultsSustitucionesKeyComponent } from "../../results-sustituciones-key/results-sustituciones-key.component";
import { JsonPipe } from '@angular/common';



import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { PickListModule } from 'primeng/picklist';
import { MessageService } from 'primeng/api';
import { Table, TableModule, TableEditCompleteEvent } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-circular-content',
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, ButtonsModule, DateInputsModule, IntlModule, LabelModule, FormFieldModule, IconsModule,
    KENDO_FLOATINGLABEL, KENDO_LABEL, KENDO_INPUTS, ReactiveFormsModule, KENDO_DATEINPUTS, KENDO_NOTIFICATION, LayoutModule, KENDO_PROGRESSBARS,ToastModule,
    WindowModule, FormsModule, KENDO_GRID, KENDO_DROPDOWNS, ComparacionArchivosComponent, ResultsComponent, ResultsSustitucionesComponent, ResultsSustitucionesKeyComponent,
    InputTextModule,
    ButtonModule,
    DatePickerModule, TableModule,SelectModule,PanelModule,IconFieldModule,InputIconModule,
    ProgressBarModule, TagModule, MessageModule,PickListModule,
    ProgressSpinnerModule, DividerModule, CardModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './circular-content.component.html',
  styleUrl: './circular-content.component.scss'
})
export class CircularContentComponent implements OnInit {
  dashUrl: SafeResourceUrl;
  progress = 0;
  progress_puntosAtencion = 0;
  progress_graficos = 0;
  data2: any;
  copiado_respuesta: any
  copiado_respuesta_evidencia: any
  integracion_respuesta: any
  cumplimiento_respuesta: any
  vencidas_respuesta: any
  puntosAtencion: any
  graficosrespuesta: any;
  fecha_sap:string = '';

  programacionrespuesta: any;
  fecha: Date = new Date()
  public data = {
    numero_circular: "",
    fecha: this.fecha
  };
  public dependencias:any[] =[]
  public dependenciasExcluir: string[] = [];
  public reverse = true
  public isDisabled = false;
  public isCoping = false;
  public isGenerarCumplimiento = false;
  public isProgramacion = false;
  public isSeguimiento = false;
  public isSAP = false;
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public copyIcon: SVGIcon = copyIcon
  public fileExcelIcon: SVGIcon = fileExcelIcon
  public downloadIcon: SVGIcon = downloadIcon
  public aggregateFieldsIcon: SVGIcon = aggregateFieldsIcon
  public chartDoughnutIcon: SVGIcon = chartDoughnutIcon
  public form: FormGroup;
  interval: any;
  @Input() selectedItem: string | undefined;
  isIntegracion: boolean = false;
  public isGenerarVencidas: boolean = false;
  public isPuntos: boolean = false;
  public isGraficos: boolean = false;
  public nombre_archivo_circular: string = ''
  public filesSEDSeguimiento: any[] = [];
  public filesSEDProgramacion: any[] = [];
  public filesSAP: any[] = [];
  public menuSettings: ColumnMenuSettings = {
    lock: true,
    stick: true,
    setColumnPosition: { expanded: true },
    autoSizeColumn: true,
    autoSizeAllColumns: true,
  };
  comparisonResult: any = null;
  isComparing = false;
  currentYear = new Date().getFullYear();
  numeroCircularTouched = false;

  constructor(private apiService: ApiService, private fileService: FileService, private sanitizer: DomSanitizer
    , private comparacionArchivos: ComparacionArchivosService,private messageService: MessageService
  ) {
    this.form = new FormGroup({
      numero_circular: new FormControl(this.data.numero_circular, [Validators.required, Validators.pattern(/^\d{3}\/\d{4}$/)]),
      fecha: new FormControl(this.data.fecha, [Validators.required,]),
    });
    this.dashUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrlDash);
  }
  get numeroCircularValido(): boolean {
    return /^\d{3}$/.test(this.nombre_archivo_circular ?? '');
  }
  customKeyColumn: string = '';
  public allowCustom = true;
  listaAniosProgramacion: string[] = [];
  programacion: string = '';
  listaAnioSeguimiento: string[] = [];
  seguimiento: string = '';
  listaAnioSAP: string[] = [];
  sap: string = '';


  ngOnInit(): void {
    this.GetFilesSEDSeguimiento()
    this.GetFilesSEDProgramacion()
    this.GetFilesSAP()

  const anioActual = new Date().getFullYear();

  this.listaAniosProgramacion = Array.from(
    { length: 5 },
    (_, i) => String(anioActual - 3 + i)
  );

  this.programacion = String(anioActual);

  this.listaAnioSeguimiento = Array.from(
    { length: 5 },
    (_, i) => String(anioActual - 3 + i)
  );

  this.seguimiento = String(anioActual);

   this.listaAnioSAP = Array.from(
    { length: 5 },
    (_, i) => String(anioActual - 3 + i)
  );

  this.sap = String(anioActual);
  }

  GetFilesSEDProgramacion() {
    this.fileService.getFilesReportesSEDProgramacion().subscribe(
      (data) => {
        this.filesSEDProgramacion = data;
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }
  GetFilesSEDSeguimiento() {
    this.fileService.getFilesReportesSEDSeguimiento().subscribe(
      (data) => {
        this.filesSEDSeguimiento = data;
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }
  GetFilesSAP() {
    this.fileService.getFilesReportesSAP().subscribe(
      (data) => {
        this.filesSAP = data.files;
        this.fecha_sap = data.fecha;
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }
  //DESCARGAR ARCHIVOS PROGRAMACION
  downloadFilesSEDPROGRAMACION(filename: string): void {
    this.fileService.downloadFileSEDProgramacion(filename).subscribe(
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
  //DESCARGAR ARCHIVOS SEGUIMIENTO
  downloadFilesSEDSEGUIMIENTO(filename: string): void {
    this.fileService.downloadFileSEDSeguimiento(filename).subscribe(
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
  //DESCARGAR ARCHIVOS SAP
  downloadFilesSAP(filename: string): void {
    this.fileService.downloadFileSap(filename).subscribe(
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


  
  // public GenerarCicular(): void {
  //   if (this.form.invalid) {
  //     console.log("Formulario inválido: llena todos los campos requeridos.");
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Formulario inválido: llena todos los campos requeridos.',
  //       life: 3500
  //     });
  //     return;  // Sale de la función si el formulario no es válido
  //   }

  //   this.isDisabled = true;
  //   this.data.numero_circular = this.form.value.numero_circular;
  //   this.data.fecha = this.form.value.fecha;
  //   this.messageService.add({
  //       severity: 'info',
  //       summary: 'Info',
  //       detail: 'Espere, tardara algunos minutos',
  //       life: 3500
  //     });
    
  //   //console.log("data",this.data)
  //   let data = JSON.stringify(this.data);
  //   console.log(data)
  //   this.progress = 1;
  //   // Inicia un intervalo para actualizar el progreso gradualmente
  //   this.interval = setInterval(() => {
  //     if (this.progress < 99) {
  //       this.progress += 1; // Aumenta gradualmente el valor de la barra
  //     }
  //   }, 1500); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
  //   this.apiService.getData(data).pipe(
  //     finalize(() => {
  //       // Al finalizar la llamada, fija el progreso en 100
  //       this.progress = 100;
  //       this.isDisabled = false;
  //       setTimeout(() => {
  //         this.progress = 0;
  //       }, 3000); // Cambia 2000 a 4000 si quieres 4 segundos
  //     })
  //   ).
  //     subscribe(
  //       (response) => {
  //         console.log(response)
  //         this.dependencias = response.dependencia
  //         console.log(this.dependencias)
  //         this.data2 = response.success;
  //         this.isDisabled = false;
  //         if (response != true) {
  //               this.messageService.add({
  //                 severity: 'warn',
  //                 summary: 'Advertencia',
  //                 detail: 'Se ha producido un error',
  //                 life: 3500
  //               });

  //         }
  //         else {
  //             this.messageService.add({
  //                 severity: 'success',
  //                 summary: 'Exito!',
  //                 detail: 'La Circular se Generro con Exito',
  //                 life: 3500
  //               });
  //         }
  //         console.log('Datos obtenidos:', this.data2.success);
  //         clearInterval(this.interval);
  //         this.progress = 0 // Detén el intervalo una vez que la llamada ha finalizado

  //       },
  //       (error) => {
  //         this.isDisabled = false;
  //         clearInterval(this.interval); // Detén el intervalo si hay error
  //         this.messageService.add({
  //                 severity: 'error',
  //                 summary: 'Error',
  //                 detail: 'Se ha producido un error en tiempo de ejecucion',
  //                 life: 3500
  //               });
  //         console.error('Error al obtener datos:', error);
  //       }
  //     );
  // }


public async GenerarCicular(): Promise<void> {
  if (this.form.invalid) {
    console.log('Formulario inválido: llena todos los campos requeridos.');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Formulario inválido: llena todos los campos requeridos.',
      life: 3500
    });
    return; // Sale de la función si el formulario no es válido
  }

  this.isDisabled = true;
  this.data.numero_circular = this.form.value.numero_circular;
  this.data.fecha = this.form.value.fecha;

  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'circular',
    severity: 'info',
    summary: 'Por favor espere',
     detail: 'Generando Circular',
    sticky: true,
     icon: 'pi pi-spinner-dotted pi-spin',
  });

  const data = JSON.stringify(this.data);
  console.log(data);

  this.progress = 1;
  // Inicia un intervalo para actualizar el progreso gradualmente
  this.interval = setInterval(() => {
    if (this.progress < 99) {
      this.progress += 1;
    }
  }, 1500);

  try {
    const response = await firstValueFrom(this.apiService.getData(data));
    console.log(response);
    this.dependencias = response.dependencia;
    console.log(this.dependencias);
    this.data2 = response.success;

    this.messageService.clear('circular');

    if (response != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Se ha producido un error',
        life: 5500
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito!',
        detail: 'La Circular se Genero con Exito',
        life: 5500
      });
    }
    console.log('Datos obtenidos:', this.data2.success);

  } catch (error) {
    this.messageService.clear('circular');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Se ha producido un error en tiempo de ejecucion',
      life: 5500
    });
    console.error('Error al obtener datos:', error);

  } finally {
    // Equivale al finalize() de antes: corre tanto en éxito como en error
    clearInterval(this.interval);
    this.progress = 100;
    this.isDisabled = false;
    setTimeout(() => {
      this.progress = 0;
    }, 5000);
  }
}


  public clearForm(): void {
    this.form.reset();
  }

  public CopiarCircular(): void {
    this.isCoping = true
    this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Espere. copiando',
                  life: 3500
                });

      const datos = {
        excluir: this.dependenciasExcluir
    };
    console.log(datos)
    this.apiService.CircularCopy(datos).subscribe(
      (response) => {
        this.copiado_respuesta = response;
        this.isCoping = false;
        this.messageService.add({
                  severity: 'success',
                  summary: 'Exito',
                  detail: 'Copiado Correcto',
                  life: 3500
                });

        console.log('Datos obtenidos:', this.copiado_respuesta);

      },
      (error) => {
        this.isCoping = false;
        clearInterval(this.interval); // Detén el intervalo si hay error
        
        this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Se ha producido un error en tiempo de ejecucion',
                  life: 3500
                });
        console.error('Error al obtener datos:', error);
      }
    );
  }

  public CopiarCircularAcuses(): void {
    this.isCoping = true
    this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Espere. copiando',
                  life: 3500
                });

    this.apiService.CircularCopyEvidencia().subscribe(
      (response) => {
        this.copiado_respuesta_evidencia = response;
        this.isCoping = false;
               this.messageService.add({
                  severity: 'success',
                  summary: 'Exito',
                  detail: 'Copiado Correcto',
                  life: 3500
                });
        console.log('Datos obtenidos:', this.copiado_respuesta_evidencia);

      },
      (error) => {
        this.isCoping = false;
        clearInterval(this.interval); // Detén el intervalo si hay error
      this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Se ha producido un error en tiempo de ejecucion',
                  life: 3500
                });
        console.error('Error al obtener datos:', error);
      }
    );
  }



public async PuntosAtencion(): Promise<void> {
  this.isPuntos = true;

  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'puntos',
    severity: 'info',
   summary: 'Por favor espere',
    detail: 'Generando Puntos de Atencion',
    sticky: true,
     icon: 'pi pi-spinner-dotted pi-spin',
  });

  this.progress_puntosAtencion = 1;
  // Inicia un intervalo para actualizar el progreso gradualmente
  this.interval = setInterval(() => {
    if (this.progress_puntosAtencion < 99) {
      this.progress_puntosAtencion += 1;
    }
  }, 1080);

  try {
    this.puntosAtencion = await firstValueFrom(this.apiService.PuntosAtencion());
    this.isPuntos = false; // antes del toast

    this.messageService.clear('puntos');

    if (this.puntosAtencion != true) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un Error',
        life: 3500
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Se ha Generado Puntos de Atencion, listo...',
        life: 3500
      });
    }
    console.log('Datos obtenidos:', this.puntosAtencion);

  } catch (error) {
    this.isPuntos = false; // antes del toast

    this.messageService.clear('puntos');
    this.messageService.add({
      severity: 'error', // antes 'danger', que no es una severity válida
      summary: 'Error',
      detail: 'Hubo un Error',
      life: 3500
    });
    console.error('Error al obtener datos:', error);

  } finally {
    // Equivale al finalize() de antes: corre tanto en éxito como en error
    clearInterval(this.interval);
    this.progress_puntosAtencion = 100;
    this.isDisabled = false;
    setTimeout(() => {
      this.progress_puntosAtencion = 0;
    }, 6000);
  }
}
  //------------------------------------------GRAFCIOS-----------------------------


public async Graficos(): Promise<void> {
  this.isGraficos = true;
  this.isDisabled = true
  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'graficos',
    severity: 'info',
    summary: 'Por favor espere',
    detail: 'Generando Graficos',
    sticky: true,
     icon: 'pi pi-spinner-dotted pi-spin',
  });

  this.progress_graficos = 1;
  // Inicia un intervalo para actualizar el progreso gradualmente
  this.interval = setInterval(() => {
    if (this.progress_graficos < 99) {
      this.progress_graficos += 1;
    }
  }, 3900);

  try {
    this.graficosrespuesta = await firstValueFrom(this.apiService.Graficos());
    this.isGraficos = false; // antes del toast
    this.isDisabled = false

    this.messageService.clear('graficos');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se ha Generado Graficos, listo...',
      life: 3500
    });
    console.log('Datos obtenidos:', this.graficosrespuesta);

  } catch (error) {
   

    this.messageService.clear('graficos');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un Error',
      life: 3500
    });
    console.error('Error al obtener datos:', error);

  } finally {
    // Equivale al finalize() de antes: corre tanto en éxito como en error
    clearInterval(this.interval);
    this.progress_graficos = 100;
     this.isGraficos = false; // antes del toast
    this.isDisabled = false;
    setTimeout(() => {
      this.progress_graficos = 0;
    }, 6000);
  }
}
  //#############################SEGUIMIENTO ACTIVIDADES #########################################
  public CumplimientoMetas(): void {
    this.isGenerarCumplimiento = true
     this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Espere, se esta enviando peticion',
        life: 3500
      });
    this.apiService.Cumplimiento().subscribe(
      (response) => {
        this.cumplimiento_respuesta = response;
        this.isGenerarCumplimiento = false;
       this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Se ha Generado actividades, listo...',
                life: 3500
              });
      },
      (error) => {
        this.isGenerarCumplimiento = false;
       this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un Error',
                life: 3500
              });
               console.error('Error al obtener datos:', error);
      }
    )
  }

  public ActividadesVencidas(): void {
    this.isGenerarVencidas = true
    this.apiService.Vencidas().subscribe(
      (response) => {
        this.vencidas_respuesta = response;
        this.isGenerarVencidas = false;
       this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Se ha Generado Actividades Vencidas, listo...',
                life: 3500
              });
      },
      (error) => {
        this.isGenerarVencidas = false
       this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un Error',
                life: 3500
              });

      }
    )

  }
  //-----------------Exceles
  //----------------Programacion
public async Programacion(): Promise<void> {
  this.isProgramacion = true;

  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'programacion',
    severity: 'info',
    summary: 'Por favor espere',
    detail: `Generando SED Programacion ${this.programacion}` ,
    sticky: true,
     icon: 'pi pi-spinner-dotted pi-spin',
  });

  console.log('ejercicio', this.programacion);

  try {
    const response = await firstValueFrom(this.apiService.ExcelSEDProgramacion(this.programacion));
    this.isProgramacion = false; // antes del toast

    this.messageService.clear('programacion');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Se ha generado... SED Programacion ${this.programacion}`,
      life: 5500,
    });
    console.log('Datos obtenidos:', response);
    this.GetFilesSEDProgramacion();

  } catch (error) {
    this.isProgramacion = false; // antes del toast
    clearInterval(this.interval); // Detén el intervalo si hay error

    this.messageService.clear('programacion');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un error',
      life: 5500
    });
    console.error('Error al obtener datos:', error);
  }
}
  //Seguimiento


public async Seguimiento(): Promise<void> {
  this.isSeguimiento = true;

  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'seguimiento',
    severity: 'info',
    summary: 'Por favor espere',
    detail: `Generando SED Seguimiento ${this.seguimiento}` ,
    sticky: true,
     icon: 'pi pi-spinner-dotted pi-spin',
  });

  console.log('ejercicio', this.seguimiento);

  try {
    const response = await firstValueFrom(this.apiService.ExcelSEDSeguimiento(this.seguimiento));
    this.isSeguimiento = false; // antes del toast

    this.messageService.clear('seguimiento');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Se ha Generado, Seguimiento ${this.seguimiento}`,
      life: 5500
    });
    console.log('Datos obtenidos:', response);
    this.GetFilesSEDSeguimiento();

  } catch (error) {
    this.isSeguimiento = false; // antes del toast
    clearInterval(this.interval); // Detén el intervalo si hay error

    this.messageService.clear('seguimiento');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un error',
      life: 5500
    });
    console.error('Error al obtener datos:', error);
  }
}

public async SAP(): Promise<void> {
  this.isSAP = true;

  // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
  this.messageService.add({
    key: 'sap',
    severity: 'info',
    summary: 'Por favor espere',
    detail: `Generando SAP ${this.sap}` ,
    sticky: true, 
    icon: 'pi pi-spinner-dotted pi-spin',
  });

  console.log('ejercicio', this.sap);

  try {
    // El Observable se convierte en Promise
    const response = await firstValueFrom(this.apiService.ExcelSAP(this.sap));
 this.isSAP = false;

    this.messageService.clear('sap');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se ha Generado, listo...',
      life: 5500
    });
    console.log('Datos obtenidos:', response);
    this.GetFilesSAP();
   
  } catch (error) {
    this.isSAP = false;
    clearInterval(this.interval); // Detén el intervalo si hay error
    this.isSAP = false;
    this.messageService.clear('sap');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un error',
      life: 5500
    });
    console.error('Error al obtener datos:', error);

  }
}


  public Integracion(): void {
    this.isIntegracion = true;
    console.log(this.nombre_archivo_circular)
    let data = JSON.stringify(this.nombre_archivo_circular);
    this.apiService.Integracion(data).subscribe(
      (response) => {
        this.integracion_respuesta = response;
        this.isIntegracion = false;
         this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Se ha Generado, listo...',
                life: 3500
              });
        console.log('Datos obtenidos:', this.integracion_respuesta);
      },
      (error) => {
        this.isIntegracion = false;
        this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error',
                life: 3500
              });
        console.error('Error al obtener datos:', error);
      }
    );

  }
  // Servicio de comparacion de archivos
  onFilesUploaded(uploadResult: any) {
    console.log('Archivos subidos:', uploadResult);
  }


  onStructureChanged(hasChanges: boolean) {
    console.log('Hubo cambios estructurales:', hasChanges);
  }
  onStructureChangedAdd(hasChanges: boolean) {
    console.log('Hubo cambios en filas agregadas:', hasChanges);
  }



  onComparisonRequested(comparisonData: any) {
    this.isComparing = true;

    let compareMethod;

    switch (comparisonData.analysisType) {
      case 'detailed':
        compareMethod = this.comparacionArchivos.compareFilesDetailed(
          comparisonData.file1Id, comparisonData.file2Id
        );
        break;
      case 'substitutions':
        compareMethod = this.comparacionArchivos.compareFilesSubstitutions(
          comparisonData.file1Id, comparisonData.file2Id
        );
        break;
      case 'substitutions_by_key':
        compareMethod = this.comparacionArchivos.compareFilesSubstitutions_by_id(
          comparisonData.file1Id, comparisonData.file2Id, [this.customKeyColumn]
        );
        break;
      default:
        compareMethod = this.comparacionArchivos.compareFiles(
          comparisonData.file1Id, comparisonData.file2Id
        );
    }

    compareMethod.subscribe({
      next: (result) => {
        this.comparisonResult = result;
        console.log('ROW CHANGES modified raw:', this.comparisonResult?.row_changes?.modified);
        console.log('Keys:', Object.keys(this.comparisonResult?.row_changes?.modified || {}));
        console.log(this.comparisonResult)
        this.isComparing = false;
      },
      error: (error) => {
        console.error('Error en la comparación:', error);
        this.isComparing = false;
      }
    });
  }
}
