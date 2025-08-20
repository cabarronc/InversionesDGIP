import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable,throwError  } from 'rxjs';
export interface QueryRequest {
  naturalLanguage: string;
}
export interface QueryResponse {
  success: boolean;
  message: string;
  data?: any;
  recordCount?: number;
  excelFile?: string; // Base64 encoded file
  fileName?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ClaudeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
    /**
   * Envía una consulta en lenguaje natural a Claude AI
   */
  translateAndQuery(request: QueryRequest): Observable<QueryResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<QueryResponse>(`${this.apiUrl}/translate-query`, request, { headers })
      .pipe(
        map(response => {
          // Procesar la respuesta si es necesario
          return response;
        }),
        catchError(this.handleError)
      );
  }

  modeloLocal(request: QueryRequest): Observable<QueryResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<QueryResponse>(`${this.apiUrl}/modelo_local`, request, { headers })
      .pipe(
        map(response => {
          // Procesar la respuesta si es necesario
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
     console.error(errorMessage);

  // Esto es clave: devolver un Observable que emite el error
  return throwError(() => errorMessage);
  }

  downloadExcelFile(base64Data: string, fileName: string): void {
    try {
      // Decodificar base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Crear blob y descargar
      const blob = new Blob([bytes], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'query_results.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando archivo Excel:', error);
    }
  }
}
