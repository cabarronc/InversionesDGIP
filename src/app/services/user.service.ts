import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';
import { User, Role, Permission } from './auth.service';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  roles?: string[];
  active?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  roles?: string[];
  active?: boolean;
  avatar?: File;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.ApiPocketBase;
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(this.apiUrl);
  }
  // ========== CRUD USUARIOS ==========
  getUsers(page: number = 1, perPage: number = 10, filter?: string): Observable<{ items: User[], totalItems: number, totalPages: number }> {
    return from(this.pb.collection('users').getList(page, perPage, {
      expand: 'roles,roles.permissions',
      filter: filter || '',
      sort: '-created'
    }).then(result => ({
      items: result.items.map(user => ({
        id: user.id,
        email: user['email'],
        name: user['name'],
        avatar: user['avatar'],
        active: user['active'],
       roles: Array.isArray(user.expand?.['roles'])
    ? user.expand['roles'].map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          active: role.active,
          permissions: Array.isArray(role.expand?.['permissions'])
          ? role.expand['permissions'].map((perm: any) => ({
            id: perm.id,
            module: perm.module,
            action: perm.action,
            description: perm.description
          })) : []
        })) : []
      })),
      totalItems: result.totalItems,
      totalPages: result.totalPages
    })));
    
  }

  getUserById(id: string): Observable<User> {
    return from(this.pb.collection('users').getOne(id, {
      expand: 'roles,roles.permissions'
    }).then(user => ({
      id: user.id,
      email: user['email'],
      name: user['name'],
      avatar: user['avatar'],
      active: user['active'],
      roles: user.expand?.['roles']?.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        active: role.active,
        permissions: role.expand?.permissions?.map((perm: any) => ({
          id: perm.id,
          module: perm.module,
          action: perm.action,
          description: perm.description
        })) || []
      })) || []
    })));
  }

  createUser(userData: CreateUserData): Observable<User> {
    return from(this.pb.collection('users').create({
      ...userData,
      active: userData.active ?? true
    }).then(user => ({
      id: user.id,
      email: user['email'],
      name: user['name'],
      active: user['active'],

      roles: []
    })));
  }

  updateUser(id: string, userData: UpdateUserData): Observable<User> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'roles' && Array.isArray(value)) {
        value.forEach(roleId => formData.append('roles', roleId));
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });

    return from(this.pb.collection('users').update(id, formData).then(user => ({
      id: user.id,
      email: user['email'],
      name: user['name'],
      avatar: user['avatar'],
      active: user['active'],
      roles: []
    })));
  }

  deleteUser(id: string): Observable<boolean> {
    return from(this.pb.collection('users').delete(id).then(() => true));
  }

  // ========== CRUD ROLES ==========
  getRoles(page: number = 1, perPage: number = 50): Observable<{ items: Role[], totalItems: number }> {
    return from(this.pb.collection('roles').getList(page, perPage, {
      expand: 'permissions',
      sort: 'name'
    }).then(result => ({
      items: result.items.map(role => ({
        id: role.id,
        name: role['name'],
        description: role['description'],
        active: role['active'],
        permissions: Array.isArray(role.expand?.['permissions'])
          ? role.expand['permissions'].map((perm: any) => ({
          id: perm.id,
          module: perm.module,
          action: perm.action,
          description: perm.description
        })) : []
      })),
      totalItems: result.totalItems
    })));
  }

  createRole(roleData: { name: string, description?: string, permissions?: string[], active?: boolean }): Observable<Role> {
    return from(this.pb.collection('roles').create({
      ...roleData,
      active: roleData.active ?? true
    }).then(role => ({
      id: role.id,
      name: role['name'],
        description: role['description'],
        active: role['active'],
      permissions: []
    })));
  }

  updateRole(id: string, roleData: { name?: string, description?: string, permissions?: string[], active?: boolean }): Observable<Role> {
    return from(this.pb.collection('roles').update(id, roleData).then(role => ({
      id: role.id,
     name: role['name'],
        description: role['description'],
        active: role['active'],
      permissions: []
    })));
  }

  deleteRole(id: string): Observable<boolean> {
    return from(this.pb.collection('roles').delete(id).then(() => true));
  }

  // ========== CRUD PERMISOS ==========
  getPermissions(): Observable<Permission[]> {
    return from(this.pb.collection('permissions').getFullList({
      sort: 'module,action'
    }).then(permissions =>
      permissions.map(perm => ({
        id: perm.id,
        module: perm['module'],
        action: perm['action'],
        description: perm['description']
      }))
    ));
  }

  createPermission(permissionData: { module: string, action: string, description?: string }): Observable<Permission> {
    return from(this.pb.collection('permissions').create(permissionData).then(perm => ({
      id: perm.id,
       module: perm['module'],
        action: perm['action'],
        description: perm['description']
    })));
  }

  updatePermission(id: string, permissionData: { module?: string, action?: string, description?: string }): Observable<Permission> {
    return from(this.pb.collection('permissions').update(id, permissionData).then(perm => ({
      id: perm.id,
      module: perm['module'],
        action: perm['action'],
        description: perm['description']
    })));
  }

  deletePermission(id: string): Observable<boolean> {
    return from(this.pb.collection('permissions').delete(id).then(() => true));
  }

  // ========== MÉTODOS AUXILIARES ==========
  searchUsers(query: string): Observable<User[]> {
    return from(this.pb.collection('users').getFullList({
      filter: `name ~ "${query}" || email ~ "${query}"`,
      expand: 'roles'
    }).then(users =>
      users.map(user => ({
        id: user.id,
         email: user['email'],
        name: user['name'],
        avatar: user['avatar'],
        active: user['active'],
        roles: user.expand?.['roles']?.map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          active: role.active,
          permissions: []
        })) || []
      }))
    ));
  }

  getAvailableModules(): Observable<string[]> {
    return from(this.pb.collection('modules').getFullList({
      filter: 'active = true',
      sort: 'name'
    }).then(modules => modules.map(m => m['name'])));
  }

  getUsersCount(): Observable<number> {
    return from(this.pb.collection('users').getList(1, 1).then(result => result.totalItems));
  }

  getActiveUsersCount(): Observable<number> {
    return from(this.pb.collection('users').getList(1, 1, {
      filter: 'active = true'
    }).then(result => result.totalItems));
  }
}
