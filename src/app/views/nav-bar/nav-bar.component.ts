import { Component,HostListener,Input,OnInit,ViewEncapsulation,AfterViewInit,ElementRef, NgZone,ViewChild } from '@angular/core';
import { KENDO_ICONS, SVGIcon } from "@progress/kendo-angular-icons";
import { IconsModule } from "@progress/kendo-angular-icons";
import { homeIcon, bellIcon,menuIcon, userIcon,infoSolidIcon} from "@progress/kendo-svg-icons";
import {
  KENDO_NAVIGATION,
  BreadCrumbItem,
  AppBarThemeColor,
} from "@progress/kendo-angular-navigation";
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet,RouterModule,Router,  } from '@angular/router';//agregue RouterModule y Router 
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { interval,Subscription } from 'rxjs';
import { DialogComponent, DialogTitleBarComponent } from "@progress/kendo-angular-dialog";
import { NavbarAvatarComponent } from "../navbar-avatar/navbar-avatar.component";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_POPUP } from "@progress/kendo-angular-popup";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [KENDO_ICONS, KENDO_NAVIGATION, KENDO_INDICATORS, KENDO_LAYOUT, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconsModule,
    RouterModule, KENDO_BUTTONS, PopupModule, NavbarAvatarComponent,KENDO_INPUTS,KENDO_POPUP],
  templateUrl: './nav-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit{
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
constructor(private route:ActivatedRoute, private authService: AuthService,private router: Router,private zone: NgZone) {

  
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
  this.route.paramMap.subscribe(paramMap=>{
    console.log(paramMap);
  }
  )
  this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log("Usuario:",this.currentUser)
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
    console.log("info",this.sessionInfo)
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
   const url_completa =  `http://172.31.33.105:9000/api/files/users/${this.currentUser?.id}/${avatar}`
    return url_completa;
  }

  showSessionDetailsModal = (): void => {
  this.updateSessionInfo();
  this.showSessionModal = true;
}


  public hIcon: SVGIcon = homeIcon;
  public items: BreadCrumbItem[] = [
    {
      text: "Home",
      title: "Home",
      svgIcon: this.hIcon,
    },
    {
      text: "Products",
      title: "Products",
    },
    {
      text: "Keyboards",
      title: "Keyboards",
    },
  ];
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  public userSvg: SVGIcon = userIcon;
  public infoSolidIcon: SVGIcon = infoSolidIcon;

  public themeColor: AppBarThemeColor= 
    "light";
}
