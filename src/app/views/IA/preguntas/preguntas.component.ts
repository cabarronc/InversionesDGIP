import { Component } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { ApiIaService } from '../../../services/api-ia.service';
import { LabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { FormsModule } from '@angular/forms';
import { SVGIcon,fileExcelIcon } from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { Text2sqlServicesService } from '../../../services/text2sql.services.service';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [NavBarComponent,LabelModule,InputsModule,FormsModule,KENDO_BUTTONS],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.scss'
})
export class PreguntasComponent {
  pregunta: string = '';
  contexto: string = 'Hoy es 11 de Diciembre de 2024 y mañana es dia de la Virgen ';
  respuesta: string = '';
  Conteo:string="";
  prompt: string = '';
  response: string = '';

  pregunta2: string = '';
  consultaSQL: string = '';
  esquema:string='';
  resultados: any[] = [];
  public fileExcelIcon: SVGIcon = fileExcelIcon;

  constructor(private IA: ApiIaService,private text2sqlService: Text2sqlServicesService) {
    
  }
  sendPrompt() {
    this.text2sqlService.sendPrompt(this.prompt).subscribe({
      next: (data) => this.response = data.response,
      error: (err) => this.response = 'Ocurrió un error: ' + err.message
    });
  }
  consultar() {
    this.IA.preguntar(this.pregunta, this.contexto).subscribe((data) => {
      this.respuesta = data.respuesta;
    });
  }

  exportarDatos() {
    this.IA.exportar().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'datos.xlsx';
      a.click();
    });
  }
  exportarConPregunta() {
    this.IA.exportarPregunta(this.pregunta).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'respuesta.xlsx';
      a.click();
    });
  }
  enviarPregunta() {
    this.IA.consultarPregunta(this.pregunta2,this.esquema).subscribe(
      response => {
      this.consultaSQL = response.sql_query;
 
      console.log("Salida de Consulta",this.consultaSQL)
      this.resultados = response.resultados;
      this.Conteo = response.resultados[0].cantidad_qs
      console.log("Salida de Resultados",response.resultados[0].cantidad_qs)
    },
    (error) => {
      console.error('Error:', error);
    }
  );
  }

}
