import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LeccionesService } from '../../services/lecciones.service';
import { firstValueFrom } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lecciones-aprendidas',
  imports: [CardModule,TagModule,MessageModule,ButtonModule,ProgressSpinnerModule,TableModule],
  templateUrl: './lecciones-aprendidas.component.html',
  styleUrl: './lecciones-aprendidas.component.scss',
})
export class LeccionesAprendidasComponent implements OnInit {
  isDisabledIntegracionLecciones:boolean= false
  isdisabled:boolean=false
  info:any
  archivosLecciones: any[] = [];
  
  ngOnInit(): void {
    this.obtenerArchivosLecciones()
  }
  constructor(private leccionesService: LeccionesService,private messageService: MessageService,) {
    
  }

  
async obtenerArchivosLecciones(): Promise<void> {
  try {
    this.archivosLecciones = await firstValueFrom(
      this.leccionesService.ObtenerArchivosLecciones()
      
    );
    
  } catch (error) {
    console.error('Error al consultar archivos:', error);
  }
}  

async descargarLeccion(nombreArchivo: string): Promise<void> {
  try {
    const blob = await firstValueFrom(
      this.leccionesService.DescargarArchivoLecciones(nombreArchivo)
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = nombreArchivo;
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al descargar archivo:', error);
  }
}

public async generarConsolidadoLecciones(): Promise<void> {

  const today = new Date();
  const anio = today.getFullYear().toString();

  const filename = `Consolidado_Lecciones_Aprendidas_${anio}`;

  this.isDisabledIntegracionLecciones = true;
  this.isdisabled = true;

  this.messageService.add({
    key: 'lecciones',
    severity: 'info',
    summary: 'Info',
    detail: 'Espere, generando consolidado...',
    sticky: true
  });

  try {

    // ==========================================
    // 1. GENERACIÓN DEL CONSOLIDADO
    // ==========================================
    const resp = await firstValueFrom(
      this.leccionesService.GenerarDescargasLecciones()
    );

    // ==========================================
    // 2. RECUPERAR JSON
    // ==========================================
    console.log('Datos recibidos:', resp.datos);
    this.info = resp.datos;

    console.log('Ruta del Excel:', resp.ruta);

    // ==========================================
    // 3. CONVERTIR BASE64 A BLOB
    // ==========================================
    const byteCharacters = atob(resp.archivo);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // ==========================================
    // 4. DESCARGAR EXCEL
    // ==========================================
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = resp.nombreArchivo || `${filename}.xlsx`;
    a.click();

    window.URL.revokeObjectURL(url);

    console.log('Excel generado correctamente');

    // ==========================================
    // 5. FINALIZAR
    // ==========================================
    this.isDisabledIntegracionLecciones = false;
    this.isdisabled = false;

    this.messageService.clear('lecciones');
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Consolidado generado correctamente',
      life: 1500
    });

  } catch (error) {

    console.error('Error generando consolidado:', error);

    this.isDisabledIntegracionLecciones = false;
    this.isdisabled = false;

    this.messageService.clear('lecciones');
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Existe un error en la generación del consolidado',
      life: 1500
    });

    return;
  }
}





}
