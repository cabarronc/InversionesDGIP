import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles?: Role[];
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  active: boolean;
}

export interface Permission {
  id: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description?: string;
}
interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
  rememberMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.ApiPocketBase;
  private pb: PocketBase;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private sessionCheckInterval: any;
   private isInitializing = false;
  
  // Configuración de tiempos de sesión
  private readonly SESSION_DURATION = {
    REMEMBER_ME: 7 * 24 * 60 * 60 * 1000, // 7 días
    NORMAL: 8* 60 * 60 * 1000, // 8 horas
    WARNING_TIME: 5 * 60 * 1000 // 5 minutos antes de expirar
  };
  constructor(private router: Router) {
    this.pb = new PocketBase(this.apiUrl);
    // Verificar si hay una sesión guardada
    // if (this.pb.authStore.isValid) {
    //   this.loadCurrentUser();
    // }

    // // Escuchar cambios en el auth store
    // this.pb.authStore.onChange((token, model) => {
    //   if (model) {
    //     this.loadCurrentUser();
    //   } else {
    //     this.currentUserSubject.next(null);
    //   }
    // });
    // this.pb.authStore.onChange((token, model) => {
    //   if (token && model) {
    //     this.handleAuthChange(token, model);
    //   } else {
    //     this.clearSession();
    //   }
    // });

    // Verificar sesión guardada al inicializar
    this.initializeSession();
    
    // Iniciar verificación periódica de sesión
    this.startSessionCheck()
  }

 private async initializeSession(): Promise<void> {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      const sessionData = this.getStoredSession();
      
      if (sessionData && this.isSessionValid(sessionData)) {
        // Primero establecer el usuario desde el almacenamiento local
        this.currentUserSubject.next(sessionData.user);
        
        // Restaurar la sesión de PocketBase
        this.pb.authStore.save(sessionData.token);
        
        // Luego intentar actualizar con datos frescos (en segundo plano)
        this.refreshUserData().catch(error => {
          console.warn('No se pudo actualizar datos del usuario:', error);
          // Si falla la actualización, mantener los datos del almacenamiento
        });
      } else {
        // Verificar si PocketBase tiene una sesión válida
        if (this.pb.authStore.isValid) {
          await this.loadCurrentUser();
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
    } finally {
      this.isInitializing = false;
    }
  }

    private async refreshUserData(): Promise<void> {
    try {
      if (this.pb.authStore.model?.id) {
        const user = await this.pb.collection('users').getOne(this.pb.authStore.model.id, {
          expand: 'roles,roles.permissions'
        });

        const currentUser: User = {
          id: user.id,
          email: user['email'],
        name: user['name'],
        avatar: user['avatar'],
        active: user['active'],
        roles: user.expand?.['roles']?.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            active: role.active,
            permissions: role.expand?.permissions?.map((perm: any) => ({
              id: perm.id,
              module: perm.module,
              action: perm.action,
              description: perm.description
            })) || []
          })) || []
        };

        // Actualizar el usuario y la sesión almacenada
        this.currentUserSubject.next(currentUser);
        this.updateStoredUserData(currentUser);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // No limpiamos la sesión aquí, solo registramos el error
    }
  }

  private updateStoredUserData(user: User): void {
    const sessionData = this.getStoredSession();
    if (sessionData) {
      sessionData.user = user;
      const storage = sessionData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_session', JSON.stringify(sessionData));
    }
  }

  private handleAuthChange(token: string, model: any): void {
    // No hacer nada aquí para evitar bucles, 
    // la lógica se maneja en login()
  }
  async login(email: string, password: string, rememberMe: boolean = false): Promise<User> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);

      // Cargar datos completos del usuario con roles y permisos
      const user = await this.pb.collection('users').getOne(authData.record.id, {
        expand: 'roles,roles.permissions'
      });

      const currentUser: User = {
        id: user.id,
        email: user['email'],
        name: user['name'],
        avatar: user['avatar'],
        active: user['active'],
        roles: user.expand?.['roles']?.map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          active: role.active,
          permissions: role.expand?.permissions?.map((perm: any) => ({
            id: perm.id,
            module: perm.module,
            action: perm.action,
            description: perm.description
          })) || []
        })) || []
      };
      // Guardar sesión con configuración de tiempo
      this.saveSession(authData.token, currentUser, rememberMe);
      this.currentUserSubject.next(currentUser);

      this.currentUserSubject.next(currentUser);
      return currentUser;
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

   private saveSession(token: string, user: User, rememberMe: boolean): void {
    const duration = rememberMe ? this.SESSION_DURATION.REMEMBER_ME : this.SESSION_DURATION.NORMAL;
    const expiresAt = Date.now() + duration;
    
    const sessionData: SessionData = {
      token,
      user,
      expiresAt,
      rememberMe
    };

    // Guardar en localStorage si "remember me", sino en sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_session', JSON.stringify(sessionData));
    
    // También guardar en la otra storage para verificaciones cruzadas
    if (rememberMe) {
      sessionStorage.removeItem('auth_session');
    } else {
      localStorage.removeItem('auth_session');
    }
  }

  private getStoredSession(): SessionData | null {
    try {
      // Verificar primero en localStorage, luego en sessionStorage
      let sessionStr = localStorage.getItem('auth_session') || sessionStorage.getItem('auth_session');
      
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  private isSessionValid(sessionData: SessionData): boolean {
    return Date.now() < sessionData.expiresAt;
  }
  private startSessionCheck(): void {
    // Verificar la sesión cada minuto
    this.sessionCheckInterval = setInterval(() => {
      const sessionData = this.getStoredSession();
      
      if (!sessionData) {
        this.logout();
        return;
      }

      const now = Date.now();
      const timeUntilExpiry = sessionData.expiresAt - now;
      
      // Si la sesión ha expirado
      if (timeUntilExpiry <= 0) {
        this.handleSessionExpired();
        return;
      }

      // Si quedan menos de 5 minutos, mostrar advertencia
      if (timeUntilExpiry <= this.SESSION_DURATION.WARNING_TIME) {
        this.showSessionWarning(Math.ceil(timeUntilExpiry / (60 * 1000)));
      }
    }, 60000); // Verificar cada minuto
  }

  private handleSessionExpired(): void {
    console.log('Sesión expirada');
    this.showSessionExpiredDialog();
    this.logout();
  }

  private showSessionWarning(minutesLeft: number): void {
    // Mostrar notificación de advertencia
    if (confirm(`Tu sesión expirará en ${minutesLeft} minuto(s). ¿Deseas extenderla?`)) {
      this.extendSession();
    }
  }

  private showSessionExpiredDialog(): void {
    alert('Tu sesión ha expirado. Serás redirigido al login.');
  }

  public extendSession(): void {
    const sessionData = this.getStoredSession();
    if (sessionData && this.currentUserSubject.value) {
      // Extender la sesión por el tiempo original
      const duration = sessionData.rememberMe ? 
        this.SESSION_DURATION.REMEMBER_ME : 
        this.SESSION_DURATION.NORMAL;
      
      sessionData.expiresAt = Date.now() + duration;
      
      const storage = sessionData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_session', JSON.stringify(sessionData));
      
      console.log('Sesión extendida exitosamente');
    }
  }

  private clearSession(): void {
    localStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_session');
    this.currentUserSubject.next(null);
  }


  async register(userData: { name: string, email: string, password: string, passwordConfirm: string }): Promise<User> {
    try {
      const record = await this.pb.collection('users').create({
        ...userData,
        active: true
      });

      return {
        id: record.id,
        email: record['email'],
        name: record['name'],
        active: record['active'],
        roles: []
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  async logout(): Promise<void> {
    // Limpiar el intervalo de verificación de sesión
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    
    // Limpiar PocketBase
    this.pb.authStore.clear();
    
    // Limpiar almacenamiento local
    this.clearSession();
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      if (this.pb.authStore.model?.id) {
        const user = await this.pb.collection('users').getOne(this.pb.authStore.model.id, {
          expand: 'roles,roles.permissions'
        });

        const currentUser: User = {
          id: user.id,
          email: user['email'],
          name: user['name'],
          avatar: user['avatar'],
          active: user['active'],
          roles: user.expand?.['roles']?.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            active: role.active,
            permissions: role.expand?.permissions?.map((perm: any) => ({
              id: perm.id,
              module: perm.module,
              action: perm.action,
              description: perm.description
            })) || []
          })) || []
        };

        this.currentUserSubject.next(currentUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      this.logout();
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

 isAuthenticated(): boolean {
    const sessionData = this.getStoredSession();
    const hasValidSession = sessionData !== null && this.isSessionValid(sessionData);
    const hasUser = this.currentUserSubject.value !== null;
    
    // Si tenemos una sesión válida pero no usuario, intentar cargar
    if (hasValidSession && !hasUser && !this.isInitializing) {
      this.refreshUserData();
    }
    
    return hasValidSession && hasUser;
  }

  hasPermission(module: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;

    return user.roles.some(role => 
      role.active && role.permissions?.some(perm => 
        perm.module === module && (perm.action === action || perm.action === 'manage')
      )
    );
  }

  canAccessModule(moduleName: string): boolean {
    return this.hasPermission(moduleName, 'read') || this.hasPermission(moduleName, 'manage');
  }

  getToken(): string | null {
     const sessionData = this.getStoredSession();
    return sessionData?.token || null;
  }
   // Método para obtener información de la sesión actual
  getSessionInfo(): { timeLeft: number; rememberMe: boolean } | null {
    const sessionData = this.getStoredSession();
    if (!sessionData) return null;

    return {
      timeLeft: Math.max(0, sessionData.expiresAt - Date.now()),
      rememberMe: sessionData.rememberMe
    };
  }
  // Método para forzar recarga de datos del usuario
  // async forceRefreshUser(): Promise<void> {
  //   if (this.pb.authStore.isValid) {
  //     await this.refreshUserData();
  //   }
  // }

  // Método para actualizar contraseña
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.pb.collection('users').update(this.pb.authStore.model!.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: newPassword
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar contraseña');
    }
  }

  // Método para solicitar restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.pb.collection('users').requestPasswordReset(email);
    } catch (error: any) {
      throw new Error(error.message || 'Error al solicitar restablecimiento');
    }
  }

  // Método para actualizar avatar en el usuario actual
updateCurrentUserAvatar(avatarUrl: string): void {
  const currentUser = this.currentUserSubject.value;
  if (currentUser) {
    currentUser.avatar = avatarUrl;
    this.currentUserSubject.next({...currentUser});
    
    // También actualizar en almacenamiento
    this.updateStoredUserData(currentUser);
  }
}
async forceRefreshUser(onComplete?: (success: boolean) => void): Promise<void> {
  try {
    await this.refreshUserData();
    if (onComplete) onComplete(true);
  } catch (error) {
    console.error('Error refreshing user:', error);
    if (onComplete) onComplete(false);
  }
}
}
