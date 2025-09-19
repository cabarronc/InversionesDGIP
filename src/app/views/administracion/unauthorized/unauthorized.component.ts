import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [KENDO_BUTTONS],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
   constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/principal']);
  }

}
