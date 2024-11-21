import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://172.31.33.175:5000'; // URL base de la API de Flask

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
  //CUMPLIMENTO
  Cumplimiento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetActividadesVencidas`);
  }
  Vencidas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetActividadesVencidas2`);
  }
  Integracion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Integracion`);
  }

  // Método para enviar datos (POST)
  // postData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/endpoint`, data, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });
  // }
}
