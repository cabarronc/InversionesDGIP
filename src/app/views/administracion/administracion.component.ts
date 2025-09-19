import { Component, ViewEncapsulation } from '@angular/core';
import {fileWordIcon,menuIcon, chartBarClusteredIcon, SVGIcon,fileExcelIcon,userIcon,myspaceIcon,lockIcon} from '@progress/kendo-svg-icons';
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { DrawerItem, DrawerSelectEvent } from "@progress/kendo-angular-layout";
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { UserManagementComponent} from "../administracion/user-management/user-management.component"

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [NavBarComponent,KENDO_BUTTONS, KENDO_INDICATORS, KENDO_LAYOUT,UserManagementComponent ],
  templateUrl: './administracion.component.html',
    encapsulation: ViewEncapsulation.None,
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent {
  data:any;
  public isDisabled = false;
  public selected = "Cicular";
  public wordIcon: SVGIcon = fileWordIcon;
  public menuSvg: SVGIcon = menuIcon;
  public userIcon: SVGIcon = userIcon;
  public myspaceIcon: SVGIcon = myspaceIcon;
  public items: Array<DrawerItem> = [
    { text: "Gestion de Usuarios", svgIcon: userIcon, selected: true },
    { separator: true },
    { text: "Gestion de Roles", svgIcon: myspaceIcon},
    { separator: true },
    { text: "Gestion de Permisos", svgIcon: lockIcon },
    { separator: true },
 
  ];
  constructor() {    
  }
  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }
}
