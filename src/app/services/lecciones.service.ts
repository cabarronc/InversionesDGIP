import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeccionesService {

  constructor(private http: HttpClient) {


  }
  private apiUrl = environment.apiUrl;// URL de tu API Flask
  GenerarDescargasLecciones() {
    return this.http.get<any>(`${this.apiUrl}/lecciones/consolidacion`);
  }

  ObtenerArchivosLecciones(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/lecciones/archivos`);
  }

  DescargarArchivoLecciones(nombreArchivo: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/lecciones/descargar/${encodeURIComponent(nombreArchivo)}`,
      { responseType: 'blob' }
    );
  }
}
