
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputType, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import {eyeIcon, eyeSlashIcon,questionCircleIcon, SVGIcon} from '@progress/kendo-svg-icons';
import { DialogComponent, DialogTitleBarComponent } from "@progress/kendo-angular-dialog";
import { IconsModule } from "@progress/kendo-angular-icons";
import { KENDO_TOOLTIPS } from "@progress/kendo-angular-tooltip";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, KENDO_INPUTS,
    KENDO_LABELS,
    KENDO_BUTTONS,
    KENDO_LAYOUT, DialogComponent, DialogTitleBarComponent, IconsModule,KENDO_TOOLTIPS,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loading = false;
  loadingReset = false;
  errorMessage = '';
  showPassword = false;
  showForgotPassword = false;
  returnUrl: string = '';
public questionCircleIcon: SVGIcon = questionCircleIcon;
  public eyeIcon = eyeSlashIcon;
  public confirmEyeIcon = eyeSlashIcon;

  public passInputType: InputType = "password";
  public confirmInputType: InputType = "password";
  

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
        const { email, password,rememberMe  } = this.loginForm.value;
        await this.authService.login(email, password,rememberMe || false);
        
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
 

}
