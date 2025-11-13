import { Component, Input, } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-sustituciones-key',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-sustituciones-key.component.html',
  styleUrl: './results-sustituciones-key.component.scss'
})
export class ResultsSustitucionesKeyComponent {
   @Input() rowChanges: any;

  objectKeys = Object.keys;

}
