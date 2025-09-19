import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowModule } from "@progress/kendo-angular-dialog";
import { TooltipModule } from '@progress/kendo-angular-tooltip';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,WindowModule,TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dgip-front';
}
