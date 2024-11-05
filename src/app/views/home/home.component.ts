import { Component, OnInit } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_APPBAR } from '@progress/kendo-angular-navigation';
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_BUTTONS, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  
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
 


}
