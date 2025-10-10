import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private apiUrl = environment.ApiPocketBase;
  private pb: PocketBase;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  constructor() {
     this.pb = new PocketBase(this.apiUrl);
  }

  /**
   * Validar archivo antes de subir
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Verificar tipo de archivo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato no soportado. Use JPG, PNG o GIF.'
      };
    }

    // Verificar tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB.'
      };
    }

    return { valid: true };
  }

  /**
   * Redimensionar imagen antes de subir
   */
  async resizeImage(file: File, maxWidth: number = 300, maxHeight: number = 300): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob y luego a file
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        }, file.type, 0.9);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Subir avatar de usuario
   */
  uploadUserAvatar(userId: string, file: File): Observable<AvatarUploadResult> {
    return from(this._uploadUserAvatar(userId, file));
  }

  private async _uploadUserAvatar(userId: string, file: File): Promise<AvatarUploadResult> {
    try {
      // Validar archivo
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Redimensionar imagen
      const resizedFile = await this.resizeImage(file);

      // Crear FormData
      const formData = new FormData();
      formData.append('avatar', resizedFile);

      // Subir a PocketBase
      const updatedUser = await this.pb.collection('users').update(userId, formData);

      // Construir URL del avatar
      const avatarUrl = this.getAvatarUrl(userId, updatedUser["avatar"]);

      return {
        success: true,
        avatarUrl
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al subir avatar'
      };
    }
  }

  /**
   * Eliminar avatar de usuario
   */
  removeUserAvatar(userId: string): Observable<boolean> {
    return from(this._removeUserAvatar(userId));
  }

  private async _removeUserAvatar(userId: string): Promise<boolean> {
    try {
      await this.pb.collection('users').update(userId, { avatar: null });
      return true;
    } catch (error) {
      console.error('Error removing avatar:', error);
      return false;
    }
  }

  /**
   * Construir URL completa del avatar
   */
  getAvatarUrl(userId: string, avatarFilename: string): string {
    if (!avatarFilename) return '';
    return `${this.pb.baseUrl}/api/files/users/${userId}/${avatarFilename}`;
  }

  /**
   * Generar avatar por defecto basado en iniciales
   */
  generateDefaultAvatar(name: string, size: number = 100): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = size;
    canvas.height = size;

    // Colores de fondo aleatorios pero consistentes
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    // Fondo circular
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Texto (iniciales)
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const initials = name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    ctx.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL();
  }
  /**
 * Extraer nombre de archivo de avatar desde URL completa
 */
extractAvatarFilename(avatarUrl: string): string {
  try {
    // URL típica: http://localhost:8090/api/files/users/USER_ID/filename.jpg
    const parts = avatarUrl.split('/');
    return parts[parts.length - 1].split('?')[0]; // Remover query params si existen
  } catch (error) {
    console.error('Error extracting filename from URL:', avatarUrl);
    return '';
  }
}

/**
 * Verificar si una URL de avatar es válida
 */
isValidAvatarUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const cleanUrl = url.split('?')[0].toLowerCase();
    return validExtensions.some(ext => cleanUrl.endsWith(ext));
  } catch (error) {
    return false;
  }
}

}
