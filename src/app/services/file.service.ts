// archivo: file.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl;// URL de tu API Flask

  constructor(private http: HttpClient) {}


  getFilesAmpliaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesAmpliaciones`);
  }

  getFilesReducciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesReducciones`);
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }

  downloadFileRed(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_R/${filename}`, { responseType: 'blob' });
  }
}
