import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth.guard'; // Importa el guard

/**
 * Componente de Login que maneja la autenticación de usuarios.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class LoginComponent {
  /** Formulario reactivo para el login */
  loginForm: FormGroup;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para construir el formulario reactivo.
   * @param router - Router para navegar después del login exitoso.
   * @param authGuard - AuthGuard para marcar al usuario como logueado.
   */
  constructor(private fb: FormBuilder, private router: Router, private authGuard: AuthGuard) {
    // Inicialización del formulario con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email con validación requerida y formato de email
      password: ['', [Validators.required, Validators.minLength(6)]], // Campo de contraseña con validación requerida y mínimo 6 caracteres
      rememberMe: [false] // Checkbox para recordar sesión
    });
  }

  /**
   * Método que se ejecuta al enviar el formulario.
   * Valida el formulario y realiza la lógica de autenticación.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      // Marca al usuario como logueado
      this.authGuard.login();
      // Navega a la página de éxito
      this.router.navigate(['/success']);
    }
  }
}