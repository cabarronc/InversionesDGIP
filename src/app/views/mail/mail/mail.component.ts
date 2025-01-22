import { Component,  ViewEncapsulation, ViewChild, OnInit} from '@angular/core';
import { MailApiService } from '../../../services/mail-api.service';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FormsModule } from '@angular/forms';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { AutoCompleteComponent } from "@progress/kendo-angular-dropdowns";
import { ChipRemoveEvent } from "@progress/kendo-angular-buttons";
import { NotificationService } from '@progress/kendo-angular-notification';
import { KENDO_UPLOADS } from "@progress/kendo-angular-upload";
import { HttpClientModule } from "@angular/common/http";
import { PocketbaseService } from '../../../services/pocketbase.service';
interface Contact {
  email: string;
  nombre: string;
}
interface DataContact {
  email: string;
  nombre: string;
  dependencia: string;
}

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [NavBarComponent,FormsModule,LabelModule,InputsModule, ButtonsModule,DropDownsModule,KENDO_UPLOADS,HttpClientModule],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss'
})
export class MailComponent implements OnInit {
  @ViewChild("contactslist") public list?: AutoCompleteComponent;
  subject: string = '';
  messages: string[] = []; 
  attachments: File[][] = []; //Arrego donde guardo los archivos
  tasks: any[] = [];  //Array donde traigo toda la info de PocketBase
  contacts: Contact[] = [];
  pivote: DataContact[] = []
  public selectedContacts: string[] = []; // Manejo del array de seleccion de contacto
  public selectedContacts2: DataContact[] = []; //Mamnejo de Informacion adicional

  constructor(private emailService: MailApiService,private notificationService: NotificationService, private pocketBaseService: PocketbaseService ) {}

  ngOnInit(): void {
    this.loadTasks();
  }
  public valueChange(contact: string): void {
    if (contact === "") {
      return;
    }
    const contactData = this.contacts.find((c) => c.nombre.toLowerCase().includes(contact.toLocaleLowerCase()) );
    const contactData2 = this.pivote.find((c) => c.nombre.toLowerCase().includes(contact.toLocaleLowerCase()) );
    if (contactData2  && !this.selectedContacts.includes(contactData2.email)) {
      const newContact: DataContact = contactData2;
      this.selectedContacts2.push(newContact);
      console.log(this.selectedContacts2)
    } else {
      this.notificationService.show({
        content: "Ya se agrego a esta persona",
        hideAfter: 3500,
        animation: { type: "slide", duration: 900 },
        type: { style: "warning", icon: true },
        position: { horizontal: "center", vertical: "top" },
      });
    }
    if (contactData && !this.selectedContacts.includes(contactData.email)) {
      this.selectedContacts.push(contactData.email);
      console.log(this.selectedContacts)
    }
    this.list?.reset();
  }

  public onRemove(e: ChipRemoveEvent): void {
    const index = this.selectedContacts
      .map((c) => c)
      .indexOf(e.sender.label);
    this.selectedContacts.splice(index, 1);
    this.selectedContacts2.splice(index, 1);
  }

  addRecipient(email: string) {
    if (email) {
      this.selectedContacts.push(email);
      this.messages.push(''); // Añadir mensaje vacío por cada destinatario
    }
  }

  updateMessage(index: number, event: Event):void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.messages[index] = value;
    console.log(`Mensaje actualizado en el índice ${index}: ${value}`);
  }


  onFileSelected(idx: number,event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Convierte la lista de archivos en un arreglo y los agrega a attachments
      const files = Array.from(input.files);

      if (!this.attachments[idx]) {
        this.attachments[idx] = []; // Inicializa si no existe
      }
      // Agrega los archivos seleccionados al índice correspondiente
      this.attachments[idx] = [...this.attachments[idx], ...files];
      console.log(`Archivos seleccionados para el índice ${idx}:`, this.attachments[idx]);
    }
  }
  public removeFile(contactIndex: number, fileIndex: number): void {
    this.attachments[contactIndex].splice(fileIndex, 1);
    console.log(`Archivo eliminado para el índice ${contactIndex}`);
  }
 
  
  sendEmails() {
    console.log("destinatarios:",this.selectedContacts)
    console.log("Asunto:",this.subject)
    console.log("Mensaje:",this.messages)
    console.log("Archivos:",this.attachments)
    this.emailService
      .sendEmails(this.selectedContacts, this.subject, this.messages,this.attachments)
      .subscribe(
        (response) => {
          if (response.results[0].status == "success"){
            console.log("respuesta",response.results[0].status)
            this.notificationService.show({
              content: "Correos Enviados con exito",
              hideAfter: 3500,
              animation: { type: "slide", duration: 900 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
          }
          else{
            console.log("respuesta",response.results[0].status)
            this.notificationService.show({
              content: "Alguno de los correos no se enviaron",
              hideAfter: 3500,
              animation: { type: "slide", duration: 900 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });

          }
           console.log("respuesta",response)
        },
        (error) => {
            this.notificationService.show({
              content: error,
              hideAfter: 3500,
              animation: { type: "slide", duration: 900 },
              type: { style: "error", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
        }
      );
  }

  loadTasks() {
    this.pocketBaseService.getCollectionData().then(
      (data) => {
        this.tasks = data;
        this.contacts = data.map((item: any):Contact => ({
          email: item.email,
          nombre: item.nombre,
        }));
        this.pivote = data.map((item: any):DataContact => ({
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
