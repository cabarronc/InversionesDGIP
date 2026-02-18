import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import {CircularComponent} from './views/circular/circular.component'
import { MailComponent } from './views/mail/mail/mail.component';
import { AdecuacionesComponent } from './views/adecuaciones/adecuaciones/adecuaciones.component';
import { CosaincegComponent } from './views/cosainceg/cosainceg.component';
import { ClaudeComponent } from './views/claude/claude.component';
import { LoginComponent } from './views/login/login/login.component';
import { UserManagementComponent } from './views/administracion/user-management/user-management.component';
import { AdministracionComponent } from './views/administracion/administracion.component';
import { UnauthorizedComponent } from './views/administracion/unauthorized/unauthorized.component';
import { AuthGuard} from './guards/auth.guard';
import { PermissionGuard} from './guards/permission.guard';
import {  RoleGuard } from './guards/role.guard'
import {NavBarComponent} from '../app/views/nav-bar/nav-bar.component'
import {DashboardComponent} from '../app/views/administracion/dashboard/dashboard.component'
import {AvatarUploadComponent} from './views/uploads/avatar-upload/avatar-upload.component'
import { NavbarAvatarComponent } from './views/navbar-avatar/navbar-avatar.component';
import { ReportesComponent } from './views/cosainceg/reportes/reportes.component';
import { SimuladorComponent } from './views/simulador/simulador.component';


export const routes: Routes = [
    // { path: 'principal', component: HomeComponent},
    // { path: 'circular', component: CircularComponent},
    // { path: 'correos', component:  MailComponent},
    // { path: 'adecuaciones', component:  AdecuacionesComponent},
    // { path: 'cosainceg', component:  CosaincegComponent},
    // { path: 'claude', component:  ClaudeComponent},
     { path: 'login', component:  LoginComponent},
     { path: 'avatar', component: AvatarUploadComponent},
     { path: 'avatar_edit', component: NavbarAvatarComponent},
      // { path: 'admin', component:  AdministracionComponent},
       {path: 'unauthorized',component: UnauthorizedComponent},

    // { path: '', redirectTo: 'login', pathMatch: 'full'},
    {
    path: '',
    component: NavBarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'principal',
        component: HomeComponent
      },
      {path: 'simulador',
        component: SimuladorComponent,
       canActivate: [PermissionGuard],
        data: { module: 'simulador', action: 'manage' }},
       
      {
        path: 'admin',
        component: AdministracionComponent,
        canActivate: [PermissionGuard],
        data: { module: 'users', action: 'manage' }
      },
      
      {
        path: 'circular',
        component: CircularComponent,
        canActivate: [PermissionGuard],
        data: { module: 'circular', action: 'manage' }
      },
      {
        path: 'correos',
        component: MailComponent,
        canActivate: [PermissionGuard],
        data: { module: 'correos', action: 'manage' }
      },
        {path: 'adecuaciones',
        component: AdecuacionesComponent,
        canActivate: [PermissionGuard],
        data: { module: 'adecuaciones', action: 'manage' }
      },
          {path: 'reportes',
        component: ReportesComponent,
        canActivate: [PermissionGuard],
        data: { modules: ['cosainceg', 'deuda','inversion'], action: 'manage' }
      },
   
             {path: 'claude',
        component: ClaudeComponent,
        canActivate: [PermissionGuard],
        data: { module: 'claude', action: 'manage' }
      },
      // {
      //   path: 'roles',
      //   component: UserManagementComponent,
      //   canActivate: [PermissionGuard],
      //   data: { module: 'roles', action: 'read' }
      // }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full'}
    // { path: '**', redirectTo: 'login', pathMatch: 'full'},
];
