import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SuccessComponent } from './success/success.component';
import { AuthGuard } from './auth.guard';
export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'success', component: SuccessComponent, canActivate: [AuthGuard] } 
  ];
  