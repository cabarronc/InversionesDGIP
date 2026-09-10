import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient,withInterceptors  } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../app/interceptores/auth.interceptor'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthGuard} from './guards/auth.guard';
import { PermissionGuard} from './guards/permission.guard';
import {  RoleGuard } from './guards/role.guard';
import { AvatarService } from './services/avatar.service';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    // Animaciones necesarias para PrimeNG 
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura,options: {
darkModeSelector: '.dark'
} }}),
    // Servicios
    AuthService,
    UserService,
    AvatarService,
    
    // Guards
    AuthGuard,
    PermissionGuard,
    RoleGuard
  ]
};
