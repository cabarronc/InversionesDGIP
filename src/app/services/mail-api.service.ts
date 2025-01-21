import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailApiService {

  private apiUrl = 'http://172.31.33.28:5000/send-email-gmail'; // URL del backend

  constructor(private http: HttpClient) {}

  sendEmails(recipients: string[], subject: string, messages: string[], attachments: File[][]): Observable<any> {
    const formData = new FormData();
        // Agregar destinatarios al FormData
        recipients.forEach(recipient => {
          formData.append('recipients', recipient);
        });
        // Agregar asunto al FormData
       formData.append('subject', subject);

      // Agregar mensajes al FormData
      messages.forEach(message => {
        formData.append('messages', message);
      });
    //    // Agregar archivos adjuntos al FormData
    // attachments.forEach(attachment => {
    //   formData.append('attachments', attachment, attachment.name);
    // });

    // Agregar los archivos adjuntos al FormData
    attachments.forEach((fileList, idx) => {
      fileList.forEach((file, fileIdx) => {
        formData.append(`attachment_${idx}_${fileIdx}`, file, file.name); // 'attachment_idx_fileIdx' para diferenciarlos
      });
    });

   // Enviar la solicitud POST con FormData
   return this.http.post(this.apiUrl, formData);
  }
}
