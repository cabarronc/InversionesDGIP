import { Component } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { fileWordIcon,menuIcon, chartBarClusteredIcon, SVGIcon,fileExcelIcon,graphIcon,alignJustifyIcon,plusCircleIcon,minusIcon, fileConfigIcon, parameterDateTimeIcon, stickyNoteIcon, plusIcon} from '@progress/kendo-svg-icons';
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { DrawerItem, DrawerSelectEvent } from "@progress/kendo-angular-layout";
import { AdecuacionesContentComponent } from "../adecuaciones-content/adecuaciones-content.component";

@Component({
  selector: 'app-adecuaciones',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_INDICATORS, KENDO_LAYOUT, NavBarComponent, AdecuacionesContentComponent],
  templateUrl: './adecuaciones.component.html',
  styleUrl: './adecuaciones.component.scss'
})
export class AdecuacionesComponent {
  data:any;
  public isDisabled = false;
  public selected = "Cicular";
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public plusCircleIcon: SVGIcon = plusCircleIcon;
  public minusIcon: SVGIcon = minusIcon;
  public plusIcon: SVGIcon = plusIcon;
  public items: Array<DrawerItem> = [
    { text: "Ampliaciones", svgIcon: plusIcon, selected: true },
    { separator: true },
    { text: "Reducciones", svgIcon: minusIcon},
    { separator: true },
    { text: "Ajustes de Metas", svgIcon: fileConfigIcon },
    { separator: true },
    { text: "Prorrogas", svgIcon: parameterDateTimeIcon },
    { separator: true },
    { text: "Solicitudes de Afectacion Presupuestal", svgIcon: stickyNoteIcon },
    { separator: true },
    // { text: "Graficos", svgIcon: graphIcon },
    // { separator: true },
    // { text: "Puntos de Atencion", svgIcon: alignJustifyIcon },
    // { separator: true },
    // { text: "Integracion", svgIcon: alignJustifyIcon },
  ];
  constructor() {    
  }
  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }
}
