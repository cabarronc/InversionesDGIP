import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import {CircularComponent} from './views/circular/circular.component'

export const routes: Routes = [
    { path: 'principal', component: HomeComponent},
    { path: 'circular', component: CircularComponent},
    { path: '', redirectTo: 'principal', pathMatch: 'full'},
    { path: '**', redirectTo: 'principal', pathMatch: 'full'},
];
