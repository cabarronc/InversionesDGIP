import { Component, ViewEncapsulation } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import {fileWordIcon,menuIcon, chartBarClusteredIcon, SVGIcon,fileExcelIcon,graphIcon,alignJustifyIcon, aggregateFieldsIcon,fileWrenchIcon} from '@progress/kendo-svg-icons';
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { DrawerItem, DrawerSelectEvent } from "@progress/kendo-angular-layout";
import { CircularContentComponent } from "./circular-content/circular-content.component";

@Component({
  selector: 'app-circular',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, KENDO_LAYOUT, CircularContentComponent],
  templateUrl: './circular.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './circular.component.scss'
})
export class CircularComponent {
  data:any;
  public isDisabled = false;
  public selected = "Cicular";
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public items: Array<DrawerItem> = [
    { text: "Circular", svgIcon: fileWordIcon, selected: true },
    { separator: true },
    { text: "Indicadores", svgIcon: chartBarClusteredIcon},
    { separator: true },
    { text: "Seguimiento Actividades Vencidas", svgIcon: fileExcelIcon },
    { separator: true },
    { text: "Seguimiento Fuentes", svgIcon: fileExcelIcon },
    { separator: true },
    { text: "Seguimiento Integrado", svgIcon: fileExcelIcon },
    { separator: true },
    { text: "Graficos", svgIcon: graphIcon },
    { separator: true },
    { text: "Puntos de Atencion", svgIcon: alignJustifyIcon },
    { separator: true },
    { text: "Integracion", svgIcon: aggregateFieldsIcon },
    { separator: true },
    { text: "Comparacion", svgIcon: fileWrenchIcon },
  ];
  constructor() {    
  }
  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }

}
