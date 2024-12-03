import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://172.31.33.191:5000'; // URL base de la API de Flask

  constructor(private http: HttpClient) {}

  // CIRCULAR
  getData(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/GetCircular`,body, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),});
  }
  CircularCopy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetCircularCopy`);
  }
  // PUNTOS ATENCION
  PuntosAtencion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetPuntosAtencion`);
  }
   // GRAFICOS
   Graficos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetGraficos`);
  }
  //CUMPLIMENTO
  Cumplimiento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetActividadesVencidas`);
  }
  Vencidas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetActividadesVencidas2`);
  }
  //INTEGRACION
  Integracion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Integracion`);
  }
  //SED Programacion
  ExcelSEDProgramacion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetExcelProgramacion`);
  }
  //SED Seguimiento
  ExcelSEDSeguimiento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetExcelSeguimiento`);
  }
  //SAP 
  ExcelSAP(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetExcelSAP`);
  }

  // Método para enviar datos (POST)
  // postData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/endpoint`, data, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });
  // }
}
