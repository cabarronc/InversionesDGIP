import {
  Component,
  OnDestroy
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Subscription, interval } from 'rxjs';

import {
  switchMap,
  startWith
} from 'rxjs/operators';

import { ProcesamientoService } from '../../../services/procesamiento.service';

import {
  TrabajoProcesamiento
} from '../../../models/procesamiento.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-procesamiento',
  standalone: true,
  imports: [DecimalPipe,FormsModule],
  templateUrl: './procesamiento.component.html',
  styleUrl: './procesamiento.component.scss'
})
export class ProcesamientoComponent implements OnDestroy {
   // ==========================================================
  // DATOS DEL FORMULARIO
  // ==========================================================

  anio: number = new Date().getFullYear();


  // ==========================================================
  // ESTADO
  // ==========================================================

  trabajo: TrabajoProcesamiento | null = null;


  cargando = false;


  mensaje = '';


  error = '';


  // ==========================================================
  // POLLING
  // ==========================================================

  private estadoSubscription?: Subscription;


  constructor(
    private procesamientoService:
      ProcesamientoService
  ) {}


  // ==========================================================
  // INICIAR
  // ==========================================================

  iniciar(): void {

    if (!this.anio) {

      this.error =
        'Debes indicar un año.';

      return;
    }


    this.error = '';

    this.mensaje =
      'Iniciando procesamiento...';

    this.cargando = true;


    this.procesamientoService
      .iniciarProcesamiento(this.anio)
      .subscribe({

        next: (respuesta) => {

          this.mensaje =
            respuesta.mensaje;


          // --------------------------------------------------
          // Crear estado inicial
          // --------------------------------------------------

          this.trabajo = {

            job_id:
              respuesta.job_id,

            anio:
              respuesta.anio,

            estado:
              'pendiente',

            inicio:
              null,

            fin:
              null,

            progreso: {

              total: 0,

              procesados: 0,

              errores: 0,

              porcentaje: 0,

              archivo_actual: null,

              mensaje_actual: '',

              detalle_errores: []

            },

            resultado:
              null,

            error:
              null

          };


          // --------------------------------------------------
          // Empezar consulta periódica
          // --------------------------------------------------

          this.iniciarConsultaEstado(
            respuesta.job_id
          );

        },


        error: (err) => {

          this.cargando = false;

          this.error =
            err?.error?.mensaje
            ??
            'No se pudo iniciar el procesamiento.';

        }

      });

  }


  // ==========================================================
  // CONSULTAR ESTADO CADA 2 SEGUNDOS
  // ==========================================================

  private iniciarConsultaEstado(
    jobId: string
  ): void {

    this.detenerConsultaEstado();


    this.estadoSubscription = interval(2000)

      .pipe(

        startWith(0),

        switchMap(() =>
          this.procesamientoService
            .obtenerEstado(jobId)
        )

      )

      .subscribe({

        next: (respuesta) => {

          this.trabajo =
            respuesta.trabajo;


          // ------------------------------------------------
          // TERMINÓ
          // ------------------------------------------------

          if (

            this.trabajo.estado ===
              'completado'

            ||

            this.trabajo.estado ===
              'error'

          ) {

            this.cargando = false;

            this.detenerConsultaEstado();


            if (

              this.trabajo.estado ===
                'completado'

            ) {

              this.mensaje =
                'Procesamiento terminado correctamente.';

            }


            if (

              this.trabajo.estado ===
                'error'

            ) {

              this.error =
                this.trabajo.error
                ??
                'El procesamiento terminó con error.';

            }

          }

        },


        error: (err) => {

          console.error(
            'Error consultando estado:',
            err
          );

        }

      });

  }


  // ==========================================================
  // DETENER POLLING
  // ==========================================================

  private detenerConsultaEstado(): void {

    if (
      this.estadoSubscription
    ) {

      this.estadoSubscription.unsubscribe();

      this.estadoSubscription = undefined;

    }

  }


  // ==========================================================
  // CANCELAR VISUALIZACIÓN
  // ==========================================================

  limpiar(): void {

    this.detenerConsultaEstado();

    this.trabajo = null;

    this.mensaje = '';

    this.error = '';

    this.cargando = false;

  }


  // ==========================================================
  // DESTRUIR COMPONENTE
  // ==========================================================

  ngOnDestroy(): void {

    this.detenerConsultaEstado();

  }

}
