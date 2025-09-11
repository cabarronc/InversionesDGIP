import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  modified: string;
  extension: string;
}

export interface UploadResponse {
  message: string;
  file1_id: string;
  file2_id: string;
  file1_hash: string;
  file2_hash: string;
}



export interface ComparisonResult {
  type: string;
  metadata: {
    file1: FileMetadata;
    file2: FileMetadata;
  };
  // Para comparaciones de texto
  diff?: string[];
  stats?: {
    lines_file1: number;
    lines_file2: number;
    changes: number;
  };
  // Para comparaciones de CSV
  structure_changes?: {
    columns_added: string[];
    columns_removed: string[];
    shape_change: {
      from: [number, number];
      to: [number, number];
    };
  };
  data_changes: {
    rows_added: number;
    rows_removed: number;
    rows_unchanged: number;
    error?: string;
  };
  // Análisis detallado campo por campo
  field_level_changes?: {
    [fieldName: string]: FieldAnalysis;
  };
  detailed_analysis_enabled?: boolean;
  analysis_reason?: string;
  // Para comparaciones genéricas
  message?: string;
  file1_info?: any;
  file2_info?: any;
}

export interface FieldAnalysis {
  column_name: string;
  data_type_old: string;
  data_type_new: string;
  unique_values_old: number;
  unique_values_new: number;
  null_count_old: number;
  null_count_new: number;
  changes_detected: ChangeDetection[];
  // Para campos numéricos
  statistics_old?: NumericStats;
  statistics_new?: NumericStats;
  numeric_changes?: ChangeDetection[];
  // Para campos de texto
  text_analysis_old?: TextAnalysis;
  text_analysis_new?: TextAnalysis;
  text_changes?: ChangeDetection[];
  // Para campos de fecha
  date_analysis_old?: DateAnalysis;
  date_analysis_new?: DateAnalysis;
  date_changes?: ChangeDetection[];
  // Valores únicos
  unique_values_changes?: UniqueValuesChanges;
  error?: string;
}

export interface NumericStats {
  mean: number | null;
  median: number | null;
  std: number | null;
  min: number | null;
  max: number | null;
}
export interface TextAnalysis {
  avg_length: number;
  max_length: number;
  min_length: number;
  empty_strings: number;
}

export interface DateAnalysis {
  min_date: string | null;
  max_date: string | null;
  date_range_days: number | null;
}

export interface ChangeDetection {
  type: string;
  description: string;
  old_value?: any;
  new_value?: any;
}

export interface UniqueValuesChanges {
  added_values: any[];
  removed_values: any[];
  added_count: number;
  removed_count: number;
}
export interface FileMetadata {
  name: string;
  size: number;
  modified: string;
  hash: string;
}
@Injectable({
  providedIn: 'root'
})
export class ComparacionArchivosService {
private apiUrl = environment.apiUrl_compacion;
  constructor(private http: HttpClient) { }

  uploadFiles(file1: File, file2: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  compareFiles(file1Id: string, file2Id: string): Observable<ComparisonResult> {
    return this.http.get<ComparisonResult>(`${this.apiUrl}/compare/${file1Id}/${file2Id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  compareFilesDetailed(file1Id: string, file2Id: string): Observable<ComparisonResult> {
    return this.http.get<ComparisonResult>(`${this.apiUrl}/compare/${file1Id}/${file2Id}/detailed`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  listFiles(): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.apiUrl}/files`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica que esté ejecutándose.';
          break;
        case 400:
          errorMessage = error.error?.error || 'Solicitud incorrecta';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 413:
          errorMessage = 'El archivo es demasiado grande';
          break;
        case 500:
          errorMessage = error.error?.error || 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en FileComparisonService:', error);
    return throwError(() => new Error(errorMessage));
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getFileIcon(extension: string): string {
    const icons: { [key: string]: string } = {
      '.txt': '📄',
      '.csv': '📊',
      '.json': '📋',
      '.xlsx': '📈',
      '.xls': '📈',
      '.docx': '📄'
    };
    return icons[extension.toLowerCase()] || '📄';
  }


}
