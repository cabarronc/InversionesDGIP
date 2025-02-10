import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdecuacionesService {
  private apiUrl = environment.apiUrl; // ⚠️ Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // 📌 Método para enviar el JSON al backend
  GenerarOficio(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/GetOficioAp`, data, { headers });
  }
}
