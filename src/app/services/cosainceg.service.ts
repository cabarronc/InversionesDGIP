import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CosaincegService {
  private apiUrl = environment.apiUrl;// URL de tu API Flask

  constructor(private http: HttpClient) { }

  // 📌 COSAINCEG
  GenerarCosainceg(fecha: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post<any>(`${this.apiUrl}/GetReporteCosainceg`, body, { headers });
  }
   // 📌 Deuda
  GenerarDeuda(fecha: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post<any>(`${this.apiUrl}/GetReporteDeuda`, body, { headers });
  }
    // 📌 Método para enviar el JSON al backend
  GenerarDescargasCosainceg(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegGeneral/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

    GenerarDescargasCosaincegDep(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegDependencia/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

      GenerarDescargasDeudaDep(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasDeudaDependencia/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }


      GenerarDescargasCosaincegRub(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegRubro/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

      GenerarDescargasCosaincegRecurso(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasCosaincegRecurso/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  GenerarDescargasDeudaRecurso(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasDeudaRecurso/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

    GenerarDescargasDeuda(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/GetDescargasDeudaGeneral/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  //    GenerarDescargasDeudaMetas(fecha: any,filename: string): Observable<Blob> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = { fecha }; // crea objeto JSON con clave "fecha"
  //   return this.http.post(`${this.apiUrl}/GetDescargasDeudaMetas/${filename}`, body, {
  //     headers,
  //     responseType: 'blob'
  //   }) as Observable<Blob>;
  // }
  GenerarDescargasDeudaMetas(fecha: any, filename: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { fecha };
  return this.http.post(`${this.apiUrl}/GetDescargasDeudaMetas/${filename}`, body);
}
// //Hojas de Trabajo
// GenerarDescargasInversionHojaTrabajo(fecha: any, filename: string): Observable<Blob> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//   const body = { fecha };
//   return this.http.post(`${this.apiUrl}/InversionesGeneralHojasTrabajo/${filename}`, body, {
//       headers,
//       responseType: 'blob'
//     })as Observable<Blob>;
// }
// Hojas de Trabajo
GenerarDescargasInversionHojaTrabajo(fecha: any, filename: string): Observable<HttpResponse<Blob>> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { fecha };

  return this.http.post(
    `${this.apiUrl}/InversionesGeneralHojasTrabajo/${filename}`,
    body,
    {
      headers,
      responseType: 'blob',
      observe: 'response'  // 👈 NECESARIO PARA RECIBIR HEADERS
    }
  ) as Observable<HttpResponse<Blob>>;
}

//Entregables
  GenerarDescargasInversionEntregables(fecha: any,filename: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post(`${this.apiUrl}/InversionesGeneralEntregables/${filename}`, body, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }
    InversionCopy(fecha: any): Observable<any> {
       const body = { fecha }
    return this.http.post(`${this.apiUrl}/GetInversionCopy`,body);
  }

      GetCascaron(fecha: any): Observable<any> {
       const body = { fecha }
    return this.http.post(`${this.apiUrl}/GetCascaron`,body);
  }


  GetCatalogoRubros(filename: string): Observable<Blob>{
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/GetCatalogoRubros/${filename}.xlsx`, null, {
      headers,
      responseType: 'blob'
    }) as Observable<Blob>
  }

    // 📌 Método para enviar el JSON al backend
  ActualizarRubros(fecha: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { fecha }; // crea objeto JSON con clave "fecha"
    return this.http.post<any>(`${this.apiUrl}/GetActualizacionRubros`, body, { headers });
  }

}
