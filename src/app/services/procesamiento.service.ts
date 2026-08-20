import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import {
  IniciarProcesamientoResponse,
  EstadoProcesamientoResponse,
  TrabajoProcesamiento
} from '../models/procesamiento.model';
import { environment } from '../../environments/environment';
const STORAGE_KEY = 'procesamiento_job_id';

@Injectable({
  providedIn: 'root'
})
export class ProcesamientoService {

  private readonly API_URL =
     environment.apiUrl;

       // ==========================================================
    // ESTADO COMPARTIDO (sobrevive aunque salgas del módulo,
    // porque el servicio es singleton -> providedIn: 'root')
    // ==========================================================

    private trabajoSubject = new BehaviorSubject<TrabajoProcesamiento | null>(null);
    trabajo$ = this.trabajoSubject.asObservable();

    private cargandoSubject = new BehaviorSubject<boolean>(false);
    cargando$ = this.cargandoSubject.asObservable();

    private mensajeSubject = new BehaviorSubject<string>('');
    mensaje$ = this.mensajeSubject.asObservable();

    private errorSubject = new BehaviorSubject<string>('');
    error$ = this.errorSubject.asObservable();

    private pollingSub?: Subscription;

  constructor(
    private http: HttpClient
  ) {
       // Si recargas la página (F5) y había un job en curso, lo retomamos
    const jobIdGuardado = localStorage.getItem(STORAGE_KEY);

    if (jobIdGuardado) {

      this.cargandoSubject.next(true);
      this.mensajeSubject.next('Reanudando procesamiento...');
      this.iniciarConsultaEstado(jobIdGuardado);

    }
  }


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

  // ==========================================================
  // NUEVO: orquesta iniciar + guardar estado + arrancar polling
  // El componente llama a ESTE método (no al de arriba directo)
  // ==========================================================

  iniciar(anio: number): void {

    this.errorSubject.next('');
    this.mensajeSubject.next('Iniciando procesamiento...');
    this.cargandoSubject.next(true);

    this.iniciarProcesamiento(anio).subscribe({

      next: (respuesta) => {

        this.mensajeSubject.next(respuesta.mensaje);

        this.trabajoSubject.next({

          job_id: respuesta.job_id,
          anio: respuesta.anio,
          estado: 'pendiente',
          inicio: null,
          fin: null,

          progreso: {
            total: 0,
            procesados: 0,
            errores: 0,
            porcentaje: 0,
            archivo_actual: null,
            mensaje_actual: '',
            detalle_errores: []
          },

          resultado: null,
          error: null

        });

        localStorage.setItem(STORAGE_KEY, respuesta.job_id);
        this.iniciarConsultaEstado(respuesta.job_id);

      },

      error: (err) => {

        this.cargandoSubject.next(false);

        this.errorSubject.next(
          err?.error?.mensaje
          ?? 'No se pudo iniciar el procesamiento.'
        );

      }

    });

  }
  // ==========================================================
  // NUEVO: polling cada 2s, vive aquí en vez de en el componente
  // ==========================================================

  private iniciarConsultaEstado(jobId: string): void {

    this.detenerConsultaEstado();

    this.pollingSub = interval(2000).pipe(

      startWith(0),

      switchMap(() => this.obtenerEstado(jobId))

    ).subscribe({

      next: (respuesta) => {

        this.trabajoSubject.next(respuesta.trabajo);

        if (
          respuesta.trabajo.estado === 'completado' ||
          respuesta.trabajo.estado === 'error'
        ) {

          this.cargandoSubject.next(false);
          this.detenerConsultaEstado();
          localStorage.removeItem(STORAGE_KEY);

          if (respuesta.trabajo.estado === 'completado') {
            this.mensajeSubject.next('Procesamiento terminado correctamente.');
          }

          if (respuesta.trabajo.estado === 'error') {
            this.errorSubject.next(
              respuesta.trabajo.error
              ?? 'El procesamiento terminó con error.'
            );
          }

        }

      },

      error: (err) => console.error('Error consultando estado:', err)

    });

  }


  private detenerConsultaEstado(): void {

    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;

  }


  // ==========================================================
  // NUEVO: limpiar estado (para el botón "Limpiar")
  // ==========================================================

  limpiar(): void {

    this.detenerConsultaEstado();
    this.trabajoSubject.next(null);
    this.mensajeSubject.next('');
    this.errorSubject.next('');
    this.cargandoSubject.next(false);
    localStorage.removeItem(STORAGE_KEY);

  }


}
