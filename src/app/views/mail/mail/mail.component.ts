import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { MailApiService } from '../../../services/mail-api.service';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { HttpClientModule } from "@angular/common/http";
import { PocketbaseService } from '../../../services/pocketbase.service';
import { FormsModule } from '@angular/forms';

import { ChipModule } from 'primeng/chip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonDirective } from 'primeng/button';

import { MessageService } from 'primeng/api';
interface Contact {
  email: string;
  nombre: string;
  dependencia: string;
}
interface DataContact {
  email: string;
  nombre: string;
  dependencia: string;
}

@Component({
    selector: 'app-mail',
    imports: [NavBarComponent, HttpClientModule, ChipModule,
        ToggleSwitchModule, InputTextModule, AutoCompleteModule, TextareaModule, FloatLabelModule, DividerModule, CardModule, FileUploadModule, ButtonDirective, FormsModule],
    templateUrl: './mail.component.html',
    styleUrl: './mail.component.scss'
})
export class MailComponent implements OnInit {

  subject: string = '';
  subjects: string[] = [];
  public checked = true;
  messages: string[] = [];
  attachments: File[][] = []; //Arrego donde guardo los archivos
  tasks: any[] = [];  //Array donde traigo toda la info de PocketBase
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContact: Contact | null = null;
  pivote: DataContact[] = []
  public selectedContacts: string[] = []; // Manejo del array de seleccion de contacto
  public selectedContacts2: DataContact[] = []; //Mamnejo de Informacion adicional
  public enviar_disable: boolean = true;

  constructor(private emailService: MailApiService,  private pocketBaseService: PocketbaseService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadTasks();
  }
  // public valueChange(contact: string): void {
  //   if (contact === "") {
  //     return;
  //   }
  //   const contactData = this.contacts.find((c) => c.nombre.toLowerCase().includes(contact.toLocaleLowerCase()) );
  //   const contactData2 = this.pivote.find((c) => c.nombre.toLowerCase().includes(contact.toLocaleLowerCase()) );
  //   if (contactData2  && !this.selectedContacts.includes(contactData2.email)) {
  //     const newContact: DataContact = contactData2;
  //     this.selectedContacts2.push(newContact);
  //     console.log(this.selectedContacts2)
  //   } else {
  //     this.notificationService.show({
  //       content: "Ya se agrego a esta persona",
  //       hideAfter: 3500,
  //       animation: { type: "slide", duration: 900 },
  //       type: { style: "warning", icon: true },
  //       position: { horizontal: "center", vertical: "top" },
  //     });
  //   }
  //   if (contactData && !this.selectedContacts.includes(contactData.email)) {
  //     this.selectedContacts.push(contactData.email);
  //     console.log(this.selectedContacts)
  //   }
  //   this.list?.reset();
  // }



  // public onRemove(e: ChipRemoveEvent): void {
  //   const index = this.selectedContacts
  //     .map((c) => c)
  //     .indexOf(e.sender.label);
  //   this.selectedContacts.splice(index, 1);
  //   this.selectedContacts2.splice(index, 1);
  // }
  filterContacts(event: any): void {
    const query = event.query.toLowerCase();

    this.filteredContacts = this.contacts.filter(contact =>
      contact.nombre.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  }

  public valueChange(contact: Contact): void {

    if (!contact) {
      return;
    }

    const contactData = this.contacts.find(
      c => c.email === contact.email
    );

    const contactData2 = this.pivote.find(
      c => c.email === contact.email
    );

    if (
      contactData2 &&
      !this.selectedContacts.includes(contactData2.email)
    ) {

      const newContact: DataContact = contactData2;

      this.selectedContacts2.push(newContact);

      console.log(this.selectedContacts2);

    } else if (contactData2) {

      this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Ya se agrego a esta persona',
                life: 3500
              });
    }

    if (
      contactData &&
      !this.selectedContacts.includes(contactData.email)
    ) {
      this.selectedContacts.push(contactData.email);

      console.log(this.selectedContacts);
    }

