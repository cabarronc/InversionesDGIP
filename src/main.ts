/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import '@angular/localize/init';

pdfDefaultOptions.workerSrc = () => 'assets/pdf.worker-6.4.1351.min.mjs';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    ...appConfig.providers
  ]
})
  .catch((err) => console.error(err));