import { Component, OnInit } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_APPBAR } from '@progress/kendo-angular-navigation';
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { shareIcon, SVGIcon, xIcon } from "@progress/kendo-svg-icons";
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { ClaudeComponent } from '../claude/claude.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_LAYOUT, KENDO_INPUTS,DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  public dialOpen = false;
  public image:string = "assets/inversiones.png";

  
  constructor(private dialogService: DialogService) {
    
  }
  abrirInterfaz() {
    this.dialogService.open({
      title: 'Centro de Datos',
      content: ClaudeComponent,   // Cargas tu componente aquí
      width: 800,
      height: 600
    });
  }
  ngOnInit() {
    
    // Llamar al método getData del servicio
    // this.apiService.getData().subscribe(
    //   (response) => {
    //     this.data = response;
    //     console.log('Datos obtenidos:', this.data);
    //   },
    //   (error) => {
    //     console.error('Error al obtener datos:', error);
    //   }
    // );
  }
   public get icon(): SVGIcon {
    return this.dialOpen ? xIcon : shareIcon;
  }

  public onDialOpen(): void {
    this.dialOpen = true;
  }

  public onDialClose(): void {
    this.dialOpen = false;
  }
 


}
