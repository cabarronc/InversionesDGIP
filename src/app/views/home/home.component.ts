import { Component, ElementRef, OnInit, ViewChild,NgZone, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_APPBAR } from '@progress/kendo-angular-navigation';
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { shareIcon, SVGIcon, xIcon } from "@progress/kendo-svg-icons";
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { ClaudeComponent } from '../claude/claude.component';
interface Particle {
  ox: number; oy: number;
  x: number;  y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_LAYOUT, KENDO_INPUTS,DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,AfterViewInit, OnDestroy{
  public dialOpen = false;
  public image:string = "assets/inversiones.png";
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stage')  stageRef!:  ElementRef<HTMLDivElement>;
 
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private raf = 0;
 
  private readonly NUM           = 500;
  private readonly REPEL_RADIUS  = 100;
  private readonly REPEL_FORCE   = 6;
  private readonly RETURN_SPEED  = 0.055;
  private readonly DAMPING       = 0.82;
  private readonly COLORS        = [
    'rgba(124,99,255,',
    'rgba(0,229,200,',
    'rgba(180,160,255,',
    'rgba(255,255,255,',
    'rgba(80,200,255,',
  ];
 
 

  private animationId: number = 0;
  private gravity = 0.35;
  private friction = 0.995;
  private launched = false;
  private launchTimeout: any;

  
  constructor(private dialogService: DialogService,private ngZone: NgZone) {
    
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
  //Antigravity
 ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.spawnParticles();
    this.ngZone.runOutsideAngular(() => this.loop());
  }
 
  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }
 
  @HostListener('window:resize')
  onResize(): void {
    this.resize();
    this.spawnParticles();
  }
 
  onMouseMove(e: MouseEvent): void {
    const r = this.stageRef.nativeElement.getBoundingClientRect();
    this.mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  }
 
  onMouseLeave(): void {
    this.mouse = { x: -9999, y: -9999 };
  }
 
  onTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const r = this.stageRef.nativeElement.getBoundingClientRect();
    this.mouse = {
      x: e.touches[0].clientX - r.left,
      y: e.touches[0].clientY - r.top,
    };
  }
 
  onTouchEnd(): void {
    this.mouse = { x: -9999, y: -9999 };
  }
 
  private resize(): void {
    const el = this.stageRef.nativeElement;
    this.canvasRef.nativeElement.width  = el.clientWidth;
    this.canvasRef.nativeElement.height = el.clientHeight;
  }
 
  private get W() { return this.canvasRef.nativeElement.width; }
  private get H() { return this.canvasRef.nativeElement.height; }
 
  private spawnParticles(): void {
    this.particles = Array.from({ length: this.NUM }, () => this.makeParticle());
  }
 
  private makeParticle(): Particle {
    const alpha = Math.random() * 0.6 + 0.25;
    return {
      ox: Math.random() * this.W, oy: Math.random() * this.H,
      x:  Math.random() * this.W, y:  Math.random() * this.H,
      vx: 0, vy: 0,
      r: Math.random() * 2.2 + 0.6,
      color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
      alpha, baseAlpha: alpha,
    };
  }
 
  private loop(): void {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);
 
    // Connection lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i], p2 = this.particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124,99,255,${(1 - d / 80) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
 
    // Particles
    for (const p of this.particles) {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
 
      if (dist < this.REPEL_RADIUS && dist > 0) {
        const force = (this.REPEL_RADIUS - dist) / this.REPEL_RADIUS;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * this.REPEL_FORCE;
        p.vy += Math.sin(angle) * force * this.REPEL_FORCE;
        p.alpha = Math.min(1, p.baseAlpha + force * 0.5);
      } else {
        p.alpha += (p.baseAlpha - p.alpha) * 0.05;
      }
 
      p.vx += (p.ox - p.x) * this.RETURN_SPEED;
      p.vy += (p.oy - p.y) * this.RETURN_SPEED;
      p.vx *= this.DAMPING;
      p.vy *= this.DAMPING;
      p.x  += p.vx;
      p.y  += p.vy;
 
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    }
 
    // Cursor glow
    if (this.mouse.x > 0) {
      const g = ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, this.REPEL_RADIUS
      );
      g.addColorStop(0, 'rgba(124,99,255,0.14)');
      g.addColorStop(1, 'rgba(124,99,255,0)');
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.REPEL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
 
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,99,255,0.9)';
      ctx.fill();
    }
 
    this.raf = requestAnimationFrame(() => this.loop());
  }
}
