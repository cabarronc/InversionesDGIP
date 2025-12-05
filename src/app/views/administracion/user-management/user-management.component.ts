import { Component, Input, OnInit } from '@angular/core';
import { User, Role, Permission } from '../../../services/auth.service'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, CreateUserData, UpdateUserData } from '../../../services/user.service'
import { CommonModule } from '@angular/common';
import { InputsModule, KENDO_INPUTS, InputType } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { DialogComponent, DialogTitleBarComponent } from "@progress/kendo-angular-dialog";
import { IconsModule } from '@progress/kendo-angular-icons';
import { eyeIcon, eyeSlashIcon } from '@progress/kendo-svg-icons';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { AutoCompleteComponent, DropDownsModule, KENDO_COMBOBOX } from "@progress/kendo-angular-dropdowns"
import { GridDataResult, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { AvatarUploadComponent } from "../../uploads/avatar-upload/avatar-upload.component";






@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, KENDO_INPUTS,
    KENDO_LABELS,
    KENDO_BUTTONS, KENDO_COMBOBOX,
    KENDO_LAYOUT, DialogComponent, DialogTitleBarComponent, IconsModule, KENDO_GRID, AvatarUploadComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  @Input() selectedItem: string | undefined;
  public statusOptions: Array<{ text: string; value: string }> = [
    { text: 'Todos', value: '' },
    { text: 'Activos', value: 'active' },
    { text: 'Inactivos', value: 'inactive' }
  ];
  public eyeIcon = eyeSlashIcon;
  public eyeIcon2 = eyeSlashIcon;
  public confirmEyeIcon = eyeSlashIcon;
  public confirmEyeIcon2 = eyeSlashIcon;
  public correoList: Array<string> = [


  ];

  public passInputType: InputType = 'password';
  public passInputType2: InputType = 'password';
  public confirmInputType: InputType = "password";
  public confirmInputType2: InputType = "password"
  Math = Math;
  // users: User[] = [];
  users: GridDataResult = { data: [], total: 0 };
  availableRoles: Role[] = [];
  loading = false;
  submitting = false;
  showModal = false;
  editingUser: User | null = null;
  searchTerm = '';
  statusFilter: any;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  userForm: FormGroup;
  selectedRoles: string[] = [];

  roles: Role[] = [];
  permissions: Permission[] = [];

  loadingRoles = false;
  loadingPermissions = false;
  submittingRole = false;
  submittingPermission = false;

  showRoleModal = false;
  showPermissionModal = false;
  editingRole: Role | null = null;
  editingPermission: Permission | null = null;

  roleForm: FormGroup;
  permissionForm: FormGroup;
  selectedPermissions: string[] = [];

  public currentAvatarUrl: string = '';

navidadActiva = false;

toggleNavidad(estado: boolean) {
  this.navidadActiva = estado;

  if (estado) {
    document.body.classList.add('modo-navidad');
  
  } else {
    document.body.classList.add('modo-navidad');

  }
}
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder, private notificationService: NotificationService
  ) {
    

    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['',[Validators.required, Validators.minLength(8)]],
      active: [true]
    }, { validator: this.passwordsMatchValidator });
      // ----------------------


    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      active: [true]
    });

    this.permissionForm = this.formBuilder.group({
      module: ['', [Validators.required]],
      action: ['', [Validators.required]],
      description: ['']
    });



  }
    // Validador personalizado
  // ----------------------
 passwordsMatchValidator(formGroup: FormGroup) {
  const passwordControl = formGroup.get('password');
  const confirmControl = formGroup.get('passwordConfirm');

  if (!passwordControl || !confirmControl) return null;

  const password = passwordControl.value || '';
  const confirm = confirmControl.value || '';

  // Si ambos campos tienen valor
  if (password && confirm) {
    if (password !== confirm) {
      confirmControl.setErrors({ passwordsMismatch: true });
    } else {
      // Limpia el error si ahora coinciden
      confirmControl.setErrors(null);
    }
  }

  return null; // siempre retorna null porque estamos marcando el control individualmente
}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadPermissions()
    this.currentAvatarUrl = this.editingUser?.avatar ? this.getAvatarUrl(this.editingUser.id, this.editingUser.avatar) : '';
  }
  loademail() {

  }
  public onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.skip / event.take + 1;
    this.itemsPerPage = event.take;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    let filter = '';

    if (this.searchTerm) {
      filter += `(name ~ "${this.searchTerm}" || email ~ "${this.searchTerm}")`;
    }

    if (this.statusFilter) {
      const activeFilter = this.statusFilter === 'active' ? 'active = true' : 'active = false';
      filter = filter ? `${filter} && ${activeFilter}` : activeFilter;
    }

    this.userService.getUsers(this.currentPage, this.itemsPerPage, filter)
      .subscribe({
        next: (response) => {
          // this.users = response.items;
          this.users = {
            data: response.items,
            total: response.totalItems
          };
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.loading = false;
          console.log(this.users)
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
          console.error('Detalles:', error.data);
        }
      });
  }


  loadRoles(): void {
    this.loadingRoles = true;
    this.userService.getRoles().subscribe({
      next: (response) => {
        this.availableRoles = response.items.filter(role => role.active);
        this.roles = response.items;
        console.log(this.availableRoles)
        console.log("roles", this.roles)
        this.loadingRoles = false;
      },
      error: (error) => {
        this.loadingRoles = false;
        console.error('Error loading roles:', error);
        console.error('Detalles:', error.data);
      }
    });
  }

  loadPermissions(): void {
    this.loadingPermissions = true;
    this.userService.getPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        console.log()
        this.loadingPermissions = false;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.loadingPermissions = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.selectedRoles = [];
    this.userForm.reset({ active: true });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userForm.get('passwordConfirm')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    console.log("que valor trae esta baina", this.editingUser.avatar)
    this.selectedRoles = user.roles?.map(role => role.id) || [];
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      active: user.active,
      avatar: this.currentAvatarUrl,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('passwordConfirm')?.clearValidators();
    if (this.editingUser.avatar) {
      this.currentAvatarUrl = this.getAvatarUrl(this.editingUser.id, this.editingUser.avatar);
      console.log("url actualizada",this.currentAvatarUrl)
    } else {
      this.currentAvatarUrl = '';
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.selectedRoles = [];
    this.userForm.reset();
  }

  onRoleChange(event: any, roleId: string): void {
    if (event.target.checked) {
      this.selectedRoles.push(roleId);
      console.log(this.selectedRoles)
    } else {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
      console.log(this.selectedRoles)
    }
  }



  onSubmit(): void {
    if (this.userForm.valid) {
      this.submitting = true;

      const formData = this.userForm.value;

      if (this.editingUser) {
        // Actualizar usuario
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          active: formData.active,
          roles: this.selectedRoles,
        };
        this.userService.updateUser(this.editingUser.id, updateData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeModal();
            this.submitting = false;
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.submitting = false;
          }
        });
      } else {
        // Crear usuario
        const createData: CreateUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          active: formData.active,
          roles: this.selectedRoles
        };
        console.log("que enviare", createData)
        this.userService.createUser(createData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeModal();
            this.submitting = false;
              this.notificationService.show({
              content: "Se a creado exitosamente el usuario "+ createData.name,
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "success", icon: true },
              position: { horizontal: "center", vertical: "top" },
            });

          },
          error: (error) => {
            this.notificationService.show({
              content: JSON.stringify(error.message),
              hideAfter: 2500,
              animation: { type: "slide", duration: 2500 },
              type: { style: "warning", icon: true },
              position: { horizontal: "center", vertical: "bottom" },
            });
            console.error('Error creating user:', error);
            console.error('Detalles:', error.message);
            this.submitting = false;
          }
        });
      }
    }
  }

  confirmDelete(user: User): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }


  public togglePassVisibility(isConfirmField?: boolean): void {
    if (isConfirmField) {
      const isHidden = this.confirmInputType === "password";
      this.confirmEyeIcon = isHidden ? eyeIcon : eyeSlashIcon;
      this.confirmInputType = isHidden ? "text" : "password";
    } else {
      const isHidden = this.passInputType === "password";
      this.eyeIcon = isHidden ? eyeIcon : eyeSlashIcon;
      this.passInputType = isHidden ? "text" : "password";
    }
  }

  public togglePassConfirmVisibility(isConfirmField2?: boolean): void {
    if (isConfirmField2) {
      const isHidden = this.confirmInputType2 === "password";
      this.confirmEyeIcon2 = eyeIcon;
      this.confirmInputType2 = isHidden ? "text" : "password";
    } else {
      const isHidden = this.passInputType2 === "password";
      this.eyeIcon2 = isHidden ? eyeIcon : eyeSlashIcon;
      this.passInputType2 = isHidden ? "text" : "password";
    }
  }


  // ========== GESTIÓN DE ROLES ==========
  openRoleModal(): void {
    this.editingRole = null;
    this.selectedPermissions = [];
    this.roleForm.reset({ active: true });
    this.showRoleModal = true;
  }

  editRole(role: Role): void {
    this.editingRole = role;
    this.selectedPermissions = role.permissions?.map(p => p.id) || [];
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      active: role.active
    });
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.editingRole = null;
    this.selectedPermissions = [];
    this.roleForm.reset();
  }

  onPermissionChange(event: any, permissionId: string): void {
    if (event.target.checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
  }

  onSubmitRole(): void {
    if (this.roleForm.valid) {
      this.submittingRole = true;
      const formData = { ...this.roleForm.value, permissions: this.selectedPermissions };

      const operation = this.editingRole
        ? this.userService.updateRole(this.editingRole.id, formData)
        : this.userService.createRole(formData);

      operation.subscribe({
        next: () => {
          this.loadRoles();
          this.closeRoleModal();
          this.submittingRole = false;
        },
        error: (error) => {
          console.error('Error saving role:', error);
          this.submittingRole = false;
        }
      });
    }
  }

  confirmDeleteRole(role: Role): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el rol "${role.name}"?`)) {
      this.userService.deleteRole(role.id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error deleting role:', error);
          alert('Error al eliminar el rol');
        }
      });
    }
  }

  // ========== GESTIÓN DE PERMISOS ==========
  openPermissionModal(): void {
    this.editingPermission = null;
    this.permissionForm.reset();
    this.showPermissionModal = true;
  }

  editPermission(permission: Permission): void {
    this.editingPermission = permission;
    this.permissionForm.patchValue({
      module: permission.module,
      action: permission.action,
      description: permission.description
    });
    this.showPermissionModal = true;
  }

  closePermissionModal(): void {
    this.showPermissionModal = false;
    this.editingPermission = null;
    this.permissionForm.reset();
  }

  onSubmitPermission(): void {
    if (this.permissionForm.valid) {
      this.submittingPermission = true;
      const formData = this.permissionForm.value;

      const operation = this.editingPermission
        ? this.userService.updatePermission(this.editingPermission.id, formData)
        : this.userService.createPermission(formData);

      operation.subscribe({
        next: () => {
          this.loadPermissions();
          this.loadRoles(); // Recargar roles para actualizar permisos
          this.closePermissionModal();
          this.submittingPermission = false;
        },
        error: (error) => {
          console.error('Error saving permission:', error);
          this.submittingPermission = false;
        }
      });
    }
  }

  confirmDeletePermission(permission: Permission): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el permiso "${permission.module}: ${permission.action}"?`)) {
      this.userService.deletePermission(permission.id).subscribe({
        next: () => {
          this.loadPermissions();
          this.loadRoles(); // Recargar roles para actualizar permisos
        },
        error: (error) => {
          console.error('Error deleting permission:', error);
          alert('Error al eliminar el permiso');
        }
      });
    }
  }

  // ========== MÉTODOS AUXILIARES ==========
  getPermissionsByModule(): { name: string, permissions: Permission[] }[] {
    const modules: { [key: string]: Permission[] } = {};

    this.permissions.forEach(permission => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
    });

    return Object.keys(modules).map(moduleName => ({
      name: moduleName,
      permissions: modules[moduleName]
    }));
  }
  //===============================MANEJO DE AVATARES=============================
  onAvatarChanged(avatarUrl: string): void {

    // El avatar se actualiza automáticamente en PocketBase
    // Solo necesitamos recargar la lista si es necesario
    this.currentAvatarUrl = avatarUrl;
    if (this.editingUser) {
      this.editingUser.avatar = avatarUrl;
    }
  }
  // Propiedad para mantener la URL actual del avatar


  // Cuando se emite un cambio de avatar desde el componente hijo
  // onAvatarChanged(newUrl: string): void {
  //   // Actualiza la URL temporal que usamos en el template
  //   this.currentAvatarUrl = newUrl;

  //   // Si editingUser existe, actualizamos su avatar
  //   if (this.editingUser) {
  //     this.editingUser.avatar = newUrl;
  //   }
  // }

  onAvatarUploadError(error: string): void {
    console.error('Avatar upload error:', error);
    // Mostrar toast o mensaje de error
  }

  // getAvatarUrl(userId: string, avatar: string): string {
  //   if (!avatar) return '';
  //   return `http://localhost:8090/api/files/users/${userId}/${avatar}`;
  // }

  getAvatarUrl(userId: string | undefined, avatar: string | undefined): string {
    console.log("avatar", avatar)
    console.log("usuario", userId)
    if (!avatar) return '';
    // Construir URL del avatar desde PocketBase
    const url_completa = `http://172.31.33.105:9000/api/files/users/${this.editingUser?.id}/${avatar}`;
    console.log("urlcompleta", url_completa)
    return url_completa
  }
}
