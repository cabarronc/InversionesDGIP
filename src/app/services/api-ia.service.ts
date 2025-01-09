import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiIaService {
  private apiUrl = 'http://172.31.33.223:5000';
  constructor(private http: HttpClient) { }
  preguntar(pregunta: string, contexto: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/preguntar`, { pregunta, contexto });
  }

  exportar(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar`, { responseType: 'blob' });
  }
  exportarPregunta(pregunta: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/exportarDatos`, { pregunta }, { responseType: 'blob' });
  }
  consultarPregunta(pregunta: string, esquema:string): Observable<any> {
    const payload = {pregunta, esquema };
    return this.http.post(`${this.apiUrl}/consultar`,payload);
  }
}
