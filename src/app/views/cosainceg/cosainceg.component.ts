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

import { ToggleSwitchModule } from 'primeng/toggleswitch';


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

interface ColumnaConsulta {
  field: string;
  title: string;
  width: number;
  center?: boolean;
  filterType?: 'text' | 'numeric' | 'date';
}
@Component({
  selector: 'app-cosainceg',
  imports: [KENDO_LAYOUT, CommonModule, KENDO_BUTTONS, KENDO_GRID, WindowModule, KENDO_ICONS, KENDO_INDICATORS, KENDO_DIALOGS, CardModule, TagModule, MessageModule,
    UploadsComponent, KENDO_INPUTS, KENDO_LABELS, FormsModule, KENDO_GRID_EXCEL_EXPORT, KENDO_UPLOADS, SplitButtonModule, ButtonModule, ProgressSpinnerModule, FileUploadModule,
    TableModule, ButtonModule, ConfirmDialogModule, DialogModule, SelectModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule, NgxExtendedPdfViewerModule, TabsModule, ToggleSwitchModule],
  templateUrl: './cosainceg.component.html',
  styleUrl: './cosainceg.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class CosaincegComponent implements OnInit {

  readonly columnasTop: ColumnaConsulta[] = [
    { field: 'nombre', title: 'Nombre del Proyecto', width: 290 },
    { field: 'ejercicio', title: 'Ejercicio', width: 100, center: true },
    { field: 'modificado_formateado', title: 'Monto', width: 160 },
    { field: 'ranking', title: 'Posición', width: 100, filterType: 'numeric' },
  ];

  readonly columnasMetas: ColumnaConsulta[] = [
    { field: 'clave_recodificada', title: 'Clave', width: 50 },
    { field: 'nombre', title: 'Nombre del Proyecto', width: 300 },
    { field: 'meta_estandarizada', title: 'Meta', width: 100, center: true },
    { field: 'descripmeta', title: 'Descripción Meta', width: 260 },
    { field: 'Modificado', title: 'Modificado', width: 80 },
    { field: 'ejercicio', title: 'Ejercicio', width: 80 },
  ];

  readonly columnasArchivos: ColumnaConsulta[] = [
    { field: 'name', title: 'Nombre de Archivo', width: 230 },
    { field: 'size', title: 'Tamaño', width: 130, center: true },
    { field: 'creation_time', title: 'Creación', width: 160 },
    { field: 'modification_time', title: 'Modificación', width: 160 },
  ];

  @Input() selectedItem: string | undefined;
  public corte = 'Sin trimestre seleccionado';
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
  public opened2 = false;
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


  public close2(): void {
    this.opened2 = false;
  }

  public open2(): void {
    this.opened2 = true;
  }

  backups: BackupItem[] = [];
  isLoading = false;
  isRestoring = false;
  public mostrarCatalogoDialog = false;
  public mostrarMetasDeudaDialog = false;
  public catalogoData: any[] = [];
  public cargandoCatalogo = false;
  statusOptions: any[] = [];
  catalogoDataOriginal: any[] = [];
  fecha_actualizacion: string = ''
  panelCollapsed = false;
  panelBackup = true
  panelDeuda = true
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
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(4, 'Cosainceg01Global') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(7, 'Cosainceg02Global') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(10, 'Cosainceg03Global') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertos(2, 'Cosainceg04Global') },
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
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(4, 'Cosainceg01Dependencias') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(7, 'Cosainceg02Dependencias') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(10, 'Cosainceg03Dependencias') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosDep(2, 'Cosainceg04Dependencias') },
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
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(4, 'Cosainceg01Rubros') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(7, 'Cosainceg02Rubros') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(10, 'Cosainceg03Rubros') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarCosaincegDatosAbiertosRub(2, 'Cosainceg04Rubros') },
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
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGneral(4) },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGneral(7) },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGneral(10) },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGneral(2) },

  ]
  private async generarDeudaGneral(trimestre: number): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    this.isDisabled_deuda = true;
    this.isDisabledG_deuda = true;
    this.messageService.add({
      key: 'DeudaGeneral',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando Deuda General...',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDeuda(trimestre_seleccionado))
      console.log("resp", resp);
      this.messageService.clear('DeudaGeneral');
      this.messageService.add({
        key: 'DeudaGeneral',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
      this.isDisabled_deuda = false;
      this.isDisabledG_deuda = false;


    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('DeudaGeneral');
      this.messageService.add({
        key: 'DeudaGeneral',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled_deuda = false;
      this.isDisabledG_deuda = false;
    }
  }
  ////////////////////////////////////////////////////////////////
  ////////////////////// Recurso Deuda //////////////////////////
  public dataExcelRecursoDeuda = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaRecurso(4, 'Rel Obras Financiamiento Deuda01') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaRecurso(7, 'Rel Obras Financiamiento Deuda02') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaRecurso(10, 'Rel Obras Financiamiento Deuda03') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaRecurso(2, 'Rel Obras Financiamiento Deuda04') },
  ]

  private async generarDeudaRecurso(trimestre: number, filename: string): Promise<void> {
    const today = new Date();
    let anio = today.getFullYear()
    if (trimestre == 2) {
      anio--;
    }
    const trimestreFormateado = trimestre.toString().padStart(2, '0');
    const trimestre_seleccionado = `${anio}-${trimestreFormateado}-10`;
    const filename_seleccionado = filename
    console.log('Fecha seleccionada:', trimestre_seleccionado);
    console.log('Archivo seleccionada:', filename_seleccionado);
    this.isDisabled_deuda = true;
    this.isDisabledExcelRecursoDeuda = true
    this.messageService.add({
      key: 'DeudaRecurso',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando Recurso Deuda...',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasDeudaRecurso(trimestre_seleccionado, filename_seleccionado))
      console.log("resp", resp);
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado.endsWith('zip') ? filename_seleccionado : `${filename_seleccionado}.zip`;
      document.body.appendChild(link);
      link.click();
      this.messageService.clear('DeudaRecurso');
      this.messageService.add({
        key: 'DeudaRecurso',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
      this.isDisabled_deuda = false;
      this.isDisabledExcelRecursoDeuda = false;


    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('DeudaRecurso');
      this.messageService.add({
        key: 'DeudaRecurso',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled_deuda = false;
      this.isDisabledExcelRecursoDeuda = false;
    }
  }

  ///// EXCEL DEUDA GLOBAL///////////////////////////////////////////////////////////////////////////////////////////////////
  public dataExcelDeudaG = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGlobal(4, 'Deuda01Global') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGlobal(7, 'Deuda02Global') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGlobal(10, 'Deuda03Global') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaGlobal(2, 'Deuda04Global') },
  ]
  private async generarDeudaGlobal(trimestre: number, filename: string): Promise<void> {
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
    this.isDisabled_deuda = true;
    this.isDisabledExcelG_deuda = true
    this.messageService.add({
      key: 'DeudaGlobal',
      severity: 'info',
      summary: 'Info',
      detail: 'Espere, generando Deuda Global...',
      sticky: true,
      icon: 'pi pi-spinner-dotted pi-spin',
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasDeuda(trimestre_seleccionado, filename_seleccionado))
      console.log("resp", resp);
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado;
      document.body.appendChild(link);
      link.click();
      this.messageService.clear('DeudaGlobal');
      this.messageService.add({
        key: 'DeudaGlobal',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
      this.isDisabled_deuda = false;
      this.isDisabledExcelG_deuda = false;
    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('DeudaGlobal');
      this.messageService.add({
        key: 'DeudaGlobal',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled_deuda = false;
      this.isDisabledExcelG_deuda = false;
    }

  }

  ///////////////////////////  excel dependencias deuda  //////////////////////////
  dataExcelDepDeuda = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaDependencias(4, 'Deuda01Dependencias') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaDependencias(7, 'Deuda02Dependencias') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaDependencias(10, 'Deuda03Dependencias') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaDependencias(2, 'Deuda04Dependencias') },

  ]

  private async generarDeudaDependencias(trimestre: number, filename: string): Promise<void> {
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
    this.isDisabled_deuda = true;
    this.isDisabledExcelG_deuda_dep = true
    this.messageService.add({
      key: 'DeudaDependencias',
      severity: 'info',
      summary: 'Información',
      detail: 'Generando reporte...',
      life: 1500
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasDeudaDep(trimestre_seleccionado, filename_seleccionado))
      console.log("resp", resp);
      const blob = resp.body!;
      // Descargar Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename_seleccionado;
      document.body.appendChild(link);
      link.click();
      this.messageService.clear('DeudaDependencias');
      this.messageService.add({
        key: 'DeudaDependencias',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
    }
    catch (error) {
      console.error('Error generando reporte:', error);
      this.messageService.clear('DeudaDependencias');
      this.messageService.add({
        key: 'DeudaDependencias',
        severity: 'error',
        summary: 'Error',
        detail: 'Existe un Error en la Generacion del Reporte!',
        life: 1500
      });
    }
    finally {
      this.isDisabled_deuda = false;
      this.isDisabledExcelG_deuda_dep = false;
    }
  }

  //////////////////////////////////////////////////////////////
  ///// EXCEL DEUDA METAS///////////////////////////////////////////////////////////////////////////////////////////////////

  dataExcelDeudaMetas = [
    { label: 'Primer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaMetas(4, 'DeudaMetas01') },
    { label: 'Segundo Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaMetas(7, 'DeudaMetas02') },
    { label: 'Tercer Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaMetas(10, 'DeudaMetas03') },
    { label: 'Cuarto Trimestre', icon: "pi pi-file-excel", command: (): Promise<void> => this.generarDeudaMetas(2, 'DeudaMetas04') },

  ]
  private async generarDeudaMetas(trimestre: number, filename: string): Promise<void> {
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
    this.isMetas = true;
    this.isMetasD = true
    this.messageService.add({
      key: 'DeudaMetas',
      severity: 'info',
      summary: 'Información',
      detail: 'Generando reporte...',
      life: 1500
    });
    try {
      const resp = await firstValueFrom(this.cosaincegService.GenerarDescargasDeudaMetas(trimestre_seleccionado, filename_seleccionado))
      console.log("resp", resp);
      this.Top = resp.json
      this.Metas = resp.metas
      this.corte = resp.corte
      // Identifica cómo llega el archivo sin imprimirlo completo.
      console.log('Campos de la respuesta:', Object.keys(resp));
      console.log('Tipo de file:', typeof resp.file);
      console.log('Muestra de file:', typeof resp.file === 'string'
        ? resp.file.slice(0, 80)
        : resp.file);
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
      link.download = filename_seleccionado;
      link.click();

      // JSON adicional
      console.log(resp.metas);
      console.log(resp.json);
      this.messageService.clear('DeudaMetas');
      this.messageService.add({
        key: 'DeudaMetas',
        severity: 'success',
        summary: 'Éxito',
        detail: 'Generado correctamente',
        life: 1500
      });
    } catch (error) {
      this.messageService.clear('DeudaMetas');
      this.messageService.add({
        key: 'DeudaMetas',
        severity: 'error',
        summary: 'Error',
        detail: 'Error al generar el reporte',
        life: 1500
      });
    }
    finally {
      this.isMetas = false;
      this.isMetasD = false
    }

  }

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





  openPdfModal_2(pdfBase64: string, name: string) {
    this.selectedPdf_2 = pdfBase64;
    this.nombre_archivo_2 = name;
    console.log(this.nombre_archivo_2)
  }
  closePdfModal_2() {
    this.selectedPdf_2 = null;
  }
  DescargarExcel() {
    this.messageService.add({
      key: 'DescargarExcelGenerico',
      severity: 'warn',
      summary: 'Información',
      detail: 'Debe Seleccionar un Trimestre 🔻',
      life: 1500
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


}
