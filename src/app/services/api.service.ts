import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://172.31.33.122:5000'; // URL base de la API de Flask

  constructor(private http: HttpClient) {}

  // Método para obtener datos (GET)
  getData(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/GetCircular`,body, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),});
  }

  CircularCopy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetCircularCopy`);
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
