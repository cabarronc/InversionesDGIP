import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ColumnMenuSettings, KENDO_GRID, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { WindowModule, WindowThemeColor } from '@progress/kendo-angular-dialog';
import { FileService } from '../../services/file.service';
import { KENDO_INDICATORS } from '@progress/kendo-angular-indicators';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { UploadsComponent } from "../uploads/uploads.component";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TabsModule } from 'primeng/tabs';


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
import { CosaincegService, BackupItem } from '../../services/cosainceg.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { catchError, concat, firstValueFrom, forkJoin, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { environment } from '../../../environments/environment';
import { KENDO_UPLOADS } from "@progress/kendo-angular-upload";
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadErrorEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog, DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-cosainceg',
  imports: [KENDO_LAYOUT, CommonModule, KENDO_BUTTONS, KENDO_GRID, WindowModule, KENDO_ICONS, KENDO_INDICATORS, KENDO_DIALOGS, CardModule, TagModule, MessageModule,
    UploadsComponent, KENDO_INPUTS, KENDO_LABELS, FormsModule, KENDO_GRID_EXCEL_EXPORT, KENDO_UPLOADS, SplitButtonModule, ButtonModule, ProgressSpinnerModule, FileUploadModule,
    TableModule, ButtonModule, ConfirmDialogModule, DialogModule, SelectModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule, NgxExtendedPdfViewerModule, TabsModule],
  templateUrl: './cosainceg.component.html',
  styleUrl: './cosainceg.component.scss',
  encapsulation: ViewEncapsulation.None
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
  pdfUrl!: SafeResourceUrl;
  mostrarPreview = false;
  private apiUrl = environment.apiUrl;// URL de tu API Flask
  public uploadSaveUrl = `${this.apiUrl}/upload`; // should represent an actual API endpoint
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint
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
  @ViewChild(Dialog) pdfDialog!: Dialog;
  fileStatus = new Map<string, 'success' | 'error'>();

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
  pdfSafeUrl: SafeResourceUrl | null = null;

  selectedPdf_2: string | null = null;
  nombre_archivo_2: string | null = null;

  canViewCosainceg = false;
  canViewPPI = false;
  canViewInversion = false;
  canViewDeuda = false;
  canViewAvance = false

  public opened = false;
  isInversionGeneral: boolean = false;
  isInversionGeneralD: boolean = false;
  isPPI: boolean = false;
  isAvance: boolean = false;
  generandoReporte: boolean = false;
  generandoReporteD: boolean = false;
  isCoping: boolean = false;
  copiado_respuesta: any
  interval: any;
  info: any;
  info2: any;
  EjecutandoInversion: boolean = false;
  EjecutandoPPI: boolean = false;
  EjecutandoAvance: boolean = false;
  cascaron: boolean = false;

  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

  backups: BackupItem[] = [];
  isLoading = false;
  isRestoring = false;
  public mostrarCatalogoDialog = false;
  public catalogoData: any[] = [];
  public cargandoCatalogo = false;
  statusOptions: any[] = [];
  catalogoDataOriginal: any[] = [];
  fecha_actualizacion: string = ''
  panelCollapsed = false;
  panelBackup = true
  // Variable para controlar visibilidad del modal (boolean)
  pdfModalVisible = false;
  public windowThemeColor: WindowThemeColor = "primary";
  ngOnInit(): void {
    this.cargarBackups();
    this.GetFiles();
    this.GetFilesDeuda();
    // Inicializamos las variables según los permisos del usuario
    this.canViewCosainceg = this.authService.hasPermission('cosainceg', 'manage');
    this.canViewInversion = this.authService.hasPermission('inversion', 'manage');
    this.canViewDeuda = this.authService.hasPermission('deuda', 'manage');
    this.canViewPPI = this.authService.hasPermission('ppi', 'manage');
    this.canViewAvance = this.authService.hasPermission('avancefinanciero', 'manage');
    console.log(this.canViewCosainceg)
    console.log(this.canViewDeuda)

  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++  Reporte COSAINCEG +++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  //==================================================================+
  ///=====================  Catalogo de Rubros   ======================
  //===================================================================
  public ActualizacionRubro = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.actualizarRubros(4) },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.actualizarRubros(7) },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.actualizarRubros(10) },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.actualizarRubros(2) },

  ]
  private async actualizarRubros(trimestre: number): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    this.isDisabled = true;
    this.isDisabledActualizacionRubros = true;
    this.messageService.add({
      key: 'act_rubro',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando actualizacion del Catalogo...',
      sticky: true,
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.ActualizarRubros(trimestre_seleccionado))
      console.log(resp)
      this.messageService.clear('act_rubro');
      this.messageService.add({
        key: 'act_rubro',
        severity: 'success',
        summary: resp.success.status,
        detail: resp.success.mensaje,
        sticky: true,
        life: 3500
      });
      this.isDisabled = false;
      this.isDisabledActualizacionRubros = false;

    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('act_rubro');
      this.messageService.add({
        key: 'act_rubro',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled = false;
      this.isDisabledActualizacionRubros = false;

    }
  }
  // Manejo de version de Catalogo 
  public async cargarBackups(): Promise<void> {
    this.isLoading = true;
    try {
      const resp = await firstValueFrom(this.cosaincegService.listarBackups());
      this.backups = resp.backups;
    } catch (error) {
      console.error('Error al listar backups:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los backups'
      });
    } finally {
      this.isLoading = false;
    }
  }
  public confirmarRestauracion(backup: BackupItem): void {
    this.confirmationService.confirm({
      header: 'Confirmar restauración',
      message: `¿Seguro que deseas restaurar el catálogo a la versión del ${backup.fecha}? Se respaldará la versión actual antes de reemplazarla.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Restaurar',
      rejectLabel: 'Cancelar',
      accept: () => this.restaurarBackup(backup.filename)
    });
  }
  private async restaurarBackup(filename: string): Promise<void> {
    this.isRestoring = true;
    try {
      const resp = await firstValueFrom(this.cosaincegService.restaurarBackup(filename));
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: resp.mensaje
      });
      await this.cargarBackups(); // refresca la lista (habrá un nuevo backup "pre_restore")
    } catch (error) {
      console.error('Error al restaurar backup:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo restaurar el backup seleccionado'
      });
    } finally {
      this.isRestoring = false;
    }
  }
  //Visualizar el catalogo en datos abiertos
  filtrarRubro(valor: any, filter: Function): void {

    if (valor === '__VACIOS__') {

      const registrosVacios = this.catalogoDataOriginal.filter(row =>
        row.rubro === null ||
        row.rubro === undefined ||
        String(row.rubro).trim() === ''
      );

      this.catalogoData = registrosVacios;

    } else if (valor) {

      this.catalogoData = this.catalogoDataOriginal.filter(
        row => row.rubro === valor
      );

    } else {

      this.catalogoData = [...this.catalogoDataOriginal];

    }
  }
  public async abrirCatalogoRubros(): Promise<void> {
    this.cargandoCatalogo = true;
    this.mostrarCatalogoDialog = true;
    try {
      // Ajusta esto al método real de tu service que te regrese el JSON del catálogo
      // (si solo tienes el endpoint de descarga de Excel, lo ideal es exponer uno que regrese JSON)
      const resp = await firstValueFrom(this.cosaincegService.GetCatalogoRubrosJson());
      this.catalogoDataOriginal = [...resp.datos];
      this.fecha_actualizacion = resp.fecha_actualizacion;
      const rubros = [
        ...new Set(
          resp.datos
            .map(item => item.rubro)
            .filter(rubro => rubro != null && String(rubro).trim() !== '')
        )
      ];

      this.statusOptions = [
        { label: 'Vacíos', value: '__VACIOS__' },
        ...rubros.map(rubro => ({
          label: String(rubro),
          value: rubro
        }))
      ];
      console.log(this.statusOptions)
      this.catalogoData = resp.datos;
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar el catálogo de rubros'
      });
      this.mostrarCatalogoDialog = false;
    } finally {
      this.cargandoCatalogo = false;
    }
  }
  //==================================================================
  ///=====================   Reporte Consainceg ======================
  //===================================================================
  public data = [
    { label: 'Primer Trimestre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarCosainceg(4) },
    { label: 'Segundo Trimestre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarCosainceg(7) },
    { label: 'Tercer Trimestre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarCosainceg(10) },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarCosainceg(2) },

  ];

  private async generarCosainceg(trimestre: number): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;

    console.log('Fecha seleccionada:', trimestre_seleccionado);

    this.isDisabled = true;
    this.isDisabledG = true;
    this.messageService.add({
      key: 'cosainceg',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte Cosainceg...',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });

    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarCosainceg(trimestre_seleccionado))
      console.log(resp)
      this.cosainceg = resp;
      this.GetFiles()
      console.log("triemstre", this.cosainceg)
      this.isDisabled = false;
      this.isDisabledG = false;
      this.messageService.clear('cosainceg');
      this.messageService.add({
        key: 'cosainceg',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });

    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('cosainceg');
      this.messageService.add({
        key: 'cosainceg',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled = false;
      this.isDisabledG = false;
    }

  }
  //==================================================================
  ///=====================   Recurso Consainceg ======================
  //===================================================================
  public dataExcelRecurso = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegRecurso(4, 'Rel recurso COSAINCEG01') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegRecurso(7, 'Rel recurso COSAINCEG02') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegRecurso(10, 'Rel recurso COSAINCEG03') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegRecurso(2, 'Rel recurso COSAINCEG04') },
  ]
  private async generarCosaincegRecurso(trimestre: number, filename: string): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    this.isDisabled = true;
    this.isDisabledExcelRecurso = true
    this.messageService.add({
      key: 'cosaincegR',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte Cosainceg Recurso...',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasCosaincegRecurso(trimestre_seleccionado, filename))
      const blob = resp.body!;

      // Descargar ZIP
      const zipFilename = filename.endsWith('.zip') ? filename : `${filename}.zip`;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = zipFilename;
      document.body.appendChild(link);
      link.click();
      // Limpieza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('ZIP generado correctamente');
      // ==========================================
      // JSON DEL HEADER
      // ==========================================
      const xHeader = resp.headers.get('X-Data');

      if (xHeader) {
        const x = JSON.parse(xHeader);
        console.log('Objeto recibido:', x);
        this.info = x;
      }
      this.messageService.clear('cosaincegR');
      this.messageService.add({
        key: 'cosaincegR',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
      this.isDisabled = false;
      this.isDisabledExcelRecurso = false

    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('cosaincegR');
      this.messageService.add({
        key: 'cosaincegR',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });

    }
    finally {
      this.isDisabled = false;
      this.isDisabledExcelRecurso = false

    }

  }
  //========================================================================
  ///=====================  Datos Abiertos Cosainceg ======================
  //=======================================================================
  public dataExcelG = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(4,'Cosainceg01Global') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(7,'Cosainceg02Global') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(10,'Cosainceg03Global') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(2,'Cosainceg04Global') },
  ]
  private async generarCosaincegDatosAbiertos(trimestre: number, filename: string): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    const filename_seleccionado = `${filename}_${anio}.xlsx`
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    console.log('Archivo seleccionada:', filename_seleccionado);
    this.isDisabled = true;
    this.isDisabledExcelG = true
    this.messageService.add({
      key: 'cosaincegdatosQ',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte por Proyectos/Procesos..',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasCosainceg(trimestre_seleccionado, filename_seleccionado))
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado;
      document.body.appendChild(link);
      link.click();
      // Limpieza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('ZIP generado correctamente');
      this.isDisabled = false;
      this.isDisabledExcelG = false;
      this.messageService.clear('cosaincegdatosQ');
      this.messageService.add({
        key: 'cosaincegdatosQ',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 3500
      });


    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('cosaincegdatosQ');
      this.messageService.add({
        key: 'cosaincegdatosQ',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });

    }
    finally {
      this.isDisabled = false;
      this.isDisabledExcelG = false;

    }

  }
  public dataExcelDep = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(4,'Cosainceg01Dependencias') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(7,'Cosainceg02Dependencias') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(10,'Cosainceg03Dependencias') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(2,'Cosainceg04Dependencias') },
  ]
  private async generarCosaincegDatosAbiertosDep(trimestre: number, filename: string): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    const filename_seleccionado = `${filename}_${anio}.xlsx`
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    console.log('Archivo seleccionada:', filename_seleccionado);
    this.isDisabled = true;
    this.isDisabledExcelD = true
    this.messageService.add({
      key: 'cosaincegdatosDep',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte por Entidad/Dependencia',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasCosaincegDep(trimestre_seleccionado, filename_seleccionado))
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado;
      document.body.appendChild(link);
      link.click();
      // Limpieza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('ZIP generado correctamente');
      this.isDisabled = false;
      this.isDisabledExcelD = false;
      this.messageService.clear('cosaincegdatosDep');
      this.messageService.add({
        key: 'cosaincegdatosDep',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 3500
      });


    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('cosaincegdatosDep');
      this.messageService.add({
        key: 'cosaincegdatosDep',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });

    }
    finally {
      this.isDisabled = false;
      this.isDisabledExcelD = false;

    }

  }
  public dataExcelRub = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(4,'Cosainceg01Rubros') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(7,'Cosainceg02Rubros') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(10,'Cosainceg03Rubros') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(2,'Cosainceg04Rubros') },
  ]
  private async generarCosaincegDatosAbiertosRub(trimestre: number, filename: string): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    const filename_seleccionado = `${filename}_${anio}.xlsx`
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    console.log('Archivo seleccionada:', filename_seleccionado);
    this.isDisabled = true;
    this.isDisabledExcelR = true
    this.messageService.add({
      key: 'cosaincegdatosRub',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte por Rubro',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasCosaincegRub(trimestre_seleccionado, filename_seleccionado))
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado;
      document.body.appendChild(link);
      link.click();
      // Limpieza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('ZIP generado correctamente');
      this.isDisabled = false;
      this.isDisabledExcelR = false;
      this.messageService.clear('cosaincegdatosRub');
      this.messageService.add({
        key: 'cosaincegdatosRub',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 3500
      });


    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('cosaincegdatosRub');
      this.messageService.add({
        key: 'cosaincegdatosRub',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });

    }
    finally {
      this.isDisabled = false;
      this.isDisabledExcelR = false;

    }

  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //+++++++++++++++++++++++++++++++++++++++++++++  Reporte Deuda +++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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






  
  /////////////////////////////////////// 
  

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
        this.isDisabled_deuda = true;
        this.isDisabledExcelRecursoDeuda = true
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
            this.isDisabled_deuda = true;
            this.isDisabledExcelRecursoDeuda = false

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
        this.isDisabled_deuda = true;
        this.isDisabledExcelRecursoDeuda = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(segundoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelRecursoDeuda = false
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
        this.isDisabled_deuda = true;
        this.isDisabledExcelRecursoDeuda = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(tercerTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelRecursoDeuda = false
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
        this.isDisabled_deuda = true;
        this.isDisabledExcelRecursoDeuda = true
        this.cosaincegService.GenerarDescargasDeudaRecurso(cuarttoTrimestre, filename).subscribe(
          (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.isDisabled_deuda = false;
            this.isDisabledExcelRecursoDeuda = false
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


  public onUploadCatalogo(event: FileUploadEvent): void {
    console.log('Archivo subido:', event);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Catálogo de Rubros subido correctamente',
      life: 3500
    });
  }

  public onUploadCatalogoError(event: FileUploadErrorEvent): void {
    console.error('Error al subir el catálogo:', event);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un error al subir el catálogo',
      life: 3500
    });
  }
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
  hasProps2(obj: any): boolean {
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
        this.cascaron = true
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
        this.cascaron = true
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
        this.cascaron = true
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
        this.cascaron = true
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

  ///// Hoja de trabajo///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelPPI = [
    {
      text: 'Primer Trimestre',
      svgIcon: fileExcelIcon,
      click: (): void => {
        const today = new Date();
        const lastYearDate = new Date(today);
        lastYearDate.setFullYear(today.getFullYear());
        const anio = lastYearDate.getFullYear().toString();
        const primerTrimestre = `${anio}-04-10`;
        const filename = `PPI_1T_${anio}.xlsx`
        console.log("Primer Trimestre: ", primerTrimestre)
        this.EjecutandoPPI = true;
        this.isPPI = true
        this.cosaincegService.GenerarPPI(primerTrimestre, filename).subscribe(
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
            this.info2 = x
            console.log("Objeto recibido:", x);
            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoPPI = false;
            this.isPPI = false

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
        const filename = `PPI_2T_${anio}.xlsx`
        console.log("Segundo Trimestre: ", segundoTrimestre)
        this.EjecutandoPPI = true;
        this.isPPI = true
        this.cosaincegService.GenerarPPI(segundoTrimestre, filename).subscribe(
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
            this.info2 = x
            console.log("Objeto recibido:", x);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoPPI = false;
            this.isPPI = false

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
        const filename = `PPI_3T_${anio}.xlsx`
        this.EjecutandoPPI = true;
        this.isPPI = true
        this.cosaincegService.GenerarPPI(tercerTrimestre, filename).subscribe(
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
            this.info2 = x
            console.log("Objeto recibido:", x);

            this.notificationService.show({
              content: "Excel Generado Correctamente, espero que se descargue!",
              hideAfter: 1500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "left", vertical: "top" },
            });
            this.EjecutandoPPI = false;
            this.isPPI = false
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
        const cuartoTrimestre = `${anio}-02-10`;
        const filename = `PPI_4T_${anio}.xlsx`
        console.log("cuartoTrimestre: ", cuartoTrimestre)
        this.EjecutandoPPI = true;
        this.isPPI = true
        this.cosaincegService.GenerarPPI(cuartoTrimestre, filename).subscribe(
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
            this.EjecutandoPPI = false;
            this.isPPI = false
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
  //////// Avanbce Financiero
  /////excel///////////////////////////////////////////////////////////////////////////////////////////////////

  // Un solo método para todos los meses (misma lógica que Febrero)
  private async generarAvanceFinanciero(mes: number, abrev: string): Promise<void> {
    const today = new Date();
    const anio = today.getFullYear().toString();
    const fechaCorte = `${anio}-${String(mes).padStart(2, '0')}-10`;
    const formatted =
      String(today.getFullYear()).slice(-2) +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    console.log(formatted);
    const filename = `${formatted} Avance Financiero Inversión ${abrev} ${anio}`;
    console.log(`${abrev}: `, fechaCorte);

    this.EjecutandoAvance = true;
    this.isAvance = true;

    // Toast de espera: sticky y con key propia, se quita cuando termina la llamada
    this.messageService.add({
      key: 'avance',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando reporte...',
      sticky: true
    });

    try {
      // ==========================================
      // 1. GENERACIÓN TERMINÓ CORRECTAMENTE
      // ==========================================
      const resp = await firstValueFrom(
        this.cosaincegService.GenerarDescargasAvanceFinanciero(fechaCorte, filename)
      );

      const blob = resp.body!;

      // Descargar ZIP
      const zipFilename = `${filename}.zip`;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = zipFilename;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('ZIP generado correctamente');

      // ==========================================
      // JSON DEL HEADER
      // ==========================================
      const xHeader = resp.headers.get('X-Data');

      if (xHeader) {
        const x = JSON.parse(xHeader);
        console.log('Objeto recibido:', x);
        this.info = x;
      }

      this.EjecutandoAvance = false;
      this.isAvance = false; // antes del toast

      this.messageService.clear('avance');
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Archivo generado correctamente',
        life: 1500
      });

    } catch (error) {
      console.error('Error generando reporte:', error);

      this.EjecutandoAvance = false;
      this.isAvance = false; // antes del toast

      this.messageService.clear('avance');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
      return; // sin reporte no se pide el preview
    }

    // ==========================================
    // 2. AHORA PEDIMOS EL PREVIEW
    // ==========================================
    try {
      const previewResp = await firstValueFrom(
        this.cosaincegService.GenerarDescargasAvanceFinancieroPreview(fechaCorte, filename)
      );

      console.log('PDF encontrado correctamente');

      const pdfBlob = previewResp.body!;
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.mostrarPreview = true;

    } catch (error) {
      console.error('Error obteniendo preview:', error);
    }
  }

  public dataAvanceFinanciero = [
    { label: '02 Febrero', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(2, 'Feb') },
    { label: '03 Marzo', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(3, 'Mar') },
    { label: '04 Abril', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(4, 'Abr') },
    { label: '05 Mayo', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(5, 'May') },
    { label: '06 Junio', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(6, 'Jun') },
    { label: '07 Julio', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(7, 'Jul') },
    { label: '08 Agosto', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(8, 'Ago') },
    { label: '09 Septiembre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(9, 'Sep') },
    { label: '10 Octubre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(10, 'Oct') },
    { label: '11 Noviembre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(11, 'Nov') },
    { label: '12 Diciembre', icon: "pi pi-file-word", command: (): Promise<void> => this.generarAvanceFinanciero(12, 'Dic') },
  ];
  onUploadSuccess(event: any) {
    this.cargarBackups();
    // event.originalEvent, event.files están disponibles
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Archivo subido correctamente'
    });
  }

  onUploadError(event: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Hubo un problema al subir el archivo'
    });
  }

  onFileUploaded(event: any) {
    const fileName = event.files[0]?.name;
    if (fileName) {
      this.fileStatus.set(fileName, 'success');
    }
  }

  onFileError(event: any) {
    const fileName = event.files[0]?.name;
    if (fileName) {
      this.fileStatus.set(fileName, 'error');
    }
  }

  removeFile(fileUpload: any, index: number, file: any) {
    fileUpload.remove(null, index);
    this.fileStatus.delete(file.name);
  }


  constructor(private fileService: FileService, private cosaincegService: CosaincegService, private messageService: MessageService, private confirmationService: ConfirmationService,
    private notificationService: NotificationService, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) {


  }
  @ViewChild('pdfDialog', { read: ElementRef }) pdfDialogRef!: ElementRef<HTMLElement>;

  isMaximized = false;


  openPdfModal(base64: string, name: string) {
    this.selectedPdf = base64.includes(',') ? base64.split(',')[1] : base64;
    this.nombre_archivo = name;
    this.pdfModalVisible = true;
    this.isMaximized = false;
  }
  closePdfModal() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.pdfModalVisible = false;
    this.selectedPdf = null;
    this.nombre_archivo = '';
    this.isMaximized = false;
  }
  toggleMaximize() {
    const dialogEl = this.pdfDialogRef?.nativeElement?.querySelector('.p-dialog') as HTMLElement;
    if (!dialogEl) return;

    if (!document.fullscreenElement) {
      dialogEl.requestFullscreen().catch(err => console.error('Error al entrar a pantalla completa:', err));
    } else {
      document.exitFullscreen();
    }
  }

  // Detecta cuando el usuario sale de pantalla completa (incluyendo con la tecla Esc)
  // para mantener sincronizado el ícono del botón.
  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isMaximized = !!document.fullscreenElement;
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
      animation: { type: "fade", duration: 1500 },
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
