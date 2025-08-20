import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { SVGIcon,fileExcelIcon } from '@progress/kendo-svg-icons';
import { ClaudeService,QueryRequest,QueryResponse  } from '../../services/claude.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-claude',
  standalone: true,
  imports: [NavBarComponent,LabelModule,InputsModule,FormsModule,KENDO_BUTTONS,ReactiveFormsModule,CommonModule],
  templateUrl: './claude.component.html',
  styleUrl: './claude.component.scss'
})
export class ClaudeComponent implements OnInit {
naturalLanguage: string = '';
consultaSQL: string = '';
resultados: any[] = [];
queryForm: FormGroup;
loading = false;
result: QueryResponse | null = null;
error: string | null = null;
respuesta:string=''
Conteo:string="";


naturalLanguage_ml: string = '';
consultaSQL_ml: string = '';
resultados_ml: any[] = [];
queryForm_ml: FormGroup;
loading_ml = false;
result_ml: QueryResponse | null = null;
error_ml: string | null = null;
respuesta_ml:string=''
Conteo_ml:string="";
public fileExcelIcon: SVGIcon = fileExcelIcon;

 ngOnInit(): void {
    
  }
constructor(private claudeService: ClaudeService,private fb: FormBuilder) {
  this.queryForm = this.fb.group({
      naturalLanguage: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });

    this.queryForm_ml = this.fb.group({
      naturalLanguage_ml: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });
  
}
 onSubmit(): void {
    if (this.queryForm.valid) {
      this.executeQuery();
    } else {
      this.markFormGroupTouched();
    }
  }

   onSubmit_ml(): void {
    if (this.queryForm_ml.valid) {
      this.executeQuery_ml();
    } else {
      this.markFormGroupTouched_ml();
    }
  }
private executeQuery(): void {
    this.loading = true;
    this.result = null;
    this.error = null;

    const request: QueryRequest = {
      naturalLanguage: this.queryForm.get('naturalLanguage')?.value.trim(),
    };

    console.log('Enviando consulta:', request);

    this.claudeService.translateAndQuery(request).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.result = response;
        this.loading = false;
        this.respuesta = response.message
        console.log( this.respuesta )
         console.log(this.hasResults)
        console.log(!!this.hasError)
       

        // Si hay archivo Excel, preguntar si desea descargarlo
        if (response.success && response.excelFile && response.fileName) {
          setTimeout(() => {
            const download = confirm(
              `Se generaron ${response.recordCount} resultados en un archivo Excel. ¿Desea descargarlo ahora?`
            );
            if (download) {
              this.downloadExcel();
            }
          }, 3000);
        }
      },
      error: (error) => {
        console.error('Error en consulta:', error);
        this.error = typeof error === 'string' ? error : 'Error procesando la consulta';
        this.loading = false;
      }
    });
  }

  private executeQuery_ml(): void {
    this.loading_ml = true;
    this.result_ml = null;
    this.error_ml = null;

    const request: QueryRequest = {
      naturalLanguage: this.queryForm_ml.get('naturalLanguage_ml')?.value.trim(),
    };

    console.log('Enviando consulta:', request);

    this.claudeService.modeloLocal(request).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.result_ml = response;
        this.loading_ml = false;
        this.respuesta_ml = response.message
        console.log( this.respuesta_ml )
        console.log(this.hasResults_ml)
        console.log(!!this.hasError_ml)
       

        // Si hay archivo Excel, preguntar si desea descargarlo
        if (response.success && response.excelFile && response.fileName) {
          setTimeout(() => {
            const download = confirm(
              `Se generaron ${response.recordCount} resultados en un archivo Excel. ¿Desea descargarlo ahora?`
            );
            if (download) {
              this.downloadExcel();
            }
          }, 3000);
        }
      },
      error: (error) => {
        console.error('Error en consulta:', error);
        this.error_ml = typeof error === 'string' ? error : 'Error procesando la consulta';
        this.loading_ml = false;
      }
    });
  }

   clearForm(): void {
    this.queryForm.reset();
    this.result = null;
    this.error = null;
  }

    clearForm_ml(): void {
    this.queryForm_ml.reset();
    this.result_ml = null;
    this.error_ml = null;
  }
  private markFormGroupTouched(): void {
    Object.keys(this.queryForm.controls).forEach(key => {
      const control = this.queryForm.get(key);
      control?.markAsTouched();
    });
  }
    private markFormGroupTouched_ml(): void {
    Object.keys(this.queryForm_ml.controls).forEach(key => {
      const control = this.queryForm_ml.get(key);
      control?.markAsTouched();
    });
  }
 // Getters para el template
  get naturalLanguageControl() { 
    return this.queryForm.get('naturalLanguage'); 
  }
   get isFormValid(): boolean {
    return this.queryForm.valid;
  }

  get hasResults(): boolean {
    return this.result?.success === true;
  }

  get hasError(): boolean {
    return this.result?.success === false;
  }

  get resultMessage(): string {
    return this.result?.message || this.error || '';
  }

  // Getters para el template 2
  get naturalLanguageControl_ml() { 
    return this.queryForm_ml.get('naturalLanguage_ml'); 
  }
   get isFormValid_ml(): boolean {
    return this.queryForm_ml.valid;
  }

  get hasResults_ml(): boolean {
    return this.result_ml?.success === true;
  }

  get hasError_ml(): boolean {
    return this.result_ml?.success === false;
  }

  get resultMessage_ml(): string {
    return this.result_ml?.message || this.error || '';
  }
  //Download
   downloadExcel(): void {
    if (this.result?.excelFile && this.result?.fileName) {
      this.claudeService.downloadExcelFile(this.result.excelFile, this.result.fileName);
    }
  }
    //Download
   downloadExcel_ml(): void {
    if (this.result_ml?.excelFile && this.result_ml?.fileName) {
      this.claudeService.downloadExcelFile(this.result_ml.excelFile, this.result_ml.fileName);
    }
  }
}
