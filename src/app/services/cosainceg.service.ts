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
}
