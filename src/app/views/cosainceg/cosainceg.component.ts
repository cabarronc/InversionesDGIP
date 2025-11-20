import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ColumnMenuSettings, KENDO_GRID } from '@progress/kendo-angular-grid';
import { WindowModule, WindowThemeColor } from '@progress/kendo-angular-dialog';
import { KENDO_PDFVIEWER } from '@progress/kendo-angular-pdfviewer';
import { FileService } from '../../services/file.service';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { UploadsComponent } from "../uploads/uploads.component";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { FormsModule } from '@angular/forms';


import {
  clipboardIcon,
  clipboardTextIcon,
  clipboardCodeIcon,
  clipboardMarkdownIcon,
  SVGIcon,
  fileWordIcon,
  fileExcelIcon,
  fileReportIcon,
  downloadIcon,
  fileZipIcon,
  gaugeRadialIcon,
  filePdfIcon,
  copyIcon
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
  imports: [KENDO_LAYOUT, CommonModule, KENDO_BUTTONS, KENDO_GRID, WindowModule, KENDO_PDFVIEWER, KENDO_ICONS, KENDO_INDICATORS, KENDO_DIALOGS
    , UploadsComponent, KENDO_INPUTS, KENDO_LABELS, FormsModule],
  templateUrl: './cosainceg.component.html',
  styleUrl: './cosainceg.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class CosaincegComponent implements OnInit {
  @Input() selectedItem: string | undefined;
  public isDisabled = false;
  public isDisabledG = false;
  public isDisabled_deuda = false;
  public isDisabledG_deuda = false;
  public isDisabledExcelG = false;
  public isDisabledExcelG_deuda = false;
  public isDisabledExcelG_deuda_dep = false
  public isDisabledD = false;
  public isDisabledExcelD = false;
  public isDisabledR = false;
  public isDisabledExcelR = false;
  public isDisabledExcelRecurso = false;
  public isDisabledExcelRecursoDeuda = false
  public isDisabledCatalogoR = false;
  public isDisabledActualizacionRubros = false;
  public checked = false
  public windowWidth = 600;

  public isMetas = false
  public isMetasD = false
  public clipboardSVG: SVGIcon = clipboardIcon;
  public fileWordIcon: SVGIcon = fileWordIcon;
  public fileExcelIcon: SVGIcon = fileExcelIcon;
  public fileReportIcon: SVGIcon = fileReportIcon;
  public downloadIcon: SVGIcon = downloadIcon;
  public fileZipIcon: SVGIcon = fileZipIcon
  public gaugeRadialIcon: SVGIcon = gaugeRadialIcon
  public filePdfIcon: SVGIcon = filePdfIcon
  public copyIcon: SVGIcon = copyIcon


  public FilesCosainceg: any[] = [];
  public FilesDeuda: any[] = [];
  public Metas: any[] = [];
  public Top: any[] = [];
  public cosainceg: any;
  public menuSettings: ColumnMenuSettings = {
    lock: true,
    stick: true,
    setColumnPosition: { expanded: true },
    autoSizeColumn: true,
    autoSizeAllColumns: true,
  };
  selectedPdf: string | null = null;
  nombre_archivo: string | null = null;

  selectedPdf_2: string | null = null;
  nombre_archivo_2: string | null = null;

  canViewCosainceg = false;
  canViewInversion = false;
  canViewDeuda = false;


  public opened = false;
  isInversionGeneral: boolean = false;
  isInversionGeneralD: boolean = false;
  generandoReporte: boolean = false;
  generandoReporteD: boolean = false;
  isCoping: boolean = false;
  copiado_respuesta: any
  interval: any;
  info: any;
  EjecutandoInversion: boolean =false;
  cascaron: boolean = false;

  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

  public windowThemeColor: WindowThemeColor = "primary";
  ngOnInit(): void {
    this.GetFiles();
    this.GetFilesDeuda();
    // Inicializamos las variables según los permisos del usuario
    this.canViewCosainceg = this.authService.hasPermission('cosainceg', 'manage');
    this.canViewInversion = this.authService.hasPermission('inversion', 'manage');
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
        const primerTrimestre = `${anio}-04-10`;
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledG = true;
        this.cosaincegService.GenerarCosainceg(primerTrimestre).subscribe(
          (data) => {
            this.cosainceg = data;
            this.GetFiles()
            console.log("primer trimestre", this.cosainceg)
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
        const segundoTrimestre = `${anio}-07-10`;
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledG = true;
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        this.isDisabled = true;
        this.isDisabledG = true;
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
        const cuarttoTrimestre = `${anio_menosuno}-02-10`;
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledG = true;
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
  ///////////////////////////// Deuda ///////////

  public dataDeuda = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileWordIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledG_deuda = true;
        this.cosaincegService.GenerarDeuda(primerTrimestre).subscribe(
          (data) => {
            this.cosainceg = data;
            this.GetFilesDeuda()
            console.log("primer trimestre", this.cosainceg)
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
        const segundoTrimestre = `${anio}-07-10`;
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledG_deuda = true;
        this.cosaincegService.GenerarDeuda(segundoTrimestre).subscribe(
          (data) => {
            this.cosainceg = data;
            this.cosainceg = data;
            this.GetFilesDeuda()
            this.notificationService.show({
              content: "Reporte Generado Correctamente!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isDisabled_deuda = false;
            this.isDisabledG_deuda = false;
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledG_deuda = true;
        this.cosaincegService.GenerarDeuda(tercerTrimestre).subscribe(
          (data) => {
            this.cosainceg = data;
            this.GetFilesDeuda()
            this.notificationService.show({
              content: "Reporte Generado Correctamente!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isDisabled_deuda = false;
            this.isDisabledG_deuda = false;
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
        const cuarttoTrimestre = `${anio_menosuno}-02-10`;
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledG_deuda = true;
        this.cosaincegService.GenerarDeuda(cuarttoTrimestre).subscribe(
          (data) => {
            this.cosainceg = data;
            this.GetFilesDeuda()
            this.notificationService.show({
              content: "Reporte Generado Correctamente!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            console.log(this.cosainceg)
            this.isDisabled_deuda = false;
            this.isDisabledG_deuda = false;
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
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Cosainceg01Global_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(primerTrimestre, filename).subscribe(
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Cosainceg02Global_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(segundoTrimestre, filename).subscribe(
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Cosainceg03Global_${anio}.xlsx`
        this.isDisabled = true;
        this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(tercerTrimestre, filename).subscribe(
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Cosainceg04Global_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelG = true
        this.cosaincegService.GenerarDescargasCosainceg(cuarttoTrimestre, filename).subscribe(
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
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Cosainceg01Dependencias_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(primerTrimestre, filename).subscribe(
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Cosainceg02Dependencias_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(segundoTrimestre, filename).subscribe(
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Cosainceg03Dependencias_${anio}.xlsx`
        this.isDisabled = true;
        this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(tercerTrimestre, filename).subscribe(
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Cosainceg04Dependencias_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelD = true
        this.cosaincegService.GenerarDescargasCosaincegDep(cuarttoTrimestre, filename).subscribe(
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
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Cosainceg01Rubros_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(primerTrimestre, filename).subscribe(
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Cosainceg02Rubros_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(segundoTrimestre, filename).subscribe(
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Cosainceg03Rubros_${anio}.xlsx`
        this.isDisabled = true;
        this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(tercerTrimestre, filename).subscribe(
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Cosainceg04Rubros_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelR = true
        this.cosaincegService.GenerarDescargasCosaincegRub(cuarttoTrimestre, filename).subscribe(
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
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Rel recurso COSAINCEG01`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(primerTrimestre, filename).subscribe(
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Rel recurso COSAINCEG02`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(segundoTrimestre, filename).subscribe(
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Rel recurso COSAINCEG03`
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(tercerTrimestre, filename).subscribe(
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Rel recurso COSAINCEG04`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasCosaincegRecurso(cuarttoTrimestre, filename).subscribe(
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
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Rel Obras Financiamiento Deuda01`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(primerTrimestre, filename).subscribe(
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Rel Obras Financiamiento Deuda02`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(segundoTrimestre, filename).subscribe(
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Rel Obras Financiamiento Deuda03`
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(tercerTrimestre, filename).subscribe(
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Rel Obras Financiamiento Deuda04`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledExcelRecurso = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(cuarttoTrimestre, filename).subscribe(
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

  ///// EXCEL DEUDA GLOBAL///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelDeudaG = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Deuda01Global_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda = true
        this.cosaincegService.GenerarDescargasDeuda(primerTrimestre, filename).subscribe(
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
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda = false

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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Deuda02Global_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda = true
        this.cosaincegService.GenerarDescargasDeuda(segundoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda = false
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Deuda03Global_${anio}.xlsx`
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda = true
        this.cosaincegService.GenerarDescargasDeuda(tercerTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda = false
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Deuda04Global_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda = true
        this.cosaincegService.GenerarDescargasDeuda(cuarttoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda = false
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
  ///////////////////////////  excel dependencias deuda  //////////////////////////
  public dataExcelDepDeuda = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Deuda01Dependencias_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda_dep = true
        this.cosaincegService.GenerarDescargasDeudaDep(primerTrimestre, filename).subscribe(
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
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda_dep = false

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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Deuda02Dependencias_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda_dep = true
        this.cosaincegService.GenerarDescargasDeudaDep(segundoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda_dep = false
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Deuda03Dependencias_${anio}.xlsx`
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda_dep = true
        this.cosaincegService.GenerarDescargasDeudaDep(tercerTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda_dep = false
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Deuda04Dependencias_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled_deuda = true;
        this.isDisabledExcelG_deuda_dep = true
        this.cosaincegService.GenerarDescargasDeudaDep(cuarttoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelG_deuda_dep = false
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
        const primerTrimestre = `${anio}-04-10`;
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros = true;
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
            this.isDisabledActualizacionRubros = false;
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
        const segundoTrimestre = `${anio}-07-10`;
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros = true;
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
            this.isDisabledActualizacionRubros = false;
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros = true;
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
            this.isDisabledActualizacionRubros = false;
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
        const cuarttoTrimestre = `${anio_menosuno}-02-10`;
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isDisabled = true;
        this.isDisabledActualizacionRubros = true;
        this.cosaincegService.ActualizarRubros(cuarttoTrimestre).subscribe(
          (data) => {
            this.notificationService.show({
              content: data.success.mensaje,
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            console.log(this.cosainceg)
            this.isDisabled = false;
            this.isDisabledActualizacionRubros = false;
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
  //////////////////////////////////////////////////////////////
  ///// EXCEL DEUDA METAS///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelDeudaMetas = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `DeudaMetas01_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.isMetas = true;
        this.isMetasD = true
        this.cosaincegService.GenerarDescargasDeudaMetas(primerTrimestre, filename).subscribe(
          (resp => {
            const byteCharacters = atob(resp.file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);

            // Descargar el archivo
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            this.Top = resp.json
            this.Metas = resp.metas
            // JSON adicional
            console.log(resp.metas);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isMetas = false;
            this.isMetasD = false

          }),
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `DeudaMetas02_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.isMetas = true;
        this.isMetasD = true
        this.cosaincegService.GenerarDescargasDeudaMetas(segundoTrimestre, filename).subscribe(
          (resp => {
            const byteCharacters = atob(resp.file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);

            // Descargar el archivo
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            this.Top = resp.json
            this.Metas = resp.metas
            // JSON adicional
            console.log(resp.json);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isMetas = false;
            this.isMetasD = false
          }),
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `DeudaMetas03_${anio}.xlsx`
        this.isMetas = true;
        this.isMetasD = true
        this.cosaincegService.GenerarDescargasDeudaMetas(tercerTrimestre, filename).subscribe(
          (resp => {
            const byteCharacters = atob(resp.file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);

            // Descargar el archivo
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            this.Top = resp.json
            this.Metas = resp.metas
            // JSON adicional
            console.log(resp.json);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isMetas = false;
            this.isMetasD = false
          }),
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `DeudaMetas04_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.isMetas = true;
        this.isMetasD = true
        this.cosaincegService.GenerarDescargasDeudaMetas(cuarttoTrimestre, filename).subscribe(
          (resp => {
            const byteCharacters = atob(resp.file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);

            // Descargar el archivo
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            this.Top = resp.json
            this.Metas = resp.metas
            // JSON adicional
            console.log(resp.json);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.isMetas = false;
            this.isMetasD = false
          }),
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

  hasProps(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }
  //////////////////////////////////////////////////////////////
  ///// Hoja de trabajo///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelInversionHojaTrabajo = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `inversion_1t_${anio}_(HT).xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.EjecutandoInversion = true;
        this.isInversionGeneralD = true
        this.cosaincegService.GenerarDescargasInversionHojaTrabajo(primerTrimestre, filename).subscribe(
          (resp => {
            // 1. Archivo (BLOB)
            const blob = resp.body!;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            // 2. JSON enviado en headers
            const xHeader = resp.headers.get('X-Data');  // 👈 el nombre del header
            const x = JSON.parse(xHeader!);
            this.info = x
            console.log("Objeto recibido:", x);
            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
             this.EjecutandoInversion = false;
            this.isInversionGeneralD = false

          }),
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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `inversion_2t_${anio}_(HT).xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
         this.EjecutandoInversion = true;
        this.isInversionGeneralD = true
        this.cosaincegService.GenerarDescargasInversionHojaTrabajo(segundoTrimestre, filename).subscribe(
          (resp => {
            // 1. Archivo (BLOB)
            const blob = resp.body!;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            // 2. JSON enviado en headers
            const xHeader = resp.headers.get('X-Data');  // 👈 el nombre del header
            const x = JSON.parse(xHeader!);
            this.info = x
            console.log("Objeto recibido:", x);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
             this.EjecutandoInversion = false;
            this.isInversionGeneralD = false

          }),
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `inversion_3t_${anio}_(HT).xlsx`
         this.EjecutandoInversion = true;
        this.isInversionGeneralD = true
        this.cosaincegService.GenerarDescargasInversionHojaTrabajo(tercerTrimestre, filename).subscribe(
          (resp => {
            // 1. Archivo (BLOB)
            const blob = resp.body!;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            // 2. JSON enviado en headers
            const xHeader = resp.headers.get('X-Data');  // 👈 el nombre del header
            const x = JSON.parse(xHeader!);
            this.info = x
            console.log("Objeto recibido:", x);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
             this.EjecutandoInversion = false;
            this.isInversionGeneralD = false
          }),
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `inversion_4t_${anio}_(HT).xlsx`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.EjecutandoInversion = true;
        this.isInversionGeneralD = true
        this.cosaincegService.GenerarDescargasInversionHojaTrabajo(cuarttoTrimestre, filename).subscribe(
          (resp => {
            // 1. Archivo (BLOB)
            const blob = resp.body!;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            // 2. JSON enviado en headers
            const xHeader = resp.headers.get('X-Data');  // 👈 el nombre del header
            const x = JSON.parse(xHeader!);
            console.log("Objeto recibido:", x);
            this.info = x
            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
             this.EjecutandoInversion = false;
            this.isInversionGeneralD = true
          }),
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

  ////////////////////// Inversion Productos //////////////////////////
  public dataExcelInversionentregables = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `Inversion_entregable_01_${anio}`
        console.log("Primer Trimestre: ", primerTrimestre)
         this.EjecutandoInversion = true;
        this.generandoReporteD = true
        this.cosaincegService.GenerarDescargasInversionEntregables(primerTrimestre, filename).subscribe(
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
            this.EjecutandoInversion = false;
            this.generandoReporteD = false

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
        const segundoTrimestre = `${anio}-07-10`;
        const filename = `Inversion_entregable_02_${anio}`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.EjecutandoInversion = true;
        this.generandoReporteD = true
        this.cosaincegService.GenerarDescargasInversionEntregables(segundoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            // Limpieza
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            this.EjecutandoInversion = false;
            this.generandoReporteD = false

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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        const filename = `Inversion_entregable_03_${anio}`
        this.EjecutandoInversion = true;
        this.generandoReporteD = true
        this.cosaincegService.GenerarDescargasInversionEntregables(tercerTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            // Limpieza
            // document.body.removeChild(link);
            // window.URL.revokeObjectURL(url);

            this.EjecutandoInversion = false;
            this.generandoReporteD = false
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
        const cuarttoTrimestre = `${anio}-02-10`;
        const filename = `Inversion_entregable_04_${anio}`
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.EjecutandoInversion = true;
        this.generandoReporteD = true
        this.cosaincegService.GenerarDescargasInversionEntregables(cuarttoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            // Limpieza
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            this.EjecutandoInversion = false;
            this.generandoReporteD = false
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
///Copias
  public dataExcelInversionesCopias = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        console.log("Primer Trimestre: ", primerTrimestre)
        this.EjecutandoInversion = true;
        this.isCoping = true
        this.cosaincegService.InversionCopy(primerTrimestre).subscribe(
          (resp) => {
            console.log(resp)

            this.notificationService.show({
              content: "Excel Copiado Correctamente, espere......!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
             this.isCoping = false

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
        const segundoTrimestre = `${anio}-07-10`;
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.EjecutandoInversion = true;
         this.isCoping = true
        this.cosaincegService.InversionCopy(segundoTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Excel Copiado Correctamente, espere......!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
             this.isCoping = false
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        this.EjecutandoInversion = true;
         this.isCoping = true
        this.cosaincegService.InversionCopy(tercerTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Excel Copiado Correctamente, espere......!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
             this.isCoping = false
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
        const cuarttoTrimestre = `${anio}-02-10`;
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.EjecutandoInversion = true;
         this.isCoping = true
        this.cosaincegService.InversionCopy(cuarttoTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Se Genero la estructura para el trimestre.....!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
             this.isCoping = false
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
///Crear Cascaron
  public dataCascaron = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        console.log("Primer Trimestre: ", primerTrimestre)
        this.EjecutandoInversion = true;
        this.cascaron =true
        this.cosaincegService.GetCascaron(primerTrimestre).subscribe(
          (resp) => {
            console.log(resp)

            this.notificationService.show({
              content: "Se Genero la estructura para el trimestre.....!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
            this.cascaron = false

          },
          (error) => {
            this.notificationService.show({
              content: "Existe un error en la generacion!",
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
        const segundoTrimestre = `${anio}-07-10`;
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.EjecutandoInversion = true;
        this.cascaron =true
        this.cosaincegService.GetCascaron(segundoTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Se Genero la estructura para el trimestre.....!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
            this.cascaron = false
          },
          (error) => {
            console.error('Error fetching files', error);
            this.notificationService.show({
              content: "Existe un error en la generacion!",
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
        const tercerTrimestre = `${anio}-10-10`;
        console.log("Tercer Trimestre: ", tercerTrimestre)
        this.EjecutandoInversion = true;
        this.cascaron =true
        this.cosaincegService.GetCascaron(tercerTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Se Genero la estructura para el trimestre.....!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
            this.cascaron = false
          },
          (error) => {
            this.notificationService.show({
              content: "Existe un error en la generacion!",
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
        const cuarttoTrimestre = `${anio}-02-10`;
        console.log("cuartoTrimestre: ", cuarttoTrimestre)
        this.EjecutandoInversion = true;
        this.cascaron =true
        this.cosaincegService.GetCascaron(cuarttoTrimestre).subscribe(
          (resp) => {
            console.log(resp)
            this.notificationService.show({
              content: "Excel Copiado Correctamente, espere......!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoInversion = false;
            this.cascaron = false
          },
          (error) => {
            console.error('Error fetching files', error);
            this.notificationService.show({
              content: "Existe un error en la generacion!",
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

  constructor(private fileService: FileService, private cosaincegService: CosaincegService,
    private notificationService: NotificationService, private authService: AuthService, private router: Router) {


  }


  openPdfModal(pdfBase64: string, name: string) {
    this.selectedPdf = pdfBase64;

    this.nombre_archivo = name;
  }
  closePdfModal() {
    this.selectedPdf = null;
  }

  openPdfModal_2(pdfBase64: string, name: string) {
    this.selectedPdf_2 = pdfBase64;
    this.nombre_archivo_2 = name;
    console.log(this.nombre_archivo_2)
  }
  closePdfModal_2() {
    this.selectedPdf_2 = null;
  }
  DescargarExcel() {
    this.notificationService.show({
      content: "Debe Seleccionar un Trimestre 🔻",
      hideAfter: 2500,
      animation: { type: "fade", duration: 500 },
      type: { style: "warning", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });

  }
  GetFiles() {
    forkJoin([
      this.fileService.getFilesConsainceg1T(),
      this.fileService.getFilesConsainceg2T(),
      this.fileService.getFilesConsainceg3T(),
      this.fileService.getFilesConsainceg4T()
    ]).subscribe(
      ([files1, files2, files3, files4]) => {
        // Unir ambos arreglos
        this.FilesCosainceg = [...files1, ...files2, ...files3, ...files4];
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }

  GetFilesDeuda() {
    forkJoin([
      this.fileService.getFilesDeuda1T(),
      this.fileService.getFilesDeuda2T(),
      this.fileService.getFilesDeuda3T(),
      this.fileService.getFilesDeuda4T()
    ]).subscribe(
      ([files1, files2, files3, files4]) => {
        // Unir ambos arreglos
        this.FilesDeuda = [...files1, ...files2, ...files3, ...files4];
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }

  //DESCARGAR ARCHIVOS COSAINCEG
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
  //DESCARGAR ARCHIVOS DEUDA
  downloadFile_Deuda(filename: string): void {
    this.fileService.downloadFileDeuda(filename).subscribe(
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
    this.notificationService.show({
      content: "Debe Seleccionar un Trimestre 🔻",
      hideAfter: 1500,
      animation: { type: "fade", duration: 1900 },
      type: { style: "warning", icon: true },
      position: { horizontal: "center", vertical: "top" },
    });

  }
  public DescargaCatalogoRubros() {
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
