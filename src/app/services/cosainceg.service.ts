import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CosaincegService {
  private apiUrl = environment.apiUrl;// URL de tu API Flask

  constructor(private http: HttpClient) { }

  // 📌 Método para enviar el JSON al backend
  GenerarCosainceg(fecha: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post<any>(`${this.apiUrl}/GetReporteCosainceg`, body, { headers });
  }
    // 📌 Método para enviar el JSON al backend
  GenerarDescargasCosainceg(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegGeneral/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

    GenerarDescargasCosaincegDep(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegDependencia/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

      GenerarDescargasCosaincegRub(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegRubro/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

      GenerarDescargasCosaincegRecurso(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegRecurso/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  GetCatalogoRubros(filename: string): Observable<Blob>{
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/GetCatalogoRubros/${filename}.xlsx`, null, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>
  }

    // 📌 Método para enviar el JSON al backend
  ActualizarRubros(fecha: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post<any>(`${this.apiUrl}/GetActualizacionRubros`, body, { headers });
  }

}
