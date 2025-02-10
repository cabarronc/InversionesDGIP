import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MailApiService {

  // private apiUrl = 'http://172.31.33.28:5000/send-email-gmail'; // URL del backend
  // private apiUrl_2 = 'http://172.31.33.28:5000/send-email-gmail_2'; // URL del backend
  private apiUrl = environment.apiUrl_G1;
  private apiUrl_2 = environment.apiUrl_G2;

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
  sendEmails2(recipients: string[], subjects: string[], messages: string[], attachments: File[][]): Observable<any> {
    const formData = new FormData();
        // Agregar destinatarios al FormData
        recipients.forEach(recipient => {
          formData.append('recipients', recipient);
        });
        // Agregar asunto al FormData
        subjects.forEach(subjects => {
          formData.append('subjects', subjects);
        });
      //  formData.append('subject', subject);

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
   return this.http.post(this.apiUrl_2, formData);
  }
}
