import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowModule } from "@progress/kendo-angular-dialog";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,WindowModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dgip-front';
}
