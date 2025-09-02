import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparacionArchivosService, ComparisonResult } from '../../services/comparacion-archivos.service';
import { ResultsDetalleComponent } from "./results-detalle/results-detalle.component";

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, ResultsDetalleComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  @Input() result!: ComparisonResult;
  @Input() isLoading = false;
@Output() structureChanged = new EventEmitter<boolean>();
@Output() structureChangedAdd = new EventEmitter<boolean>();
  constructor(private comparacionArchivosService:ComparacionArchivosService ) {
    
  }
  formatFileSize(size: number): string {
    return this.comparacionArchivosService.formatFileSize(size);
  }

  formatDate(dateString: string): string {
    return this.comparacionArchivosService.formatDate(dateString);
  }

  // hasStructureChanges(): boolean {
  //   if (!this.result?.structure_changes) return false;
    
  //   const structure = this.result.structure_changes;
  //   return (structure.columns_added?.length || 0) > 0 ||
  //          (structure.columns_removed?.length || 0) > 0 ||
  //          (structure.shape_change?.from?.[0] !== structure.shape_change?.to?.[0]) ||
  //          (structure.shape_change?.from?.[1] !== structure.shape_change?.to?.[1]); 
  // }
   hasStructureChanges(): boolean {
    const hasChanges = !!(
      this.result?.structure_changes &&
      (
        (this.result.structure_changes.columns_added?.length || 0) > 0 ||
        (this.result.structure_changes.columns_removed?.length || 0) > 0 ||
        (this.result.structure_changes.shape_change?.from?.[0] !== this.result.structure_changes.shape_change?.to?.[0]) ||
        (this.result.structure_changes.shape_change?.from?.[1] !== this.result.structure_changes.shape_change?.to?.[1])
      )
    );
    // Emitimos el booleano al padre
    this.structureChanged.emit(hasChanges);

    return hasChanges;
  }

  hasColumnsAdded(): boolean {
    const hascolumnAdd = !!((this.result?.structure_changes?.columns_added?.length || 0) > 0)
    this.structureChangedAdd.emit(hascolumnAdd);
    return hascolumnAdd;
  }

  hasColumnsRemoved(): boolean {
    return (this.result?.structure_changes?.columns_removed?.length || 0) > 0;
  }

  getColumnsAdded(): string[] {
    return this.result?.structure_changes?.columns_added || [];
  }

  getColumnsRemoved(): string[] {
    return this.result?.structure_changes?.columns_removed || [];
  }

  getShapeChangeText(): string {
    const shapeChange = this.result?.structure_changes?.shape_change;
    if (!shapeChange?.from || !shapeChange?.to) {
      return 'Información no disponible';
    }
    
    const fromRows = shapeChange.from[0] || 0;
    const fromCols = shapeChange.from[1] || 0;
    const toRows = shapeChange.to[0] || 0;
    const toCols = shapeChange.to[1] || 0;
    
    return `${fromRows}×${fromCols} → ${toRows}×${toCols}`;
  }

  hasShapeChanged(): boolean {
    const shapeChange = this.result?.structure_changes?.shape_change;
    if (!shapeChange?.from || !shapeChange?.to) return false;
    
    return shapeChange.from[0] !== shapeChange.to[0] || 
           shapeChange.from[1] !== shapeChange.to[1];
  }

  // Métodos helper adicionales para estadísticas
  getRowsAdded(): number {
    return this.result?.data_changes?.rows_added || 0;
  }

  getRowsRemoved(): number {
    return this.result?.data_changes?.rows_removed || 0;
  }

  getRowsUnchanged(): number {
    return this.result?.data_changes?.rows_unchanged || 0;
  }

  getLinesFile1(): number {
    return this.result?.stats?.lines_file1 || 0;
  }

  getLinesFile2(): number {
    return this.result?.stats?.lines_file2 || 0;
  }

  getChangesCount(): number {
    return this.result?.stats?.changes || 0;
  }

  hasDataChanges(): boolean {
    return this.result?.data_changes && !this.result?.data_changes.error;
  }

  getDataChangesError(): string {
    return this.result?.data_changes?.error || '';
  }

  areFilesIdentical(): boolean {
    if (!this.result?.metadata) return false;
    
    return this.result.metadata.file1.hash === this.result.metadata.file2.hash;
  }

  formatObjectInfo(info: any): string {
    if (!info) return 'No disponible';
    
    try {
      const formatted: any = {};
      
      if (info.type) formatted.tipo = info.type;
      if (info.size) formatted.tamaño = info.size;
      if (info.lines) formatted.líneas = info.lines;
      if (info.shape) formatted.dimensiones = `${info.shape[0]}×${info.shape[1]}`;
      if (info.columns) formatted.columnas = info.columns.length + ' columnas';
      
      return JSON.stringify(formatted, null, 2);
    } catch (e) {
      return JSON.stringify(info, null, 2);
    }
  }

  exportResults(): void {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        comparison_type: this.result.type,
        files: {
          file1: this.result.metadata.file1,
          file2: this.result.metadata.file2
        },
        results: this.result
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], 
        { type: 'application/json' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparison_result_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar resultados:', error);
      alert('Error al exportar los resultados');
    }
  }

  newComparison(): void {
    // Recargar la página para una nueva comparación
    window.location.reload();
  }
}
