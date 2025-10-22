import { Component, ViewEncapsulation } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import {fileWordIcon,menuIcon, chartBarClusteredIcon, SVGIcon,fileExcelIcon,graphIcon,alignJustifyIcon, aggregateFieldsIcon,fileWrenchIcon} from '@progress/kendo-svg-icons';
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { DrawerItem, DrawerSelectEvent } from "@progress/kendo-angular-layout";
import { CosaincegComponent } from "../cosainceg.component";
import { PermissionGuard } from '../../../guards/permission.guard';
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, KENDO_LAYOUT, CosaincegComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
   data:any;
    public isDisabled = false;
    public selected = "Cicular";
    public wordIcon: SVGIcon = fileWordIcon;
    public menuSvg: SVGIcon = menuIcon;
    public items: Array<DrawerItem> = [
      { text: "Cosainceg", svgIcon: fileWordIcon, selected: true },
      { separator: true },
      { text: "Deuda", svgIcon: chartBarClusteredIcon},
      { separator: true }
    ];
    constructor() {    
    }
    public onSelect(ev: DrawerSelectEvent): void {
      this.selected = ev.item.text;
    }

}
// export class ReportesComponent {
//   public selected = 'Cosainceg';
//   public menuSvg: SVGIcon = menuIcon;

//   public items: Array<DrawerItem> = [];

//   constructor(private permissions: PermissionGuard) {
//     this.configurarMenu();
//   }

//   private configurarMenu(): void {
//     // 🔐 Agrega solo los ítems permitidos
//     if (this.permissions.hasPermission('cosainceg', 'manage')) {
//       this.items.push({ text: 'Cosainceg', svgIcon: fileWordIcon, selected: true });
//       this.selected = 'Cosainceg';
//     }

//     if (this.permissions.hasPermission('deuda', 'manage')) {
//       this.items.push({ separator: true });
//       this.items.push({ text: 'Deuda', svgIcon: chartBarClusteredIcon });
//     }
//   }

//   public onSelect(ev: DrawerSelectEvent): void {
//     this.selected = ev.item.text;
//   }
// }
