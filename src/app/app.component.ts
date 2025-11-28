import { Component,OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DialogService, WindowModule } from "@progress/kendo-angular-dialog";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AuthService } from './services/auth.service';
import { DialogModule} from '@progress/kendo-angular-dialog';
import { ClaudeComponent } from './views/claude/claude.component';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { FabGlobalComponent } from "./views/home/fab-global/fab-global.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WindowModule, TooltipModule, DialogModule, KENDO_LAYOUT, FabGlobalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // public image = "https://github.com/cabarronc/RecursosMultimedia/blob/main/inversiones.png?raw=true";
   public image:string = "assets/inversiones.png";
  title = 'dgip-front';
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService
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
 
    abrirInterfaz() {
      this.dialogService.open({
        title: 'Centro de Datos',
        content: ClaudeComponent,   // Cargas tu componente aquí
        width: 800,
        height: 600
      });
    }
}
