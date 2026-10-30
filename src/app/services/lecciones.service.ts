import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IndicadoresGenerales {
  total_proyectos: number;
  indice_cumplimiento: number;
  evaluaciones_realizadas: number;
  evaluaciones_sin_evaluar: number;
  total_evaluaciones: number;
  porcentaje_evaluado: number;
}

export interface IndicadorCategoria {
  Categoría: string;
  total_evaluaciones: number;
  evaluaciones_validas: number;
  suma_resultados: number;
  sin_evaluar: number;
  indice_cumplimiento: number;
  porcentaje_evaluado: number;
}

export interface IndicadorConcepto {
  Categoría: string;
  'Concepto a valorar': string;
  total_proyectos: number;
  respuestas_si: number;
  respuestas_parcialmente: number;
  respuestas_no: number;
  sin_evaluar: number;
  indice_cumplimiento: number;
  porcentaje_evaluado: number;
}

export interface IndicadorDependencia {
  Dep: string;
  total_proyectos: number;
  total_evaluaciones?: number;
  evaluaciones_validas?: number;
  respuestas_si: number;
  respuestas_parcialmente: number;
  respuestas_no: number;
  suma_resultados:number;
  sin_evaluar: number;
  indice_cumplimiento: number;
  porcentaje_evaluado: number;
}

export interface IndicadorDependenciaCategoria
  extends IndicadorDependencia {
  Categoría: string;
}

export interface RespuestaConsolidacionLecciones {
  ruta: string;
  datos: any[];
  archivo: string;
  nombreArchivo: string;
  indicadores: IndicadoresGenerales;
  indicadores_categoria: IndicadorCategoria[];
  indicadores_concepto: IndicadorConcepto[];
  indicadores_dependencia: IndicadorDependencia[];
  indicadores_dep_categoria: IndicadorDependenciaCategoria[];
  fecha_modificacion:string;
}

@Injectable({
  providedIn: 'root',
})
export class LeccionesService {

  constructor(private http: HttpClient) {


  }
  private apiUrl = environment.apiUrl;// URL de tu API Flask
   GenerarDescargasLecciones(): Observable<RespuestaConsolidacionLecciones> {
    return this.http.get<RespuestaConsolidacionLecciones>(
      `${this.apiUrl}/lecciones/consolidacion`
    );
  }

  ObtenerArchivosLecciones(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/lecciones/archivos`);
  }

  DescargarArchivoLecciones(nombreArchivo: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/lecciones/descargar/${encodeURIComponent(nombreArchivo)}`,
      { responseType: 'blob' }
    );
  }

}
