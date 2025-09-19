import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FieldSubstitutions } from '../../services/comparacion-archivos.service'
@Component({
  selector: 'app-results-sustituciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-sustituciones.component.html',
  styleUrl: './results-sustituciones.component.scss'
})
export class ResultsSustitucionesComponent {
@Input() fieldSubstitutions!: { [fieldName: string]: FieldSubstitutions } | undefined;
  
  private visibleLineDetails: Set<string> = new Set();
  private linePages: { [fieldName: string]: number } = {};
  private readonly LINE_CHANGES_PER_PAGE = 10;

  getFieldsWithChanges(): string[] {
    if (!this.fieldSubstitutions) return [];
    return Object.keys(this.fieldSubstitutions).filter(field => 
      this.fieldSubstitutions![field].has_changes
    );
  }

  getFieldData(fieldName: string): FieldSubstitutions | undefined {
    return this.fieldSubstitutions?.[fieldName];
  }

  getFieldIcon(fieldName: string): string {
    // Misma lógica que en otros componentes
    const field = fieldName.toLowerCase();
    if (field.includes('nombre') || field.includes('name')) return '👤';
    if (field.includes('email') || field.includes('correo')) return '📧';
    if (field.includes('telefono') || field.includes('phone')) return '📱';
    if (field.includes('fecha') || field.includes('date')) return '📅';
    if (field.includes('precio') || field.includes('price')) return '💰';
    return '📊';
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string' && value.trim() === '') return '(vacío)';
    return String(value);
  }

  getSubstitutions(fieldName: string) {
    return this.getFieldData(fieldName)?.unique_changes_summary.substitutions || [];
  }

  getAdditionsOnly(fieldName: string) {
    return this.getFieldData(fieldName)?.unique_changes_summary.additions_only || [];
  }

  getRemovalsOnly(fieldName: string) {
    return this.getFieldData(fieldName)?.unique_changes_summary.removals_only || [];
  }

  // Métodos para manejar detalles línea por línea
  toggleLineDetails(fieldName: string) {
    if (this.visibleLineDetails.has(fieldName)) {
      this.visibleLineDetails.delete(fieldName);
    } else {
      this.visibleLineDetails.add(fieldName);
      if (!this.linePages[fieldName]) {
        this.linePages[fieldName] = 1;
      }
    }
  }

  isLineDetailsVisible(fieldName: string): boolean {
    return this.visibleLineDetails.has(fieldName);
  }

  getLineChanges(fieldName: string) {
    return this.getFieldData(fieldName)?.line_by_line_changes || [];
  }

  getDisplayedLineChanges(fieldName: string) {
    const changes = this.getLineChanges(fieldName);
    const page = this.linePages[fieldName] || 1;
    const startIndex = (page - 1) * this.LINE_CHANGES_PER_PAGE;
    const endIndex = startIndex + this.LINE_CHANGES_PER_PAGE;
    return changes.slice(startIndex, endIndex);
  }

  getLinePage(fieldName: string): number {
    return this.linePages[fieldName] || 1;
  }

  getLineTotalPages(fieldName: string): number {
    const totalChanges = this.getLineChanges(fieldName).length;
    return Math.ceil(totalChanges / this.LINE_CHANGES_PER_PAGE);
  }

  previousLinePage(fieldName: string) {
    if (this.linePages[fieldName] && this.linePages[fieldName] > 1) {
      this.linePages[fieldName]--;
    }
  }

  nextLinePage(fieldName: string) {
    const currentPage = this.linePages[fieldName] || 1;
    const totalPages = this.getLineTotalPages(fieldName);
    if (currentPage < totalPages) {
      this.linePages[fieldName] = currentPage + 1;
    }
  }
}
