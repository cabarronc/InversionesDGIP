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
// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   Input,
//   signal,
//   effect,
//   AfterViewInit
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { gsap } from 'gsap';

// @Component({
//   selector: 'app-face',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './face.component.html',
//   styleUrls: ['./face.component.scss']
// })
// export class FaceComponent implements AfterViewInit {

//   mood = signal<'happy' | 'neutral' | 'sad'>('happy');

//   @Input()
//   set state(value: 'happy' | 'neutral' | 'sad') {
//     this.mood.set(value);
//   }

//   @ViewChild('face') face!: ElementRef;
//   @ViewChild('mouth') mouth!: ElementRef<SVGPathElement>;
//   @ViewChild('leftPupil') leftPupil!: ElementRef;
//   @ViewChild('rightPupil') rightPupil!: ElementRef;
//   @ViewChild('tear') tear!: ElementRef;

//   ngAfterViewInit() {
//     this.setupReactivity();
//     this.blinkRandom();
//     this.trackMouse();
//   }

//   setupReactivity() {
//     effect(() => {
//       this.animateMood(this.mood());
//     });
//   }

//   animateMood(mood: 'happy' | 'neutral' | 'sad') {

//     const mouthPaths = {
//       happy: "M40 75 Q60 95 80 75",
//       neutral: "M40 80 Q60 80 80 80",
//       sad: "M40 90 Q60 65 80 90"
//     };

//     const gradients = {
//       happy: "linear-gradient(135deg,#FFD93D,#FF9F1C)",
//       neutral: "linear-gradient(135deg,#F4A261,#E76F51)",
//       sad: "linear-gradient(135deg,#6C757D,#495057)"
//     };

//     const tl = gsap.timeline();

//     // Boca morph
//     tl.to(this.mouth.nativeElement, {
//       duration: 0.7,
//       attr: { d: mouthPaths[mood] },
//       ease: "elastic.out(1,0.4)"
//     });

//     // Gradiente dinámico
//     tl.to(this.face.nativeElement, {
//       background: gradients[mood],
//       duration: 0.5
//     }, 0);

//     // Rebote físico
//     tl.fromTo(this.face.nativeElement,
//       { scale: 1 },
//       {
//         scale: 1.08,
//         duration: 0.2,
//         yoyo: true,
//         repeat: 1
//       }, 0);

//     // Mejillas felices
//     if (mood === 'happy') {
//       gsap.to(".cheek", { scale: 1.3, opacity: 0.6 });
//     } else {
//       gsap.to(".cheek", { scale: 1, opacity: 0 });
//     }

//     // Lágrima triste
//     if (mood === 'sad') {
//       gsap.to(this.tear.nativeElement, {
//         y: 25,
//         opacity: 1,
//         repeat: -1,
//         yoyo: true,
//         duration: 1
//       });
//     } else {
//       gsap.to(this.tear.nativeElement, {
//         opacity: 0,
//         y: 0
//       });
//     }
//   }

//   blinkRandom() {
//     const blink = () => {
//       gsap.to(".eye", {
//         scaleY: 0.1,
//         duration: 0.1,
//         yoyo: true,
//         repeat: 1,
//         onComplete: () => {
//           gsap.delayedCall(gsap.utils.random(2, 5), blink);
//         }
//       });
//     };
//     blink();
//   }

//   trackMouse() {
//     window.addEventListener('mousemove', (e) => {
//       const x = (e.clientX / window.innerWidth - 0.5) * 10;
//       const y = (e.clientY / window.innerHeight - 0.5) * 10;

//       gsap.to([this.leftPupil.nativeElement, this.rightPupil.nativeElement], {
//         x,
//         y,
//         duration: 0.3
//       });
//     });
//   }
// }