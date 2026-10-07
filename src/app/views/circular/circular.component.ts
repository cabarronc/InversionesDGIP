import { Component, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { fileWordIcon, menuIcon, chartBarClusteredIcon, SVGIcon, fileExcelIcon, graphIcon, alignJustifyIcon, aggregateFieldsIcon, fileWrenchIcon } from '@progress/kendo-svg-icons';
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { DrawerItem, DrawerSelectEvent } from "@progress/kendo-angular-layout";
import { CircularContentComponent } from "./circular-content/circular-content.component";
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-circular',
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, KENDO_LAYOUT, CircularContentComponent, ButtonModule, DrawerModule, MenuModule, AvatarModule, CardModule],
  templateUrl: './circular.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './circular.component.scss'
})
export class CircularComponent {
  data: any;
  public isDisabled = false;
  // public selected = "Cicular";
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  // public items: Array<DrawerItem> = [
  //   { text: "Circular", svgIcon: fileWordIcon, selected: true },
  //   { separator: true },
  //   { text: "Indicadores", svgIcon: chartBarClusteredIcon},
  //   { separator: true },
  //   { text: "Seguimiento Actividades Vencidas", svgIcon: fileExcelIcon },
  //   { separator: true },
  //   { text: "Seguimiento Fuentes", svgIcon: fileExcelIcon },
  //   { separator: true },
  //   { text: "Seguimiento Integrado", svgIcon: fileExcelIcon },
  //   { separator: true },
  //   { text: "Graficos", svgIcon: graphIcon },
  //   { separator: true },
  //   { text: "Puntos de Atencion", svgIcon: alignJustifyIcon },
  //   { separator: true },
  //   { text: "Integracion", svgIcon: aggregateFieldsIcon },
  //   { separator: true },
  //   { text: "Comparacion", svgIcon: fileWrenchIcon },
  // ];
  drawerVisible = true;

  selected: any;
  items: MenuItem[] = [

    {
      label: 'Circular',
      icon: 'pi pi-file-word',
      command: () => {
        this.selected = 'Circular';
      }
    },
    { separator: true },
    {
      label: 'Indicadores',
      icon: 'pi pi-check-square',
      command: () => {
        this.selected = 'Indicadores';
      }
    },
    { separator: true },

        {
          label: 'Actividades Vencidas',
          icon: 'pi pi-eye',
          command: () => {
            this.selected = 'Seguimiento Actividades Vencidas';
          }
        },
         { separator: true },
        {
          label: 'Fuentes',
          icon: 'pi pi-file-check',
          command: () => {
            this.selected = 'Seguimiento Fuentes';
          }
        },
        { separator: true },
        {
          label: 'Integrado',
          icon: 'pi pi-file',
          command: () => {
            this.selected = 'Seguimiento Integrado';
          }
        },
    { separator: true },
    {
      label: 'Graficos',
      icon: 'pi pi-chart-line',
      command: () => {
        this.selected = 'Graficos';
      }
    },
    { separator: true },
    {
      label: 'Puntos de Atencion',
      icon: 'pi pi-indent',
      command: () => {
        this.selected = 'Puntos de Atencion';
      }
    },
    { separator: true },
    {
      label: 'Integracion',
      icon: 'pi pi-file-plus',
      command: () => {
        this.selected = 'Integracion';
      }
    },
    { separator: true },
    {
      label: 'Comparacion',
      icon: 'pi pi-arrow-right-arrow-left',
      command: () => {
        this.selected = 'Comparacion';
      }
    }

  ]
  constructor() {
    this.selected = 'Circular';
  }
  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }

}
