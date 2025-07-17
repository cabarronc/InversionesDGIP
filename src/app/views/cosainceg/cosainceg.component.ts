import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ColumnMenuSettings, KENDO_GRID } from '@progress/kendo-angular-grid';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { KENDO_PDFVIEWER } from '@progress/kendo-angular-pdfviewer';
import { FileService } from '../../services/file.service';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';

import {
  clipboardIcon,
  clipboardTextIcon,
  clipboardCodeIcon,
  clipboardMarkdownIcon,
  SVGIcon,
  fileWordIcon,
  fileExcelIcon,
} from '@progress/kendo-svg-icons';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { CosaincegService } from '../../services/cosainceg.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cosainceg',
  standalone: true,
  imports: [NavBarComponent,KENDO_LAYOUT,CommonModule,KENDO_BUTTONS,KENDO_GRID,WindowModule,KENDO_PDFVIEWER,KENDO_ICONS,KENDO_INDICATORS],
  templateUrl: './cosainceg.component.html',
  styleUrl: './cosainceg.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class CosaincegComponent implements OnInit {
  public isDisabled = false;
  public clipboardSVG: SVGIcon = clipboardIcon;
  public fileWordIcon: SVGIcon = fileWordIcon;
  public fileExcelIcon: SVGIcon = fileExcelIcon;
public FilesCosainceg: any[] = [];
public cosainceg: any;
  public menuSettings: ColumnMenuSettings = {
    lock: true,
    stick: true,
    setColumnPosition: { expanded: true },
    autoSizeColumn: true,
    autoSizeAllColumns: true,
  };
  selectedPdf: string | null = null; 
  nombre_archivo:string | null = null;

  ngOnInit(): void {
    this.GetFiles();
  }
 public data = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileWordIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
        this.cosaincegService.GenerarCosainceg(primerTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
    },
    (error) => {
      this.notificationService.show({
        content: "Existe un Error en la Generacion del Reporte!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      console.error('Error fetching files', error);
    }
  );
      },
    },
    {
      text: 'Segundo Trimestre',
      svgIcon: clipboardCodeIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        console.log("Segundo Trimestre: ",segundoTrimestre)
        this.cosaincegService.GenerarCosainceg(segundoTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
       this.cosainceg = data;
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
    },
    (error) => {
      console.error('Error fetching files', error);
      this.notificationService.show({
        content: "Existe un Error en la Generacion del Reporte!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
    }
  );
      },
    },
    {
      text: 'Tercer Trimestre',
      svgIcon: clipboardMarkdownIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        this.cosaincegService.GenerarCosainceg(tercerTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
       this.cosainceg = data;
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
    },
    (error) => {
      this.notificationService.show({
        content: "Existe un Error en la Generacion del Reporte!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      console.error('Error fetching files', error);
    }
  );
      },
    },
    {
      text: 'Cuarto Trimestre',
      svgIcon: clipboardMarkdownIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio_menosuno}-01-10`;
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
        this.cosaincegService.GenerarCosainceg(cuarttoTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      console.log(this.cosainceg)
    },
    (error) => {
      console.error('Error fetching files', error);
      this.notificationService.show({
        content: "Existe un Error en la Generacion del Reporte!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
    }
  );
      },
    },
  ];

 constructor(private fileService: FileService, private cosaincegService : CosaincegService, private notificationService: NotificationService) {
 
  
 }
    openPdfModal(pdfBase64: string, name :string) {
    this.selectedPdf = pdfBase64;
    this.nombre_archivo = name;
  }
    closePdfModal() {
    this.selectedPdf = null;
  }
DescargarExcel() {

}
  GetFiles(){
 forkJoin([
    this.fileService.getFilesConsainceg1T(),
    this.fileService.getFilesConsainceg2T(),
    this.fileService.getFilesConsainceg3T(),
    this.fileService.getFilesConsainceg4T()
  ]).subscribe(
    ([files1, files2, files3, files4]) => {
      // Unir ambos arreglos
      this.FilesCosainceg = [...files1, ...files2,...files3,...files4];
    },
    (error) => {
      console.error('Error fetching files', error);
    }
  );
  }

  //DESCARGAR ARCHIVOS
  downloadFile(filename: string): void {
    this.fileService.downloadFileCosainceg1t(filename).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
       this.notificationService.show({
        content: "Reporte Descargado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      },
      (error) => {
        console.error('Error downloading file', error);
       this.notificationService.show({
        content: "Error en la Descarga!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "error", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      }
    );
  }
  public GenerarPorFechaActual(): void {
    const today = new Date(); // Ej: 2025-07-14
    const formattedDate = today.toISOString().split('T')[0]; // "2025-07-14"
    console.log(formattedDate)
    this.cosaincegService.GenerarCosainceg(formattedDate).subscribe(
    (data) => {
      this.cosainceg = data;
      console.log(this.cosainceg)
      this.GetFiles()
    },
    (error) => {
      console.error('Error fetching files', error);
    }
  );
  }
  GenerarRepo2PorFechaActual():void{
    
  }
}
