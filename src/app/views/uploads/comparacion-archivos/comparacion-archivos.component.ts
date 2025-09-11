import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparacionArchivosService, UploadResponse, FileInfo } from '../../../services/comparacion-archivos.service'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comparacion-archivos',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './comparacion-archivos.component.html',
  styleUrl: './comparacion-archivos.component.scss'
})
export class ComparacionArchivosComponent {
  @ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>;

  @Output() filesUploaded = new EventEmitter<UploadResponse>();
    // @Output() comparisonRequested = new EventEmitter<{file1Id: string, file2Id: string}>();
  @Output() comparisonRequested = new EventEmitter<{file1Id: string, file2Id: string, detailedAnalysis?: boolean}>();

  file1: File | null = null;
  file2: File | null = null;
  isDragOver1 = false;
  isDragOver2 = false;
  isUploading = false;
  
  existingFiles: FileInfo[] = [];
  selectedFile1 = '';
  selectedFile2 = '';
  
  statusMessage = '';
  statusType: 'success' | 'error' | 'info' = 'info';

  constructor(private comparacionArchivos:ComparacionArchivosService) {  
     this.loadExistingFiles();
  }
loadExistingFiles() {
    this.comparacionArchivos.listFiles().subscribe({
      next: (files) => {
        this.existingFiles = files;
      },
      error: (error) => {
        console.error('Error al cargar archivos existentes:', error);
      }
    });
  }

  onDragOver(event: DragEvent, dropZone: number) {
    event.preventDefault();
    event.stopPropagation();
    if (dropZone === 1) {
      this.isDragOver1 = true;
    } else {
      this.isDragOver2 = true;
    }
  }

  onDragLeave(event: DragEvent, dropZone: number) {
    event.preventDefault();
    event.stopPropagation();
    if (dropZone === 1) {
      this.isDragOver1 = false;
    } else {
      this.isDragOver2 = false;
    }
  }

  onDrop(event: DragEvent, dropZone: number) {
    event.preventDefault();
    event.stopPropagation();
    
    if (dropZone === 1) {
      this.isDragOver1 = false;
    } else {
      this.isDragOver2 = false;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0], dropZone);
    }
  }

  openFileSelector(fileNumber: number) {
    if (fileNumber === 1) {
      this.fileInput1.nativeElement.click();
    } else {
      this.fileInput2.nativeElement.click();
    }
  }

  onFileSelected(event: Event, fileNumber: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0], fileNumber);
    }
  }

  handleFileSelection(file: File, fileNumber: number) {
    // Validar tipo de archivo
    const allowedTypes = ['text/plain', 'text/csv', 'application/json', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.txt', '.csv', '.json', '.xlsx', '.xls','.docx'];
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      this.showStatus('Tipo de archivo no soportado. Use: TXT, CSV, JSON, XLSX, DOCX', 'error');
      return;
    }

    // Validar tamaño (16MB máximo)
    if (file.size > 16 * 1024 * 1024) {
      this.showStatus('El archivo es demasiado grande. Máximo 16MB.', 'error');
      return;
    }

    if (fileNumber === 1) {
      this.file1 = file;
    } else {
      this.file2 = file;
    }

    this.clearStatus();
  }

  uploadFiles(detailedAnalysis: boolean = false) {
    if (!this.file1 || !this.file2) {
      this.showStatus('Selecciona ambos archivos antes de continuar.', 'error');
      return;
    }

    this.isUploading = true;
    this.showStatus(detailedAnalysis ? 'Subiendo archivos para análisis detallado...' : 'Subiendo archivos...', 'info');
    // this.showStatus('Subiendo archivos...', 'info');

    this.comparacionArchivos.uploadFiles(this.file1, this.file2).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.showStatus('Archivos subidos exitosamente. Iniciando comparación...', 'success');
        this.filesUploaded.emit(response);
        this.comparisonRequested.emit({
          file1Id: response.file1_id,
          file2Id: response.file2_id,
          detailedAnalysis: detailedAnalysis
        });
        this.loadExistingFiles(); // Recargar lista de archivos
      },
      error: (error) => {
        this.isUploading = false;
        this.showStatus(error.message, 'error');
      }
    });
  }

  compareExistingFiles(detailedAnalysis: boolean = false) {
    if (!this.selectedFile1 || !this.selectedFile2) {
      this.showStatus('Selecciona ambos archivos para comparar.', 'error');
      return;
    }

    if (this.selectedFile1 === this.selectedFile2) {
      this.showStatus('Selecciona archivos diferentes para comparar.', 'error');
      return;
    }

    this.showStatus('Iniciando comparación...', 'info');
    this.comparisonRequested.emit({
      file1Id: this.selectedFile1,
      file2Id: this.selectedFile2,
      detailedAnalysis: detailedAnalysis
    });
  }

  onExistingFileSelected() {
    this.clearStatus();
  }

  clearFiles() {
    this.file1 = null;
    this.file2 = null;
    this.fileInput1.nativeElement.value = '';
    this.fileInput2.nativeElement.value = '';
    this.clearStatus();
  }

  getFileIcon(fileName: string): string {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    return this.comparacionArchivos.getFileIcon(extension);
  }

  formatFileSize(size: number): string {
    return this.comparacionArchivos.formatFileSize(size);
  }

  showStatus(message: string, type: 'success' | 'error' | 'info') {
    this.statusMessage = message;
    this.statusType = type;
  }

  clearStatus() {
    this.statusMessage = '';
  }



}
