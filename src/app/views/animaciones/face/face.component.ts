import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-face',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss'],
  animations: [
    trigger('faceState', [

      state('happy', style({
        backgroundColor: '#FFD93D'
      })),

      state('neutral', style({
        backgroundColor: '#FFB84C'
      })),

      state('sad', style({
        backgroundColor: '#FF6B6B'
      })),

      transition('* => *', [
        animate('600ms ease-in-out',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.1)', offset: 0.3 }),
            style({ transform: 'scale(0.95)', offset: 0.6 }),
            style({ transform: 'scale(1)', offset: 1 })
          ])
        )
      ])
    ]),

    trigger('eyebrowState', [

      state('happy', style({
        transform: 'translateY(-8px)'
      })),

      state('neutral', style({
        transform: 'translateY(0px)'
      })),

      state('sad', style({
        transform: 'translateY(8px)'
      })),

      transition('* <=> *', [
        animate('500ms ease-in-out')
      ])
    ]),

    trigger('mouthState', [

      state('happy', style({
        d: 'path("M 30 60 Q 50 80 70 60")'
      })),

      state('neutral', style({
        d: 'path("M 30 65 Q 50 65 70 65")'
      })),

      state('sad', style({
        d: 'path("M 30 75 Q 50 55 70 75")'
      })),

      transition('* <=> *', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class FaceComponent {
 @Output() moodChange = new EventEmitter<string>();
 mood: 'happy' | 'neutral' | 'sad' = 'happy';
  setMood(newMood: 'happy' | 'neutral' | 'sad') {
    this.mood = newMood;
  }
}