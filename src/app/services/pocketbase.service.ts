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
}
