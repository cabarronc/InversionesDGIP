import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import {CircularComponent} from './views/circular/circular.component'
import { PreguntasComponent } from './views/IA/preguntas/preguntas.component';
import { MailComponent } from './views/mail/mail/mail.component';
import { AdecuacionesComponent } from './views/adecuaciones/adecuaciones/adecuaciones.component';
import { CosaincegComponent } from './views/cosainceg/cosainceg.component';

export const routes: Routes = [
    { path: 'principal', component: HomeComponent},
    { path: 'circular', component: CircularComponent},
    { path: 'centro_datos', component: PreguntasComponent},
    { path: 'correos', component:  MailComponent},
    { path: 'adecuaciones', component:  AdecuacionesComponent},
    { path: 'cosainceg', component:  CosaincegComponent},
    { path: '', redirectTo: 'principal', pathMatch: 'full'},
    { path: '**', redirectTo: 'principal', pathMatch: 'full'},
];
