import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss'
})
export class DisclaimerComponent {
  @Output() accepted = new EventEmitter<boolean>();
    @Output() rejected = new EventEmitter<void>();
  @Output() configured = new EventEmitter<void>();

  visible = true;


  accept(): void {
    this.visible = false;
    this.accepted.emit(false);
  }


  close(): void {
    this.visible = false;
  }

}