    // Limpiar el AutoComplete
    this.selectedContact = null;
  }
  public onRemove(contact: string): void {

    const index = this.selectedContacts.indexOf(contact);

    if (index !== -1) {
      this.selectedContacts.splice(index, 1);
      this.selectedContacts2.splice(index, 1);
    }

  }
  addRecipient(email: string) {
    if (email) {
      this.selectedContacts.push(email);
      this.messages.push(''); // Añadir mensaje vacío por cada destinatario
    }
  }

  updateMessage(index: number, event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.messages[index] = value;
    console.log(`Mensaje actualizado en el índice ${index}: ${value}`);
  }
  // updateSubject(index: number, event: Event):void {
  //   const target = event.target as HTMLInputElement;
  //   const value = target.value;
  //   this.subjects[index] = value;
  //   console.log(`Asunto actualizado en el índice ${index}: ${value}`);
  // }
  updateSubject(index: number, value: string): void {
    this.subjects[index] = value;

    console.log(
      `Asunto actualizado en el índice ${index}: ${value}`
    );
  }


  // onFileSelected(idx: number, event: any): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     // Convierte la lista de archivos en un arreglo y los agrega a attachments
  //     const files = Array.from(input.files);

  //     if (!this.attachments[idx]) {
  //       this.attachments[idx] = []; // Inicializa si no existe
  //     }
  //     // Agrega los archivos seleccionados al índice correspondiente
  //     this.attachments[idx] = [...this.attachments[idx], ...files];
  //     console.log(`Archivos seleccionados para el índice ${idx}:`, this.attachments[idx]);
  //   }
  // }
  // public removeFile(contactIndex: number, fileIndex: number): void {
  //   this.attachments[contactIndex].splice(fileIndex, 1);
  //   console.log(`Archivo eliminado para el índice ${contactIndex}`);
  // }
  onFileSelected(idx: number, event: any): void {

    if (!event.files || event.files.length === 0) {
      return;
    }

    if (!this.attachments[idx]) {
      this.attachments[idx] = [];
    }

    const files: File[] = event.files;

    this.attachments[idx] = [
      ...this.attachments[idx],
      ...files
    ];

    console.log(
      `Archivos seleccionados para el índice ${idx}:`,
      this.attachments[idx]
    );
  }


  public removeFile(contactIndex: number, fileIndex: number): void {

    if (!this.attachments[contactIndex]) {
      return;
    }

    this.attachments[contactIndex].splice(fileIndex, 1);

    console.log(
      `Archivo eliminado para el índice ${contactIndex}:`,
      this.attachments[contactIndex]
    );
  }



  sendEmails() {
    console.log("destinatarios:", this.selectedContacts)
    console.log("Asunto:", this.subject)
    console.log("Asunto2:", this.subjects)
    console.log("Mensaje:", this.messages)
    console.log("Archivos:", this.attachments)
    this.enviar_disable = false;
    if (this.checked == true) {
      this.emailService
        .sendEmails(this.selectedContacts, this.subject, this.messages, this.attachments)
        .subscribe(
          (response) => {
            this.enviar_disable = true;
            if (response.results[0].status == "success") {
              console.log("respuesta", response.results[0].status)
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Correos enviados con éxito',
                life: 3500
              });
              this.selectedContacts = [];
              this.subject = '';
              this.messages = [];
              this.attachments = [];
            }
            else {
              this.enviar_disable = true;
              console.log("respuesta", response.results[0].status)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Alguno de los correos no se enviaron',
                life: 3500
              });

            }
            console.log("respuesta", response)
          },
          (error) => {
            this.enviar_disable = true;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar correos',
                life: 3500
              });
          }
        );
    }
    else {
      this.emailService
        .sendEmails2(this.selectedContacts, this.subjects, this.messages, this.attachments)
        .subscribe(
          (response) => {
            this.enviar_disable = true;
            console.log("respuesta", response)
            if (response.results[0].status == "success") {
              console.log("respuesta", response.results[0].status)
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Correos enviados con éxito',
                life: 3500
              });
              this.selectedContacts = [];
              this.subjects = [];
              this.messages = [];
              this.attachments = [];
            }
            else {
              this.enviar_disable = true;
              console.log("respuesta", response)
              console.log("respuesta", response.results[0].status)
                 this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Alguno de los correos no se enviaron',
                life: 3500
              });

            }
            console.log("respuesta", response)
          },
          (error) => {
            this.enviar_disable = true;
           this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar correos',
                life: 3500
              });
          }
        );

    }
  }

  loadTasks() {
    this.pocketBaseService.getCollectionData().then(
      (data) => {
        this.tasks = data;
        this.contacts = data.map((item: any): Contact => ({
          email: item.email,
          nombre: item.nombre,
          dependencia: item.dependencia
        }));
        this.pivote = data.map((item: any): DataContact => ({
          email: item.email,
          nombre: item.nombre,
          dependencia: item.dependencia,
        }));
        console.log('Tareas cargadas:', this.tasks);
        console.log('Correos:', this.contacts);
        console.log('Pivote:', this.pivote);
      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }
}
