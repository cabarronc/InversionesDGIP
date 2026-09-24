import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import PocketBase from 'pocketbase';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export type TablaTipo = 'Obra' | 'SED' | 'SAP';
@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
   private authService = inject(AuthService);
  private get pb() {
    return this.authService.getPocketBase();
  }

  constructor(private http: HttpClient) {
   
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
////Simulador
  getCollectionProySim(){
    return this.pb.collection('proyectoSimulador').getFullList();
  }

    async crearProy(collection: string, data: any) {
    return await this.pb.collection(collection).create(data);
  }
  //Crear simulacion
     async crearSim(collection: string, data: any) {
    return await this.pb.collection(collection).create(data);
  }
  //buscar
  buscarPorClave(collection: string, clave: string) {
  return this.pb.collection(collection)
    .getFirstListItem(`clave="${clave}"`)
    .catch(() => null);
}
  //Actualizar simulacion
 async actualizarSim(collection: string, id: string, data: any) {
  return await this.pb.collection(collection).update(id, data);
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

  // --- Ediciones de campo ---
  async guardarEdicion(registro_id: string, tabla: TablaTipo, campo: string, valor: any) {
    const filtro = `registro_id="${registro_id}" && campo="${campo}"`;
    const existente = await this.pb.collection('ediciones_obra')
      .getFirstListItem(filtro).catch(() => null);

    if (existente) {
      return this.pb.collection('ediciones_obra').update(existente.id, { 
        valor: String(valor),
        usuario: this.pb.authStore.record?.id?? null 
      });
    }
    return this.pb.collection('ediciones_obra').create({
      registro_id, tabla, campo, valor: String(valor),
      usuario: this.pb.authStore.record?.id ?? null
    });
  }

  async cargarEdiciones() {
    return this.pb.collection('ediciones_obra').getFullList({ expand: 'usuario' });
  }

  suscribirEdiciones(callback: (e: any) => void) {
     return this.pb.collection('ediciones_obra').subscribe('*', callback, { expand: 'usuario' });
  }

  // --- Eliminaciones ---
  async guardarEliminacion(registro_id: string, tabla: TablaTipo) {
    const filtro = `registro_id="${registro_id}" && tabla="${tabla}"`;
    const existente = await this.pb.collection('eliminados_obra')
      .getFirstListItem(filtro).catch(() => null);
    if (existente) return existente; // ya estaba marcado

    return this.pb.collection('eliminados_obra').create({
      registro_id, tabla, usuario: this.pb.authStore.record?.id
    });
  }

  async cargarEliminados() {
    return this.pb.collection('eliminados_obra').getFullList();
  }

  suscribirEliminados(callback: (e: any) => void) {
    return this.pb.collection('eliminados_obra').subscribe('*', callback);
  }

  desuscribirTodo() {
    this.pb.collection('ediciones_obra').unsubscribe();
    this.pb.collection('eliminados_obra').unsubscribe();
  }

}
