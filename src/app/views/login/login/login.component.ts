import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    ButtonModule,
    MessageModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loading = false;
  loadingReset = false;
  errorMessage = '';
  showPassword = false;
  showForgotPassword = false;
  returnUrl: string = '';

  passInputType: 'password' | 'text' = 'password';

  // Icono del ojo: se recalcula solo según passInputType (no se asigna)
  get eyeIcon(): string {
    return this.passInputType === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash';
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Obtener la URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/principal';

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const { email, password, rememberMe } = this.loginForm.value;
        await this.authService.login(email, password, rememberMe || false);

        // Redirigir a la página solicitada o al dashboard
        this.router.navigate([this.returnUrl]);

      } catch (error: any) {
        this.errorMessage = error.message || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    }
  }

  async onForgotPassword(): Promise<void> {
    if (this.forgotPasswordForm.valid) {
      this.loadingReset = true;

      try {
        const { email } = this.forgotPasswordForm.value;
        console.log('correo:', email);
        await this.authService.requestPasswordReset(email);

        alert('Se ha enviado un email con instrucciones para restablecer tu contraseña');
        this.showForgotPassword = false;
        this.forgotPasswordForm.reset();

      } catch (error: any) {
        alert('Error: ' + (error.message || 'No se pudo enviar el email'));
      } finally {
        this.loadingReset = false;
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public togglePassVisibility(): void {
    this.passInputType = this.passInputType === 'password' ? 'text' : 'password';
  }
}