import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
private apiUrl = environment.apiUrl;
 


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
  Integracion(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Integracion`, body, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),});
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

  CatalaogoQ(): Observable<any> {
    return this.http.get(`${this.apiUrl}/CatalogoQ`);
  }

  // Método para enviar datos (POST)
  // postData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/endpoint`, data, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });
  // }
}
