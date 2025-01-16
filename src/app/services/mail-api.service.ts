import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailApiService {

  private apiUrl = 'http://172.31.33.28:5000/send-email-gmail'; // URL del backend

  constructor(private http: HttpClient) {}

  sendEmails(recipients: string[], subject: string, messages: string[]): Observable<any> {
    const payload = {
      recipients,
      subject,
      messages,
    };

    return this.http.post(this.apiUrl, payload);
  }
}
