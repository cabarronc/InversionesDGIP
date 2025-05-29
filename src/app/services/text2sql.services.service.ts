import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Text2sqlServicesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  sendPrompt(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api2/text2sql`, { prompt });
  }
}
