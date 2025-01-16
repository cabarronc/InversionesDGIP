import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import {CircularComponent} from './views/circular/circular.component'
import { PreguntasComponent } from './views/IA/preguntas/preguntas.component';
import { MailComponent } from './views/mail/mail/mail.component';

export const routes: Routes = [
    { path: 'principal', component: HomeComponent},
    { path: 'circular', component: CircularComponent},
    { path: 'centro_datos', component: PreguntasComponent},
    { path: 'correos', component:  MailComponent},
    { path: '', redirectTo: 'principal', pathMatch: 'full'},
    { path: '**', redirectTo: 'principal', pathMatch: 'full'},
];
