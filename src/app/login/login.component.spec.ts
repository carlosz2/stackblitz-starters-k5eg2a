import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AuthGuard } from '../auth.guard';

/**
 * Mock del Router para pruebas.
 */
class RouterMock {
  navigate(path: string[]) {}
}

/**
 * Mock del AuthGuard para pruebas.
 */
class AuthGuardMock {
  login() {}
  logout() {}
  canActivate() {
    return true;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authGuard: AuthGuard;
  let emailInput: DebugElement;
  let passwordInput: DebugElement;
  let submitButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule], // Importar el componente standalone
      providers: [
        { provide: Router, useClass: RouterMock }, // Proveer el mock del Router
        { provide: AuthGuard, useClass: AuthGuardMock } // Proveer el mock del AuthGuard
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authGuard = TestBed.inject(AuthGuard);
    fixture.detectChanges();

    // Obtener referencias a los elementos del DOM
    emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
  });

  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('El formulario debería ser inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('El campo de email debería ser válido con una dirección de correo electrónico válida', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('El campo de password debería ser válido con una contraseña de al menos 6 caracteres', () => {
    const password = component.loginForm.controls['password'];
    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  it('El botón de login debería estar deshabilitado si el formulario es inválido', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('El botón de login debería estar habilitado si el formulario es válido', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('Debería navegar a "/success" al enviar el formulario válido', () => {
    spyOn(router, 'navigate');
    spyOn(authGuard, 'login');

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();

    submitButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(authGuard.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/success']);
  });

  it('Debería mostrar mensajes de error cuando los campos son inválidos y han sido tocados', () => {
    const emailError = fixture.debugElement.query(By.css('.error small'));
    expect(emailError).toBeNull(); // No hay errores inicialmente

    // Marcar el campo de email como tocado y sin valor
    component.loginForm.controls['email'].markAsTouched();
    fixture.detectChanges();

    const updatedEmailError = fixture.debugElement.query(By.css('.error small'));
    expect(updatedEmailError).not.toBeNull();
    expect(updatedEmailError.nativeElement.textContent).toContain('El email es requerido.');
  });
});
