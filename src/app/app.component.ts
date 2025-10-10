import { Component,OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { WindowModule } from "@progress/kendo-angular-dialog";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,WindowModule,TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dgip-front';
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
    ngOnInit(): void {
    // Opcional: Configurar interceptores o inicializaciones globales
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Lógica adicional para navegación
        console.log('Navegación completada:', event.url);
      }
    });
  }
}
