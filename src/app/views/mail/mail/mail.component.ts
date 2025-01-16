import { Component,  ViewEncapsulation, ViewChild} from '@angular/core';
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


@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [NavBarComponent,FormsModule,LabelModule,InputsModule, ButtonsModule,DropDownsModule],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss'
})
export class MailComponent {
  @ViewChild("contactslist") public list?: AutoCompleteComponent;
  subject: string = '';
  messages: string[] = [];
  
  public contacts: string[] = [
    "cabarronc@guanajuato.gob.mx" ,
    "alberto91barron@gmail.com",
    // "sezendejas@guanajuato.gob.mx"
    
  ];

  public selectedContacts: string[] = [];

  constructor(private emailService: MailApiService,private notificationService: NotificationService ) {}

  public valueChange(contact: string): void {
    if (contact === "") {
      return;
    }
    const contactData = this.contacts.find((c) => c === contact);

    if (contactData && !this.selectedContacts.includes(contactData)) {
      this.selectedContacts.push(contactData);
    }

    this.list?.reset();
  }

  public onRemove(e: ChipRemoveEvent): void {
    const index = this.selectedContacts
      .map((c) => c)
      .indexOf(e.sender.label);
    this.selectedContacts.splice(index, 1);
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

  sendEmails() {
    console.log("destinatarios:",this.selectedContacts)
    console.log("Asunto:",this.subject)
    console.log("Mensaje:",this.messages)
    this.emailService
      .sendEmails(this.selectedContacts, this.subject, this.messages)
      .subscribe(
        (response) => {
          this.notificationService.show({
            content: "Correos Enviados con exito",
            hideAfter: 3500,
            animation: { type: "slide", duration: 900 },
            type: { style: "success", icon: true },
            position: { horizontal: "center", vertical: "top" },
          });
    
           console.log("respuesta",response)
        },
        (error) => {
            this.notificationService.show({
              content: "No ",
              hideAfter: 3500,
              animation: { type: "slide", duration: 900 },
              type: { style: "error", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });
        }
      );
  }
}
