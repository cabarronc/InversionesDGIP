import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { ApiService } from '../../../services/api.service';
import { fileWordIcon, imageIcon, menuIcon, SVGIcon, copyIcon, fileExcelIcon,downloadIcon , aggregateFieldsIcon, chartDoughnutIcon } from '@progress/kendo-svg-icons';
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

@Component({
  selector: 'app-circular-content',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, ButtonsModule, DateInputsModule, IntlModule, LabelModule, FormFieldModule, IconsModule,
    KENDO_FLOATINGLABEL, KENDO_LABEL, KENDO_INPUTS, ReactiveFormsModule, KENDO_DATEINPUTS, KENDO_NOTIFICATION, LayoutModule, KENDO_PROGRESSBARS,
    WindowModule, FormsModule, KENDO_GRID, KENDO_DROPDOWNS, ComparacionArchivosComponent, ResultsComponent, ResultsSustitucionesComponent],
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
  integracion_respuesta: any
  cumplimiento_respuesta: any
  vencidas_respuesta: any
  puntosAtencion: any
  graficosrespuesta: any;
  
  programacionrespuesta: any;
  fecha: Date = new Date()
  public data = {
    numero_circular: "",
    fecha: this.fecha
  };
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

  constructor(private apiService: ApiService, private notificationService: NotificationService, private fileService: FileService, private sanitizer: DomSanitizer
    , private comparacionArchivos:ComparacionArchivosService
  ) {
    this.form = new FormGroup({
      numero_circular: new FormControl(this.data.numero_circular, [Validators.required]),
      fecha: new FormControl(this.data.fecha, [Validators.required,]),
    });
     this.dashUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrlDash);
  }
  public allowCustom = true;
  public selectedValues1: string = "2025";
  public selectedValues2: string = "2025";
  public selectedValues3: string = "2025";
  public listItems: Array<string> = [
    "2025",
    "2024",
    "2023",
  ];
    public listItems2: Array<string> = [
    "2025",
    "2024",
    "2023",
  ];
    public listItems3: Array<string> = [
    "2025",
    "2024",
    "2023",
  ];
  ngOnInit(): void {
    this.GetFilesSEDSeguimiento()
    this.GetFilesSEDProgramacion()
    this.GetFilesSAP()
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
        this.filesSAP = data;
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
    }, 1500); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
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
          if (response != true) {
            this.notificationService.show({
              content: this.data2.success,
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
          else {
            this.notificationService.show({
              content: "La Circular se Generro con Exito",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
          console.log('Datos obtenidos:', this.data2.success);
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

  public CopiarCircular(): void {
    this.isCoping = true
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
  public PuntosAtencion(): void {
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
        if (response != true) {
          this.notificationService.show({
            content: this.puntosAtencion.respuesta,
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "warning", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
        }
        else {
          this.notificationService.show({
            content: "Generacion Correcta!!",
            hideAfter: 1500,
            animation: { type: "slide", duration: 900 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });

        }
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
  public Graficos(): void {
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
    }, 3900); // Se actualiza cada 100 ms (puedes ajustar el tiempo según sea necesario)
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

  public CumplimientoMetas(): void {
    this.isGenerarCumplimiento = true
    this.notificationService.show({
      content: "Esto Puede tomar unos minutos",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    this.apiService.Cumplimiento().subscribe(
      (response) => {
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
      (error) => {
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

  public ActividadesVencidas(): void {
    this.isGenerarVencidas = true
    this.apiService.Vencidas().subscribe(
      (response) => {
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
      (error) => {
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
  //-----------------Exceles
  //Programacion
  public Programacion(): void {
    this.isProgramacion = true
    this.notificationService.show({
      content: "Espere, Generando.....",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    console.log("ejercicio",this.selectedValues1)
    this.apiService.ExcelSEDProgramacion(this.selectedValues1).subscribe(
      (response) => {
        this.isProgramacion = false;
        this.notificationService.show({
          content: "Se Genero su Reporte SED Programacion",
          hideAfter: 2500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', response);
        this.GetFilesSEDProgramacion()

      },
      (error) => {
        this.isProgramacion = false;
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
  //Seguimiento
  public Seguimiento(): void {
    this.isSeguimiento = true
    this.notificationService.show({
      content: "Espere, Generando....",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
    console.log("ejercicio",this.selectedValues2)
    this.apiService.ExcelSEDSeguimiento(this.selectedValues2).subscribe(
      (response) => {
        this.isSeguimiento = false;
        this.notificationService.show({
          content: "Se Genero su Reporte SED Seguimiento",
          hideAfter: 2500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', response);
        this.GetFilesSEDSeguimiento()

      },
      (error) => {
        this.isSeguimiento = false;
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
  public SAP(): void {
    this.isSAP = true
    this.notificationService.show({
      content: "Espere, Generando....",
      hideAfter: 1500,
      animation: { type: "slide", duration: 900 },
      type: { style: "info", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });
console.log("ejercicio",this.selectedValues3)
    this.apiService.ExcelSAP(this.selectedValues3).subscribe(
      (response) => {
        this.isSAP = false;
        this.notificationService.show({
          content: "Se Genero su Reporte SAP",
          hideAfter: 1500,
          animation: { type: "slide", duration: 900 },
          type: { style: "success", icon: true },
          position: { horizontal: "center", vertical: "top" },
        });
        console.log('Datos obtenidos:', response);
        this.GetFilesSAP()

      },
      (error) => {
        this.isSAP = false;
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


  public Integracion(): void {
    this.isIntegracion = true;
    console.log(this.nombre_archivo_circular)
    let data = JSON.stringify(this.nombre_archivo_circular);
    this.apiService.Integracion(data).subscribe(
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
        console.log('Datos obtenidos:', this.integracion_respuesta);
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
// Servicio de comparacion de archivos
onFilesUploaded(uploadResult: any) {
    console.log('Archivos subidos:', uploadResult);
  }

// onComparisonRequested(comparisonData: any) {
//     this.isComparing = true;
//     this.comparacionArchivos.compareFiles(
//       comparisonData.file1Id, 
//       comparisonData.file2Id
//     ).subscribe({
//       next: (result) => {
//         this.comparisonResult = result;
//         this.isComparing = false;
//       },
//       error: (error) => {
//         console.error('Error en la comparación:', error);
//         this.isComparing = false;
//         // Aquí podrías mostrar un mensaje de error al usuario
//       }
//     });
//   }
onStructureChanged(hasChanges:boolean){
 console.log('Hubo cambios estructurales:', hasChanges);
}
onStructureChangedAdd(hasChanges:boolean){
   console.log('Hubo cambios en filas agregadas:', hasChanges);
}
// onComparisonRequested(comparisonData: any) {
//     this.isComparing = true;
    
//     const compareMethod = comparisonData.detailedAnalysis 
//       ? this.comparacionArchivos.compareFilesDetailed(comparisonData.file1Id, comparisonData.file2Id)
//       : this.comparacionArchivos.compareFiles(comparisonData.file1Id, comparisonData.file2Id);
    
//     compareMethod.subscribe({
//       next: (result) => {
//         this.comparisonResult = result;
//         console.log(this.comparisonResult)
//         this.isComparing = false;
        
//       },
//       error: (error) => {
//         console.error('Error en la comparación:', error);
//         this.isComparing = false;
//         // Aquí podrías mostrar un mensaje de error al usuario
//       }
//     });
//   }
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
    default:
      compareMethod = this.comparacionArchivos.compareFiles(
        comparisonData.file1Id, comparisonData.file2Id
      );
  }
  
  compareMethod.subscribe({
    next: (result) => {
      this.comparisonResult = result;
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
