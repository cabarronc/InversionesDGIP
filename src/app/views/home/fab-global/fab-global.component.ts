import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FloatingActionButtonModule,} from '@progress/kendo-angular-buttons';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { ClaudeComponent } from '../../claude/claude.component';
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS, DialItem } from "@progress/kendo-angular-buttons";
import { fileExcelIcon, SVGIcon, xIcon } from "@progress/kendo-svg-icons"


@Component({
  selector: 'app-fab-global',
  standalone: true,
  imports: [CommonModule,FloatingActionButtonModule,KENDO_LAYOUT,KENDO_BUTTONS],
  templateUrl: './fab-global.component.html',
  styleUrl: './fab-global.component.scss'
})
export class FabGlobalComponent {
public image = "https://github.com/cabarronc/RecursosMultimedia/blob/main/inversiones.png?raw=true";
  //  public image = "assets/inversiones.png";
public fileExcelIcon: SVGIcon = fileExcelIcon;
  constructor(private dialogService: DialogService) {}
    abrirInterfaz() {
      this.dialogService.open({
        title: 'Centro de Datos',
        content: ClaudeComponent,   // Cargas tu componente aquí
        width: 800,
        height: 600
      });
    }
}
