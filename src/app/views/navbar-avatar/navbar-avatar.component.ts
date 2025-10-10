import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AvatarService } from '../../services/avatar.service';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe'
import { PopupModule } from '@progress/kendo-angular-popup';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { fileWordIcon, imageIcon ,menuIcon, SVGIcon, copyIcon,trashIcon,arrowsSwapIcon} from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-navbar-avatar',
  standalone: true,
  imports: [CommonModule, LoaderComponent, PopupModule,CapitalizeFirstPipe,KENDO_BUTTONS],
  templateUrl: './navbar-avatar.component.html',
  styleUrl: './navbar-avatar.component.scss'
})
export class NavbarAvatarComponent {
@Input() showSessionDetails!: () => void;
  @Input() logout!: () => void;
  @Input() showUserMenu: boolean = false;
   @Input() showSessionModal: boolean = false;
 sessionInfo: { timeLeft: number ; rememberMe: boolean} | null = null;
  public trashIcon: SVGIcon = trashIcon;
    public arrowsSwapIcon: SVGIcon = arrowsSwapIcon;



  @HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  const clickedInside = target.closest('.relative.inline-block.text-left');
  if (!clickedInside) {
    this.showUserMenu = false;
    this.showSessionModal = false;
  }
}

  currentUser: User | null = null;
  currentAvatarUrl: string = '';
  defaultAvatarSvg: string = '';
  defaultAvatarLargeSvg: string = '';
  showMenu = false;
  uploading = false;
  uploadMessage: { type: 'success' | 'error', text: string } | null = null;
  
  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios del usuario
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateAvatarUrl();
      this.generateDefaultAvatars();
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  private updateAvatarUrl(): void {
    if (this.currentUser?.avatar && this.currentUser.id) {
      this.currentAvatarUrl = this.avatarService.getAvatarUrl(
        this.currentUser.id, 
        this.currentUser.avatar
      ) + '?t=' + Date.now(); // Cache busting
    } else {
      this.currentAvatarUrl = '';
    }
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

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  private handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-navbar-avatar')) {
      this.showMenu = false;
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

  // private uploadAvatar(file: File): void {
  //   if (!this.currentUser) return;

  //   this.uploading = true;
  //   this.uploadMessage = null;

  //   this.avatarService.uploadUserAvatar(this.currentUser.id, file).subscribe({
  //     next: (result) => {
  //       if (result.success && result.avatarUrl) {
  //         // Actualizar URL local
  //         this.currentAvatarUrl = result.avatarUrl + '?t=' + Date.now();
  //         // Obtener solo el nombre del archivo desde la URL
  //       const avatarFilename = result.avatarUrl.split('/').pop() || '';
  //         // Forzar actualización del usuario en el servicio
  //         // Actualizar en AuthService (más rápido que refresh completo)
  //       this.authService.updateCurrentUserAvatar(avatarFilename);

  //         this.authService.forceRefreshUser().then(() => {
  //           this.uploadMessage = { type: 'success', text: 'Avatar actualizado correctamente' };
  //           setTimeout(() => this.uploadMessage = null, 3000);
  //         });
  //       } else {
  //         this.uploadMessage = { type: 'error', text: result.error || 'Error al subir avatar' };
  //         setTimeout(() => this.uploadMessage = null, 5000);
  //       }
  //     },
  //     error: (error) => {
  //       this.uploadMessage = { type: 'error', text: 'Error de conexión al subir avatar' };
  //       setTimeout(() => this.uploadMessage = null, 5000);
  //       console.error('Upload error:', error);
  //     },
  //     complete: () => {
  //       this.uploading = false;
  //       // Limpiar input file
  //       const fileInput = event?.currentTarget as HTMLInputElement;
  //       if (fileInput) fileInput.value = '';
  //     }
  //   });
  // }
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


  // removeAvatar(): void {
  //   if (!this.currentUser) return;

  //   if (confirm('¿Estás seguro de que quieres quitar tu foto de perfil?')) {
  //     this.uploading = true;
      
  //     this.avatarService.removeUserAvatar(this.currentUser.id).subscribe({
  //       next: (success) => {
  //         if (success) {
  //           this.currentAvatarUrl = '';
  //           this.generateDefaultAvatars();
            
  //           // Forzar actualización del usuario
  //           this.authService.forceRefreshUser().then(() => {
  //             this.uploadMessage = { type: 'success', text: 'Avatar removido correctamente' };
  //             setTimeout(() => this.uploadMessage = null, 3000);
  //           });
  //         } else {
  //           this.uploadMessage = { type: 'error', text: 'Error al quitar avatar' };
  //           setTimeout(() => this.uploadMessage = null, 5000);
  //         }
  //       },
  //       error: () => {
  //         this.uploadMessage = { type: 'error', text: 'Error de conexión al quitar avatar' };
  //         setTimeout(() => this.uploadMessage = null, 5000);
  //       },
  //       complete: () => {
  //         this.uploading = false;
  //       }
  //     });
  //   }
  // }

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

  onImageError(): void {
    this.currentAvatarUrl = '';
    this.generateDefaultAvatars();
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

    getSessionStatusClass(): string {
    if (!this.sessionInfo) return 'bg-gray-500';
    
    const fiveMinutes = 5 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    
    if (this.sessionInfo.timeLeft <= fiveMinutes) {
      return 'bg-red-500';
    } else if (this.sessionInfo.timeLeft <= oneHour) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }

    getSessionStatusText(): string {
    if (!this.sessionInfo) return 'Desconocido';
    
    const fiveMinutes = 5 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    
    if (this.sessionInfo.timeLeft <= fiveMinutes) {
      return 'Expirando pronto';
    } else if (this.sessionInfo.timeLeft <= oneHour) {
      return 'Activa (atención)';
    } else {
      return 'Activa';
    }
  }
}
