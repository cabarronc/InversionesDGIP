import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService, AvatarUploadResult } from '../../../services/avatar.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent implements OnInit {
   @Input() userId!: string;
  @Input() userName!: string;
  @Input() avatarUrl: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() avatarChanged = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();

  currentAvatarUrl: string = '';
  defaultAvatarSvg: string = '';
  selectedFile: File | null = null;
  uploading = false;
  errorMessage = '';

  constructor(private avatarService: AvatarService) {}

  ngOnInit(): void {
    this.currentAvatarUrl = this.avatarUrl;
    this.generateDefaultAvatar();
  }

  private generateDefaultAvatar(): void {
    if (!this.currentAvatarUrl && this.userName) {
      const canvas = document.createElement('canvas');
      const size = 63; // 24 * 4 (w-24 = 96px)
      canvas.width = size;
      canvas.height = size;
      
      const dataUrl = this.avatarService.generateDefaultAvatar(this.userName, size);
      this.defaultAvatarSvg = `<img src="${dataUrl}" alt="${this.userName}" class="w-full h-full object-cover">`;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.errorMessage = '';

    // Validar archivo
    const validation = this.avatarService.validateFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error!;
      this.uploadError.emit(validation.error!);
      return;
    }

    // Subir archivo
    this.uploadAvatar(file);
  }

  private uploadAvatar(file: File): void {
    this.uploading = true;
    this.errorMessage = '';

    this.avatarService.uploadUserAvatar(this.userId, file).subscribe({
      next: (result: AvatarUploadResult) => {
        if (result.success && result.avatarUrl) {
          this.currentAvatarUrl = result.avatarUrl + '?t=' + Date.now(); // Cache busting
          this.avatarChanged.emit(this.currentAvatarUrl);
          console.log(this.currentAvatarUrl)
        } else {
          this.errorMessage = result.error || 'Error al subir avatar';
          this.uploadError.emit(this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = 'Error de conexión al subir avatar';
        this.uploadError.emit(this.errorMessage);
      },
      complete: () => {
        this.uploading = false;
        this.selectedFile = null;
        // Limpiar input file
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    });
  }

  removeAvatar(): void {
    if (confirm('¿Estás seguro de que quieres quitar tu foto de perfil?')) {
      this.uploading = true;
      
      this.avatarService.removeUserAvatar(this.userId).subscribe({
        next: (success) => {
          if (success) {
            this.currentAvatarUrl = '';
            this.generateDefaultAvatar();
            this.avatarChanged.emit('');
          } else {
            this.errorMessage = 'Error al quitar avatar';
          }
        },
        error: () => {
          this.errorMessage = 'Error de conexión al quitar avatar';
        },
        complete: () => {
          this.uploading = false;
        }
      });
    }
  }

  onImageError(): void {
    this.currentAvatarUrl = '';
    this.generateDefaultAvatar();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


}
