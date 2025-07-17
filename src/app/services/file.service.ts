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
  getFilesReportesSAP(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesReporteSAP`);
  }
  getFilesReportesSEDProgramacion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesReporteSEDProgramacion`);
  }

  getFilesReportesSEDSeguimiento(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesReporteSEDSeguimiento`);
  }

  getFilesReducciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesReducciones`);
  }

  getFilesConsainceg1T(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesConsainceg1T`);
  }

  getFilesConsainceg2T(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesConsainceg2T`);
  }

  getFilesConsainceg3T(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesConsainceg3T`);
  }
  getFilesConsainceg4T(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-filesConsainceg4T`);
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }

  downloadFileRed(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_R/${filename}`, { responseType: 'blob' });
  }

  downloadFileSap(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_sap/${filename}`, { responseType: 'blob' });
  }

  downloadFileSEDProgramacion(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_sedprog/${filename}`, { responseType: 'blob' });
  }

  downloadFileSEDSeguimiento(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_sedsegui/${filename}`, { responseType: 'blob' });
  }

   downloadFileCosainceg1t(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_cosainceg1T/${filename}`, { responseType: 'blob' });
  }
}
