import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient,withInterceptors  } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../app/interceptores/auth.interceptor'


import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthGuard} from './guards/auth.guard';
import { PermissionGuard} from './guards/permission.guard';
import {  RoleGuard } from './guards/role.guard';
import { AvatarService } from './services/avatar.service';


export const appConfig: ApplicationConfig = {
  providers: [
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    AuthService,
    UserService,
    AvatarService,
    
    // Guards
    AuthGuard,
    PermissionGuard,
    RoleGuard
  ]
};
