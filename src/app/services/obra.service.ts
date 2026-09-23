import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObraService {
    private apiUrl = environment.apiUrl;// URL de tu API Flask

  constructor(private http: HttpClient) {
    
    
  }
    GenerarDescargasObra  (filename: string): Observable<HttpResponse<Blob>> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     
      return this.http.post(`${this.apiUrl}/GetObraDatos/${filename}`,{}, {
        headers,
        responseType: 'blob', 
        observe: 'response'
      }) as Observable<HttpResponse<Blob>>;
    }

    GetObra(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetObraEstuctura`);
  }
  
}
