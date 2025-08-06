import { Component } from '@angular/core';
import { KENDO_UPLOADS } from "@progress/kendo-angular-upload";
import { environment } from '../../../environments/environment';
@Component({
  selector: 'my-uploads',
  standalone: true,
  imports: [KENDO_UPLOADS],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss'
})
export class UploadsComponent {
private apiUrl = environment.apiUrl;// URL de tu API Flask
 public uploadSaveUrl = `${this.apiUrl}/upload`; // should represent an actual API endpoint
public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint
}
