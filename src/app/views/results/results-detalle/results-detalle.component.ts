import { Component,Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldAnalysis, ChangeDetection } from '../../../services/comparacion-archivos.service';

@Component({
  selector: 'app-results-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-detalle.component.html',
  styleUrl: './results-detalle.component.scss'
})
export class ResultsDetalleComponent {
  @Input() fieldLevelChanges!: { [fieldName: string]: FieldAnalysis } | undefined;

  getFieldCount(): number {
    return this.fieldLevelChanges ? Object.keys(this.fieldLevelChanges).length : 0;
  }

  getFieldsWithChanges(): number {
    if (!this.fieldLevelChanges) return 0;
    return Object.values(this.fieldLevelChanges).filter(field => 
      this.hasFieldChanges(field.column_name)).length;
  }

  getFieldNames(): string[] {
    return this.fieldLevelChanges ? Object.keys(this.fieldLevelChanges) : [];
  }

  getFieldData(fieldName: string): FieldAnalysis | undefined {
    return this.fieldLevelChanges?.[fieldName];
  }

  hasFieldChanges(fieldName: string): boolean {
    const field = this.getFieldData(fieldName);
    if (!field) return false;
    
    return (field.changes_detected?.length || 0) > 0 ||
           (field.numeric_changes?.length || 0) > 0 ||
           (field.text_changes?.length || 0) > 0 ||
           (field.date_changes?.length || 0) > 0 ||
           this.hasUniqueValuesChanges(fieldName);
  }

  getFieldType(fieldName: string): string {
    const field = this.getFieldData(fieldName);
    return field?.data_type_new || 'unknown';
  }

  getFieldIcon(fieldName: string): string {
    const type = this.getFieldType(fieldName).toLowerCase();
    if (type.includes('int') || type.includes('float') || type.includes('number')) return '🔢';
    if (type.includes('string') || type.includes('object') || type.includes('text')) return '📝';
    if (type.includes('date') || type.includes('time')) return '📅';
    if (type.includes('bool')) return '☑️';
    return '📊';
  }

  getUniqueValuesChange(fieldName: string): number {
    const field = this.getFieldData(fieldName);
    if (!field) return 0;
    return (field.unique_values_new || 0) - (field.unique_values_old || 0);
  }

  getNullCountChange(fieldName: string): number {
    const field = this.getFieldData(fieldName);
    if (!field) return 0;
    return (field.null_count_new || 0) - (field.null_count_old || 0);
  }

  getAllChanges(fieldName: string): ChangeDetection[] {
    const field = this.getFieldData(fieldName);
    if (!field) return [];
    
    return [
      ...(field.changes_detected || []),
      ...(field.numeric_changes || []),
      ...(field.text_changes || []),
      ...(field.date_changes || [])
    ];
  }

  getChangeIcon(changeType: string): string {
    const icons: { [key: string]: string } = {
      'data_type_change': '🔄',
      'mean_change': '📊',
      'range_change': '📏',
      'length_change': '📐',
      'date_range_change': '📅',
      'default': '🔍'
    };
    return icons[changeType] || icons['default'];
  }

  isNumericField(fieldName: string): boolean {
    const field = this.getFieldData(fieldName);
    return !!(field?.statistics_old && field?.statistics_new);
  }

  isTextField(fieldName: string): boolean {
    const field = this.getFieldData(fieldName);
    return !!(field?.text_analysis_old && field?.text_analysis_new);
  }

  getNumericStat(fieldName: string, statName: keyof any, period: 'old' | 'new'): string {
    const field = this.getFieldData(fieldName);
    const stats = period === 'old' ? field?.statistics_old : field?.statistics_new;
    const value = stats?.[statName as keyof typeof stats];
    return value !== null && value !== undefined ? value.toString() : 'N/A';
  }

  getTextStat(fieldName: string, statName: keyof any, period: 'old' | 'new'): string {
    const field = this.getFieldData(fieldName);
    const stats = period === 'old' ? field?.text_analysis_old : field?.text_analysis_new;
    const value = stats?.[statName as keyof typeof stats];
    return value !== null && value !== undefined ? value.toString() : 'N/A';
  }

  hasUniqueValuesChanges(fieldName: string): boolean {
    const field = this.getFieldData(fieldName);
    return !!(field?.unique_values_changes && 
              (field.unique_values_changes.added_count > 0 || 
               field.unique_values_changes.removed_count > 0));
  }

  getAddedValues(fieldName: string): any[] {
    return this.getFieldData(fieldName)?.unique_values_changes?.added_values || [];
  }

  getRemovedValues(fieldName: string): any[] {
    return this.getFieldData(fieldName)?.unique_values_changes?.removed_values || [];
  }

  getAddedValuesCount(fieldName: string): number {
    return this.getFieldData(fieldName)?.unique_values_changes?.added_count || 0;
  }

  getRemovedValuesCount(fieldName: string): number {
    return this.getFieldData(fieldName)?.unique_values_changes?.removed_count || 0;
  }


}
