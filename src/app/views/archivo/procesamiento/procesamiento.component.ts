import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ProcesamientoService } from '../../../services/procesamiento.service';
import { TrabajoProcesamiento } from '../../../models/procesamiento.model';

@Component({
  selector: 'app-procesamiento',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './procesamiento.component.html',
  styleUrl: './procesamiento.component.scss'
})
export class ProcesamientoComponent implements OnInit, OnDestroy {

  anio: number = new Date().getFullYear();

  trabajo: TrabajoProcesamiento | null = null;
  cargando = false;
  mensaje = '';
  error = '';

  private subs: Subscription[] = [];

  constructor(
    private procesamientoService: ProcesamientoService
  ) {}

  // Al entrar (o volver a entrar) al módulo, nos enganchamos
  // al estado que ya trae el servicio -> no se pierde nada
  ngOnInit(): void {

    this.subs.push(
      this.procesamientoService.trabajo$.subscribe(t => this.trabajo = t),
      this.procesamientoService.cargando$.subscribe(c => this.cargando = c),
      this.procesamientoService.mensaje$.subscribe(m => this.mensaje = m),
      this.procesamientoService.error$.subscribe(e => this.error = e),
    );

  }

  iniciar(): void {

    if (!this.anio) {
      this.error = 'Debes indicar un año.';
      return;
    }

    this.procesamientoService.iniciar(this.anio);

  }

  limpiar(): void {
    this.procesamientoService.limpiar();
  }

  // Solo cancela la suscripción DEL COMPONENTE a los observables
  // del servicio. El polling real sigue vivo en el servicio.
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}