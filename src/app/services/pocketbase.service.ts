import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import PocketBase from 'pocketbase';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {

  private pb: PocketBase;

  constructor(private http: HttpClient) {
    this.pb = new PocketBase('http://172.31.33.230:9000'); // Cambiar URL según el entorno
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
  async agregarProyectoAmpliacion(ampliaciones_id: string, nombre_proyecto: string, dependencia: string, monto: number) {
    try {
    return await this.pb.collection('ampliaciones_proy').create({
      ampliaciones_id,
      nombre_proyecto,
      dependencia,
      monto
    });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    throw error;
  }
  }
  async agregarProyectoReduccion(reducciones_id: string, nombre_proyecto: string, dependencia: string, monto: number) {
    try {
    return await this.pb.collection('reducciones_proy').create({
      reducciones_id,
      nombre_proyecto,
      dependencia,
      monto
    });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    throw error;
  }
  }
  //Método para obtener registros de una colección
  async getRecords(nombre_coleccion: string) {
    try {
      const records = await this.pb.collection(nombre_coleccion).getFullList();
      return records;
    } catch (error) {
      console.error('Error al obtener los registros:', error);
      throw error;
    }
  }

  async getRecords_ampliacion_proy(nombre_coleccion: string,dataItem:any) {
    try {
      const records = await this.pb.collection(nombre_coleccion).getList(1, 50, { filter: `ampliaciones_id='${dataItem}'` })
      return records;
    } catch (error) {
      console.error('Error al obtener los registros:', error);
      throw error;
    }
  }

  async getRecords_reduccion_proy(nombre_coleccion: string,dataItem:any) {
    try {
      const records = await this.pb.collection(nombre_coleccion).getList(1, 50, { filter: `reducciones_id='${dataItem}'` })
      return records;
    } catch (error) {
      console.error('Error al obtener los registros:', error);
      throw error;
    }
  }

  // Método para actualizar un registro en una colección
  async updateRecord(ampliaciones: string, ampliacionesProy: string, ar_id:string, id: string, data: any, data2:any) {

    try {
      const updatedRecord = await this.pb.collection(ampliaciones).update(id, data);
      // 2. Obtener los registros relacionados en la tabla secundaria (ampliaciones_proy)
      const relatedRecords = await this.pb.collection(ampliacionesProy).getFullList(200, {
        filter: `${ar_id} = "${id}"`  // Ajusta esto dependiendo de cómo esté relacionada tu base de datos
        });
      /// 3. Filtrar los datos que quieres actualizar en ampliaciones_proy
       // 4. Actualizar cada registro relacionado en ampliaciones_proy
       for (let i = 0; i < relatedRecords.length; i++) {
        if (data2[i]) { // Evita errores si data2 tiene menos elementos que relatedRecords
          const fieldsToUpdate = {
            nombre_proyecto: data2[i].nombre_proyecto,
            dependencia: data2[i].dependencia,
            monto: data2[i].monto
          };
      
          console.log(`Actualizando registro ID: ${relatedRecords[i].id} con`, fieldsToUpdate);
      
          await this.pb.collection(ampliacionesProy).update(relatedRecords[i].id, fieldsToUpdate);
        } else {
          console.warn(`No hay suficientes proyectos en data2 para actualizar el registro ${relatedRecords[i].id}`);
        }
      }
     
      return updatedRecord;

    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      throw error;
    }
  }

}
