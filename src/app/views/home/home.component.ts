import { Component, ElementRef, OnInit, ViewChild, NgZone, HostListener, AfterViewInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { KENDO_APPBAR } from '@progress/kendo-angular-navigation';
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { shareIcon, SVGIcon, xIcon } from "@progress/kendo-svg-icons";
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { ClaudeComponent } from '../claude/claude.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
interface Particle {
  ox: number; oy: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}

interface PlanetItem {
  img: string; href: string; label: string;
  size: number; color: string; ring: boolean;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_BUTTONS, KENDO_LAYOUT, KENDO_INPUTS, DialogModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public dialOpen = false;
  public image: string = "assets/inversiones.png";
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stage') stageRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private raf = 0;

  private readonly NUM = 500;
  private readonly REPEL_RADIUS = 80;
  private readonly REPEL_FORCE = 6;
  private readonly RETURN_SPEED = 0.055;
  private readonly DAMPING = 0.82;
  private readonly COLORS = [
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
  //Planetas
  @ViewChild('universe') universeRef!: ElementRef<HTMLDivElement>;
  @ViewChild('starsCanvas') starsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('planetEl') planetEls!: QueryList<ElementRef>;

  // ── Velocidad de órbita (rad/ms). Sube para girar más rápido ──
  private readonly SPEED = 0.0004;

  private angle = 0;       // ángulo global que avanza continuamente
  private paused = false;
  private lastT: number | null = null;
  private raf_plant = 0;

  frontIndex = 0;
  planetStyles: any[] = [];

  planets: PlanetItem[] = [
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/RepositorioTableros.jpg?raw=true', href: 'https://sites.google.com/guanajuato.gob.mx/dgip/inicio', label: 'Repositorio', size: 178, color: '#7c63ff', ring: true },
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/PaginaFinanzas.jpg?raw=true', href: 'https://finanzas.guanajuato.gob.mx/#/', label: 'Finanzas', size: 178, color: '#00c9a7', ring: false },
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/PresupuestoAbierto.jpg?raw=true', href: 'https://presupuestoabierto.guanajuato.gob.mx/presupuesto-gente/2026', label: 'Presupuesto', size: 178, color: '#f4a940', ring: true },
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/SED.jpg?raw=true', href: 'https://sed.guanajuato.gob.mx/login', label: 'SED', size: 178, color: '#e06c75', ring: false },
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/GPR.jpg?raw=true', href: 'https://equipogpr.guanajuato.gob.mx/inicio', label: 'GPR', size: 178, color: '#56b6c2', ring: true },
    { img: 'https://github.com/cabarronc/RecursosMultimedia/blob/main/QlikView.jpg?raw=true', href: 'http://172.31.100.94:8088/SFIA/index.htm', label: 'QlikView', size: 178, color: '#98c379', ring: false },
  ];

  get N() { return this.planets.length; }

  constructor(private dialogService: DialogService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {

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
    // Corre el loop FUERA de Angular para no disparar change detection en cada frame
    this.ngZone.runOutsideAngular(() => {
      this.raf_plant = requestAnimationFrame(ts => this.frame(ts));
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.raf_plant);
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
    this.canvasRef.nativeElement.width = el.clientWidth;
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
      x: Math.random() * this.W, y: Math.random() * this.H,
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
      p.x += p.vx;
      p.y += p.vy;

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


  //Animacion planetas
  // ── Pausa al hover ───────────────────────────────────
  pause(): void { this.paused = true; }
  resume(): void { this.paused = false; }

  // ── Flechas: saltan un planeta ───────────────────────
  prev(): void { this.angle += (1 / this.N) * Math.PI * 2; }
  next(): void { this.angle -= (1 / this.N) * Math.PI * 2; }

  // ── Dot click ────────────────────────────────────────
  goTo(i: number): void {
    const diff = i - this.frontIndex;
    const steps = ((diff % this.N) + this.N) % this.N;
    this.angle -= (steps / this.N) * Math.PI * 2;
  }

  // ── Click en planeta ─────────────────────────────────
  onPlanetClick(i: number): void {
    if (i === this.frontIndex) window.open(this.planets[i].href, '_blank');
    else this.goTo(i);
  }

  // ── Estilos auxiliares (estáticos, no cambian) ───────
  planetBoxStyle(p: PlanetItem): object {
    return {
      width: p.size + 'px',
      height: p.size + 'px',
      boxShadow: `0 0 0 2px ${p.color}55, inset 0 0 40px rgba(95, 92, 92, 0.55)`,
    };
  }

  ringStyle(p: PlanetItem): object {
    return {
      width: (p.size * 1) + 'px',
      height: (p.size * 1) + 'px',
      borderColor: p.color + '55',
    };
  }

  // ── RAF loop (fuera de NgZone) ───────────────────────
  private frame(ts: number): void {
    // console.log("llegamos:", this.raf_plant)
    if (!this.paused) {
      if (this.lastT !== null) this.angle += this.SPEED * (ts - this.lastT);
      this.lastT = ts;
    } else {
      this.lastT = null;
    }

    const host = this.universeRef.nativeElement;

    const W = host.offsetWidth;
    const H = host.offsetHeight;
    const rx = W * 0.34;
    const ry = 64;

    let bestScore = -Infinity;
    let front = 0;

    this.planets.forEach((p, i) => {
      const a = this.angle + (i / this.N) * Math.PI * 2;
      const x = W / 2 + Math.sin(a) * rx;
      const y = H / 2 - Math.cos(a) * ry - 10;
      const depth = (Math.cos(a) + 1) / 2;
      const scale = 0.42 + depth * 0.68
      const alpha = (0.22 + depth * 0.78).toFixed(3);
      const br = (0.38 + depth * 0.62).toFixed(2);

      if (Math.cos(a) > bestScore) { bestScore = Math.cos(a); front = i; }
      const el = this.planetEls.get(i)?.nativeElement;
      el.style.pointerEvents = (i === front) ? 'auto' : 'none';
      if (el) {
        el.style.left = (x - p.size / 2) + 'px';
        el.style.top = (y - p.size / 2) + 'px';
        el.style.transform = `scale(${scale})`;
        el.style.opacity = alpha;
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = `brightness(${i === front ? '1' : br})`;
      }
      // this.planetStyles[i] = {
      //   left: (x - p.size / 2) + 'px',
      //   top: (y - p.size / 2) + 'px',
      //   zIndex: String(Math.round(depth * 100)),
      //   opacity: alpha,
      //   transform: `scale(${scale.toFixed(3)})`,
      //   filter: `brightness(${i === front ? '1' : br})`,
      //   width: p.size + 'px',
      //   height: p.size + 'px',
      // };
    });

    // Actualiza frontIndex en la zona de Angular solo si cambia (para los dots)
    if (front !== this.frontIndex) {
      this.ngZone.run(() => { this.frontIndex = front; });
    }

    this.raf_plant = requestAnimationFrame(ts => this.frame(ts));


  }

  // ── Estrellas en canvas ──────────────────────────────

}
