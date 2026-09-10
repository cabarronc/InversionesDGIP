import { Component, HostListener, Input, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, NgZone, ViewChild } from '@angular/core';

import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet, RouterModule, Router, } from '@angular/router';//agregue RouterModule y Router 
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { PopupModule } from '@progress/kendo-angular-popup';
import { interval, Subscription } from 'rxjs';
import { NavbarAvatarComponent } from "../navbar-avatar/navbar-avatar.component";
import { environment } from '../../../environments/environment';

  
//Prime dependencias
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { AvatarService } from '../../services/avatar.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';  
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    RouterModule, PopupModule, NavbarAvatarComponent,ButtonModule, MenubarModule, PopoverModule,
    TooltipModule, ProgressSpinnerModule],
  templateUrl: './nav-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  isDarkMode = false;
  currentUser: User | null = null;
  sessionInfo: { timeLeft: number; rememberMe: boolean } | null = null;
  showUserMenu = false;
  animating = false;
  showSessionModal = false;
  showSessionWarning = false;
  private subscription?: Subscription;
  private warningShown = false;
  public margin = { horizontal: -46, vertical: 7 };
  public show = false;
  public url: string = environment.ApiPocketBase
  currentAvatarUrl: string = '';
  isMobile = window.innerWidth <= 768;
  defaultAvatarSvg: string = '';
  defaultAvatarLargeSvg: string = '';
   uploadMessage: { type: 'success' | 'error', text: string } | null = null;
   uploading = false;
  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative.inline-block.text-left');
    if (!clickedInside) {
      this.showUserMenu = false;
      this.showSessionModal = false;
    }
  }
  public onToggle(): void {
    this.show = !this.show;
  }


  public menuItems: MenuItem[] = [
    {
      label: 'Circular',
      icon: 'pi pi-file',
      routerLink: '/circular'
    },

    {
      label: 'Adecuaciones',
      icon: 'pi pi-pencil',
      routerLink: '/adecuaciones'
    },
    {
      label: 'Cuenta Pública',
      icon: 'pi pi-chart-bar',
      routerLink: '/reportes'
    },
    {
      label: 'Herramientas',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Correos',
          icon: 'pi pi-envelope',
          routerLink: '/correos'
        },
        {
          label: 'Simulador',
          icon: 'pi pi-calculator',
          routerLink: '/simulador'
        },
        {
          label: 'Procesador',
          icon: 'pi pi-cog',
          routerLink: '/procesador'
        }
      ]
    },


  ];
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private zone: NgZone, private avatarService: AvatarService) {


  }
  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener("resize", () => {
        if (this.show) {
          this.zone.run(() => this.onToggle());
        }
      });
    });
  }
  ngOnInit(): void {
    this.generateDefaultAvatars();
    this.route.paramMap.subscribe(paramMap => {
      console.log(paramMap);
    }
    )
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:", this.currentUser)
    });
    // Actualizar información de sesión cada 30 segundos
    this.subscription = interval(30000).subscribe(() => {
      this.updateSessionInfo();
      this.checkSessionWarning();
    });

    // Actualización inicial
    this.updateSessionInfo();

  }
  private updateSessionInfo(): void {
    this.sessionInfo = this.authService.getSessionInfo();
    console.log("info", this.sessionInfo)
  }

  private checkSessionWarning(): void {
    if (this.sessionInfo) {
      const fiveMinutes = 5 * 60 * 1000;
      // if (this.sessionInfo.timeLeft <= fiveMinutes && this.sessionInfo.timeLeft > 0 && !this.warningShown) {
      //   this.showSessionWarning = true;
      //   this.warningShown = true;
      // }
      if (this.sessionInfo.timeLeft <= fiveMinutes && this.sessionInfo.timeLeft > 0) {
        this.showSessionWarning = true;
        this.warningShown = true;
      }

      // Reset warning if session is extended
      if (this.sessionInfo.timeLeft > fiveMinutes) {
        this.warningShown = false;
      }
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    document.documentElement.classList.toggle(
      'dark',
      this.isDarkMode
    );
  }

  canAccessModule(module: string): boolean {
    return this.authService.canAccessModule(module);
  }

  async logout(): Promise<void> {
    this.animating = true;
    await this.authService.logout();
  }

  getSessionStatusClass(): string {
    if (!this.sessionInfo) return 'session-unknown';

    const fiveMinutes = 5 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const timeLeft = this.sessionInfo.timeLeft; // en milisegundos

    if (timeLeft <= fiveMinutes) return 'session-critical';
    if (timeLeft <= oneHour) return 'session-warning';
    return 'session-safe';
  }


  getSessionStatusText(): string {
    if (!this.sessionInfo) return 'Desconocido';

    const fiveMinutes = 5 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    if (this.sessionInfo.timeLeft <= fiveMinutes) {
      return 'Expira pronto';
    } else if (this.sessionInfo.timeLeft <= oneHour) {
      return 'Activa (atención)';
    } else {
      return 'Activa';
    }
  }

  shouldShowExtendButton(): boolean {
    if (!this.sessionInfo) return false;
    const tenMinutes = 10 * 60 * 1000;
    return this.sessionInfo.timeLeft <= tenMinutes;
  }

  formatTimeLeft(timeLeft: number): string {
    if (timeLeft <= 0) return 'Expirada';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  extendSession(): void {
    this.authService.extendSession();
    this.updateSessionInfo();
    this.showSessionWarning = false;
    this.warningShown = false;
  }

  showSessionDetails(): void {
    this.updateSessionInfo();
    this.showSessionModal = true;
    this.showUserMenu = false;
  }

  closeModals(): void {
    this.showUserMenu = false;
    this.showSessionModal = false;
  }
  getAvatarUrl(avatar: string): string {
    const url_completa = `${this.url}/api/files/users/${this.currentUser?.id}/${avatar}`
    return url_completa;
  }

  showSessionDetailsModal = (): void => {
    this.updateSessionInfo();
    this.showSessionModal = true;
  }


 


      onImageError(): void {
    this.currentAvatarUrl = '';
    this.generateDefaultAvatars();
  }
    private generateDefaultAvatars(): void {
    if (this.currentUser?.name) {
      // Avatar pequeño (32px)
      const smallDataUrl = this.avatarService.generateDefaultAvatar(this.currentUser.name, 32);
      this.defaultAvatarSvg = `<img src="${smallDataUrl}" alt="${this.currentUser.name}" class="w-full h-full object-cover">`;
      
      // Avatar grande (64px)
      const largeDataUrl = this.avatarService.generateDefaultAvatar(this.currentUser.name, 64);
      this.defaultAvatarLargeSvg = `<img src="${largeDataUrl}" alt="${this.currentUser.name}" class="w-full h-full object-cover">`;
    }
  }

   removeAvatar(): void {
  if (!this.currentUser) return;

  if (confirm('¿Estás seguro de que quieres quitar tu foto de perfil?')) {
    this.uploading = true;
    
    this.avatarService.removeUserAvatar(this.currentUser.id).subscribe({
      next: (success) => {
        if (success) {
          // Actualizar UI inmediatamente
          this.currentAvatarUrl = '';
          this.generateDefaultAvatars();
          
          // Actualizar en AuthService
          this.authService.updateCurrentUserAvatar('');
          
          // Mensaje de éxito
          this.uploadMessage = { type: 'success', text: 'Avatar removido correctamente' };
          setTimeout(() => this.uploadMessage = null, 3000);
          
        } else {
          this.uploadMessage = { type: 'error', text: 'Error al quitar avatar' };
          setTimeout(() => this.uploadMessage = null, 5000);
        }
      },
      error: () => {
        this.uploadMessage = { type: 'error', text: 'Error de conexión al quitar avatar' };
        setTimeout(() => this.uploadMessage = null, 5000);
      },
      complete: () => {
        this.uploading = false;
      }
    });
  }
}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file || !this.currentUser) return;

    this.uploadMessage = null;

    // Validar archivo
    const validation = this.avatarService.validateFile(file);
    if (!validation.valid) {
      this.uploadMessage = { type: 'error', text: validation.error! };
      setTimeout(() => this.uploadMessage = null, 5000);
      return;
    }

    // Subir archivo
    this.uploadAvatar(file);
  }

  private uploadAvatar(file: File): void {
  if (!this.currentUser) return;

  this.uploading = true;
  this.uploadMessage = null;
  this.avatarService.uploadUserAvatar(this.currentUser.id, file).subscribe({
    next: (result) => {
      if (result.success && result.avatarUrl) {
        // Actualizar URL local inmediatamente
        this.currentAvatarUrl = result.avatarUrl + '?t=' + Date.now();
        
        // Obtener solo el nombre del archivo desde la URL
        const avatarFilename = result.avatarUrl.split('/').pop() || '';
        
        // Actualizar en AuthService (más rápido que refresh completo)
        this.authService.updateCurrentUserAvatar(avatarFilename);
        
        // Mensaje de éxito
        this.uploadMessage = { type: 'success', text: 'Avatar actualizado correctamente' };
        setTimeout(() => this.uploadMessage = null, 3000);
        
        // Opcional: Refresh completo en segundo plano para asegurar sincronización
        setTimeout(() => {
          this.authService.forceRefreshUser();
        }, 1000);
        
      } else {
        this.uploadMessage = { type: 'error', text: result.error || 'Error al subir avatar' };
        setTimeout(() => this.uploadMessage = null, 5000);
      }
    },
    error: (error) => {
      this.uploadMessage = { type: 'error', text: 'Error de conexión al subir avatar' };
      setTimeout(() => this.uploadMessage = null, 5000);
      console.error('Upload error:', error);
    },
    complete: () => {
      this.uploading = false;
      // Limpiar input file
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  });
}
}
