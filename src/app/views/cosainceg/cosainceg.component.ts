import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ColumnMenuSettings, KENDO_GRID } from '@progress/kendo-angular-grid';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { KENDO_PDFVIEWER } from '@progress/kendo-angular-pdfviewer';
import { FileService } from '../../services/file.service';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { UploadsComponent } from "../uploads/uploads.component";

import {
  clipboardIcon,
  clipboardTextIcon,
  clipboardCodeIcon,
  clipboardMarkdownIcon,
  SVGIcon,
  fileWordIcon,
  fileExcelIcon,
  fileReportIcon,
  downloadIcon
} from '@progress/kendo-svg-icons';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { CosaincegService } from '../../services/cosainceg.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { catchError, concat, forkJoin, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cosainceg',
  standalone: true,
  imports: [KENDO_LAYOUT,CommonModule,KENDO_BUTTONS,KENDO_GRID,WindowModule,KENDO_PDFVIEWER,KENDO_ICONS,KENDO_INDICATORS,KENDO_DIALOGS,UploadsComponent],
  templateUrl: './cosainceg.component.html',
  styleUrl: './cosainceg.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class CosaincegComponent implements OnInit {
    @Input() selectedItem: string | undefined;
  public isDisabled = false;
  public isDisabledG =false;
  public isDisabledExcelG = false;
  public isDisabledD =false;
  public isDisabledExcelD = false;
  public isDisabledR =false;
  public isDisabledExcelR = false;
  public isDisabledExcelRecurso = false;
  public isDisabledCatalogoR = false;
  public isDisabledActualizacionRubros =false;
  
  public clipboardSVG: SVGIcon = clipboardIcon;
  public fileWordIcon: SVGIcon = fileWordIcon;
  public fileExcelIcon: SVGIcon = fileExcelIcon;
   public fileReportIcon: SVGIcon = fileReportIcon;
   public downloadIcon:SVGIcon = downloadIcon;


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

