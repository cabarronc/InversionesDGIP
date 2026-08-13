
export interface ProgresoProcesamiento {
  total: number;
  procesados: number;
  errores: number;
  porcentaje: number;
  archivo_actual: string | null;
   detalle_errores: ErrorProcesamiento[];
}


export interface ResultadoProcesamiento {
  zip: number;
  rar: number;
  total_comprimidos: number;
  archivos_extraidos: number;
  errores: number;
  procesados: number;
  log: string;
}


export interface TrabajoProcesamiento {
  job_id: string;
  anio: number;

  estado:
    | 'pendiente'
    | 'procesando'
    | 'completado'
    | 'error';

  inicio: string | null;
  fin: string | null;

  progreso: ProgresoProcesamiento;

  resultado: ResultadoProcesamiento | null;

  error: string | null;
}


export interface IniciarProcesamientoResponse {
  ok: boolean;
  mensaje: string;
  job_id: string;
  anio: number;
  estado: string;
}


export interface EstadoProcesamientoResponse {
  ok: boolean;
  trabajo: TrabajoProcesamiento;
}

export interface ErrorProcesamiento {

  archivo: string;

  mensaje: string;

}