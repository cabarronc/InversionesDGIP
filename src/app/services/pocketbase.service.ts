import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {

  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://172.31.33.102:9000'); // Cambiar URL según el entorno
  }


  getCollectionData() {
    return this.pb.collection('directorio').getFullList();
  }
  getDependencias() {
    return this.pb.collection('dependencias').getFullList();
  }
  getCopias() {
    return this.pb.collection('copias').getFullList();
  }

  // Método para insertar un registro en una colección
  async addRecord(ampliaciones: string, data: any) {
    try {
      const record = await this.pb.collection(ampliaciones).create(data);
      return record;
    } catch (error) {
      console.error('Error al insertar el registro:', error);
      throw error;
    }
  }

  // Método para obtener registros de una colección
  async getRecords(ampliaciones: string) {
    try {
      const records = await this.pb.collection(ampliaciones).getFullList();
      return records;
    } catch (error) {
      console.error('Error al obtener los registros:', error);
      throw error;
    }
  }

  // Método para actualizar un registro en una colección
  async updateRecord(ampliaciones: string, id: string, data: any) {
    try {
      const updatedRecord = await this.pb.collection(ampliaciones).update(id, data);
      return updatedRecord;
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      throw error;
    }
  }

}
