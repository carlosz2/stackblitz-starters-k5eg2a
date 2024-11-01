import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private loggedIn: boolean = false;

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  // Método para marcar al usuario como logueado
  login() {
    this.loggedIn = true;
  }

  // Método para marcar al usuario como deslogueado
  logout() {
    this.loggedIn = false;
  }
}