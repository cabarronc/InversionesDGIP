/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@angular/localize/init';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // Habilita soporte para animaciones
    ...appConfig.providers
  ]
})
  .catch((err) => console.error(err));