canViewCosainceg = false;
  canViewDeuda = false;

  ngOnInit(): void {
    this.GetFiles();
       // Inicializamos las variables según los permisos del usuario
    this.canViewCosainceg = this.authService.hasPermission('cosainceg', 'manage');
    this.canViewDeuda = this.authService.hasPermission('deuda', 'manage');
    console.log(this.canViewCosainceg)
    console.log(this.canViewDeuda)
  }
  // Reportes Cosainceg
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
         this.isDisabledG =true;
        this.cosaincegService.GenerarCosainceg(primerTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
      this.GetFiles()
      console.log("primer trimestre",this.cosainceg)
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledG = false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        console.log("Segundo Trimestre: ",segundoTrimestre)
        this.isDisabled = true;
         this.isDisabledG =true;
        this.cosaincegService.GenerarCosainceg(segundoTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
       this.cosainceg = data;
       this.GetFiles()
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledG = false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        this.isDisabled = true;
         this.isDisabledG =true;
        this.cosaincegService.GenerarCosainceg(tercerTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
      this.GetFiles()
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledG = false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio_menosuno}-01-10`;
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
          this.isDisabled = true;
         this.isDisabledG =true;
        this.cosaincegService.GenerarCosainceg(cuarttoTrimestre).subscribe(
    (data) => {
      this.cosainceg = data;
      this.GetFiles()
       this.notificationService.show({
        content: "Reporte Generado Correctamente!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      console.log(this.cosainceg)
        this.isDisabled = false;
        this.isDisabledG = false;
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

  /////excel///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelG = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        const filename  = `Cosainceg01Global_${anio}.xlsx`
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(primerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
       this.notificationService.show({
        content: "Excel Generado Correctamente, espero que se descargue!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
      this.isDisabledExcelG = false
     
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        const filename  = `Cosainceg02Global_${anio}.xlsx`
        console.log("Segundo Trimestre: ",segundoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(segundoTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelG = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        const filename  = `Cosainceg03Global_${anio}.xlsx`
         this.isDisabled = true;
         this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(tercerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelG = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        const Year = new Date(today);
        Year.setFullYear(today.getFullYear());
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio = Year.getFullYear().toString();
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio}-01-10`;
        const filename  = `Cosainceg04Global_${anio}.xlsx`
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(cuarttoTrimestre,filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelG = false
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

public dataExcelDep = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        const filename  = `Cosainceg01Dependencias_${anio}.xlsx`
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(primerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
       this.notificationService.show({
        content: "Excel Generado Correctamente, espero que se descargue!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
      this.isDisabledExcelD = false
     
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        const filename  = `Cosainceg02Dependencias_${anio}.xlsx`
        console.log("Segundo Trimestre: ",segundoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(segundoTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelD = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        const filename  = `Cosainceg03Dependencias_${anio}.xlsx`
         this.isDisabled = true;
         this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(tercerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelD = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        const Year = new Date(today);
        Year.setFullYear(today.getFullYear());
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio = Year.getFullYear().toString();
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio}-01-10`;
        const filename  = `Cosainceg04Dependencias_${anio}.xlsx`
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(cuarttoTrimestre,filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelD = false
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
  /////////////////////////////////////// 
  public dataExcelRub = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        const filename  = `Cosainceg01Rubros_${anio}.xlsx`
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(primerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
       this.notificationService.show({
        content: "Excel Generado Correctamente, espero que se descargue!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
      this.isDisabledExcelR = false
     
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        const filename  = `Cosainceg02Rubros_${anio}.xlsx`
        console.log("Segundo Trimestre: ",segundoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(segundoTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelR = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        const filename  = `Cosainceg03Rubros_${anio}.xlsx`
         this.isDisabled = true;
         this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(tercerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelR = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        const Year = new Date(today);
        Year.setFullYear(today.getFullYear());
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio = Year.getFullYear().toString();
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio}-01-10`;
        const filename  = `Cosainceg04Rubros_${anio}.xlsx`
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(cuarttoTrimestre,filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelR = false
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
////////////////////////////////////////////////////////////////
////////////////////// Recurso Consainceg //////////////////////////
public dataExcelRecurso = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        const filename  = `Rel recurso COSAINCEG01`
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(primerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const downloadFilename = filename.endsWith('.zip') ? filename : `${filename}.zip`;
        link.href = url;
        link.download = downloadFilename;
        document.body.appendChild(link);
        link.click();

        // Limpieza
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

       this.notificationService.show({
        content: "Excel Generado Correctamente, espero que se descargue!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
      this.isDisabledExcelRecurso = false
     
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        const filename  = `Rel recurso COSAINCEG02`
        console.log("Segundo Trimestre: ",segundoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(segundoTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        const filename  = `Rel recurso COSAINCEG03`
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(tercerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        const Year = new Date(today);
        Year.setFullYear(today.getFullYear());
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio = Year.getFullYear().toString();
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio}-01-10`;
        const filename  = `Rel recurso COSAINCEG04`
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(cuarttoTrimestre,filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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

  ////////////////////////////////////////////////////////////////
////////////////////// Recurso Deuda //////////////////////////
public dataExcelRecursoDeuda = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
         const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const primerTrimestre =`${anio}-04-10`;
        const filename  = `Rel Obras Financiamiento Deuda01`
        console.log("Primer Trimestre: ",primerTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(primerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const downloadFilename = filename.endsWith('.zip') ? filename : `${filename}.zip`;
        link.href = url;
        link.download = downloadFilename;
        document.body.appendChild(link);
        link.click();

        // Limpieza
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

       this.notificationService.show({
        content: "Excel Generado Correctamente, espero que se descargue!",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      this.isDisabled = false;
      this.isDisabledExcelRecurso = false
     
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        const filename  = `Rel Obras Financiamiento Deuda02`
        console.log("Segundo Trimestre: ",segundoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(segundoTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        const filename  = `Rel Obras Financiamiento Deuda03`
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(tercerTrimestre,filename).subscribe(
    (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        const Year = new Date(today);
        Year.setFullYear(today.getFullYear());
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio = Year.getFullYear().toString();
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio}-01-10`;
        const filename  = `Rel Obras Financiamiento Deuda04`
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
         this.isDisabled = true;
         this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(cuarttoTrimestre,filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledExcelRecurso = false
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
/////////////////////////////////////////////////////
public ActualizacionRubro = [
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
         this.isDisabledActualizacionRubros =true;
        this.cosaincegService.ActualizarRubros(primerTrimestre).subscribe(
    (data) => {
      console.log(data)
       this.notificationService.show({
        content: data.success.mensaje,
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledActualizacionRubros =false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const segundoTrimestre =`${anio}-07-10`;
        console.log("Segundo Trimestre: ",segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros =true;
        this.cosaincegService.ActualizarRubros(segundoTrimestre).subscribe(
    (data) => {
       this.notificationService.show({
        content: data.success.mensaje,
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledActualizacionRubros =false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString(); 
        const tercerTrimestre =`${anio}-10-10`;
        console.log("Tercer Trimestre: ",tercerTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros =true;
        this.cosaincegService.ActualizarRubros(tercerTrimestre).subscribe(
    (data) => {
       this.notificationService.show({
        content: data.success.mensaje,
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
        this.isDisabled = false;
        this.isDisabledActualizacionRubros =false;
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
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear() - 1);
        const anio_menosuno = lastYearDate.getFullYear().toString(); 
        const cuarttoTrimestre =`${anio_menosuno}-01-10`;
        console.log("cuartoTrimestre: ",cuarttoTrimestre)
          this.isDisabled = true;
        this.isDisabledActualizacionRubros =true;
        this.cosaincegService.ActualizarRubros(cuarttoTrimestre).subscribe(
    (data) => {
       this.notificationService.show({
        content:data.success.mensaje,
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "success", icon: true },
        position: { horizontal: "left", vertical: "top" },
      });
      console.log(this.cosainceg)
        this.isDisabled = false;
        this.isDisabledActualizacionRubros =false;
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


 constructor(private fileService: FileService, private cosaincegService : CosaincegService, 
  private notificationService: NotificationService, private authService: AuthService, private router: Router) {
 
  
 }


    openPdfModal(pdfBase64: string, name :string) {
    this.selectedPdf = pdfBase64;
    this.nombre_archivo = name;
  }
    closePdfModal() {
    this.selectedPdf = null;
  }
DescargarExcel() {
   this.notificationService.show({
        content: "Debe Seleccionar un Trimestre",
        hideAfter: 1500,
        animation: { type: "slide", duration: 900 },
        type: { style: "info", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });

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
    this.fileService.downloadFileCosainceg(filename).subscribe(
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
public DescargaCatalogoRubros(){
  console.log("aqui se descargara")
  const filename = "CatalogoRubros"
  this.isDisabledCatalogoR = true
        this.cosaincegService.GetCatalogoRubros(filename).subscribe(
  (blob) => {
       const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.isDisabled = false;
        this.isDisabledCatalogoR = false
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
}
 goBack(): void {
    this.router.navigate(['/principal']);
  }


}
