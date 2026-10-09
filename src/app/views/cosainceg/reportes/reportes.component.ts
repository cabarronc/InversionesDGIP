import { Component, ViewEncapsulation } from '@angular/core';
import { CosaincegComponent } from "../cosainceg.component";
import { PermissionGuard } from '../../../guards/permission.guard';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-reportes',
    imports: [ CosaincegComponent, ButtonModule, MenuModule, DrawerModule],

    templateUrl: './reportes.component.html',
    styleUrl: './reportes.component.scss'
})
export class ReportesComponent {

     drawerVisible = true;
    public selected = "Cosainceg";


  items: MenuItem[] = [

    {
      label: 'Cosainceg',
      icon: 'pi pi-book',
      command: () => {
        this.selected = 'Cosainceg';
      }
    },
    { separator: true },
    {
      label: 'Deuda',
      icon: 'pi pi-dollar',
      command: () => {
        this.selected = 'Deuda';
      }
    },
    { separator: true },

        {
          label: 'Inversion',
          icon: 'pi pi-gauge',
          command: () => {
            this.selected = 'Inversion';
          }
        },
         { separator: true },
        {
          label: 'PPI',
          icon: 'pi pi-file-check',
          command: () => {
            this.selected = 'PPI';
          }
        },
        { separator: true },
        {
          label: 'AvanceFinanciero',
          icon: 'pi pi-percentage',
          command: () => {
            this.selected = 'AvanceFinanciero';
          }
        },

  ]
    constructor() {    
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
