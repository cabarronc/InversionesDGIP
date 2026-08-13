import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  IniciarProcesamientoResponse,
  EstadoProcesamientoResponse,
  TrabajoProcesamiento
} from '../models/procesamiento.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProcesamientoService {

  private readonly API_URL =
     environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // INICIAR PROCESAMIENTO
  // ==========================================================

  iniciarProcesamiento(
    anio: number
  ): Observable<IniciarProcesamientoResponse> {

    return this.http.post<IniciarProcesamientoResponse>(
      `${this.API_URL}/procesar`,
      {
        anio: anio
      }
    );
  }


  // ==========================================================
  // CONSULTAR ESTADO
  // ==========================================================

  obtenerEstado(
    jobId: string
  ): Observable<EstadoProcesamientoResponse> {

    return this.http.get<EstadoProcesamientoResponse>(
      `${this.API_URL}/procesar/estado/${jobId}`
    );
  }


  // ==========================================================
  // LISTAR PROCESAMIENTOS
  // ==========================================================

  listarProcesamientos():
    Observable<{
      ok: boolean;
      trabajos: TrabajoProcesamiento[];
    }> {

    return this.http.get<{
      ok: boolean;
      trabajos: TrabajoProcesamiento[];
    }>(
      `${this.API_URL}/procesar`
    );
  }

}
