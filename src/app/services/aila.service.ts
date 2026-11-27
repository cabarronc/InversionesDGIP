import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export type TipoAnalisis = 'analitico' | 'cualitativo' | 'proyecto';
export type CampoTexto = 'situacion' | 'acciones' | 'leccion';
export interface FiltrosAnaliticos {
  dependencias?: string[]; proyectos?: string[]; categorias?: string[]; conceptos?: string[];
}
export interface RespuestaAILA {
  tipo: TipoAnalisis;
  estado: string;
  mensaje?: string;
  total_experiencias_seleccionadas?: number;
  resultado: ResultadoAILA | null;
}
export interface Auditoria {
  segundos_total?: number; consultas?: number; cache?: number; bloques?: number;
  [clave: string]: unknown;
}
export interface Evidencia {
  id: string; proyecto_q?: string; resultado?: string | null;
  situacion?: string | null; acciones?: string | null; leccion?: string | null;
}
export interface CasoRepresentativo {
  id?: string; proyecto_q?: string; motivo?: string; valoracion_normalizada?: string;
  evidencia?: { campo?: string; cita?: string };
  factores_reportados?: { campo?: string; cita?: string }[];
  causas_o_factores?: string; acciones_registradas?: string;
  contraste_con_valoracion?: string; presente_en_ambos_grupos?: boolean;
  fuente_fragmentada?: boolean;
}
export interface Sintesis {
  resumen?: string; conclusion?: string; informe?: string;
  conclusiones_por_campo?: Partial<Record<CampoTexto, string>>;
  estado_sintesis?: string; nota_sintesis?: string; sin_texto_informativo?: boolean;
  advertencias?: unknown[]; advertencias_casos?: unknown[]; limitaciones?: unknown[];
  coincidencias?: unknown[]; auditoria?: Auditoria;
  casos_representativos?: { favorables?: CasoRepresentativo[]; con_dificultades?: CasoRepresentativo[] };
  cobertura_resumen?: Partial<Record<CampoTexto, unknown>>;
}
export interface ConceptoAILA {
  concepto: string; concepto_id?: string; total_experiencias?: number;
  resultados?: Record<string, number>; analisis_cualitativo?: Sintesis;
  evidencias?: Evidencia[];
  referencias_evidencias?: { id: string; proyecto_q: string }[];
}
export interface CategoriaAILA extends Sintesis {
  categoria: string; total_experiencias?: number; total_conceptos?: number;
  conceptos?: ConceptoAILA[];
}
export interface ResultadoAILA extends Sintesis {
  estado?: string; proyecto_q?: string; estado_contenido?: string; requiere_revision?: boolean;
  categorias?: CategoriaAILA[]; errores?: unknown[]; errores_analisis?: unknown[];
  incidencias_sintesis?: unknown[]; cobertura?: unknown;
  total_experiencias?: number; total_experiencias_procesadas?: number;
  total_evidencias_procesadas?: number; total_proyectos?: number;
  total_bloques_procesados?: number;
  sintesis_integrada?: { texto?: string; estado?: string; motivo?: string };
  resumen_general?: { total_experiencias?: number; total_proyectos?: number;
    total_dependencias?: number; total_categorias?: number; total_conceptos?: number };
  resultados_logro?: { total_validos?: number; si?: number; parcialmente?: number; no?: number; igc?: number | null };
  calidad_informacion?: Record<string, { completos?: number; vacios?: number; porcentaje_completitud?: number }>;
  experiencias_por_categoria?: { 'Categoría': string | null; total: number }[];
}

@Injectable({ providedIn: 'root' })
export class AilaService {
  private readonly apiUrl = environment.apiUrl.replace(/\/+$/, '');
  constructor(private http: HttpClient) {}

  analizar(filtros: FiltrosAnaliticos = {}): Observable<RespuestaAILA> {
    return this.http.post<RespuestaAILA>(`${this.apiUrl}/aila/analitico`, { filtros });
  }
  analizarConcepto(categoria: string, concepto: string): Observable<RespuestaAILA> {
    return this.http.post<RespuestaAILA>(`${this.apiUrl}/aila/cualitativo`, {
      categoria: categoria.trim(), concepto: concepto.trim()
    });
  }
  analizarProyecto(proyecto: string): Observable<RespuestaAILA> {
    return this.http.post<RespuestaAILA>(`${this.apiUrl}/aila/proyecto`, { proyecto: proyecto.trim() });
  }
  // Peticiones síncronas del backend. Sin retry ni timeout artificial:
  // repetir automáticamente un POST podría duplicar un análisis costoso.
}
