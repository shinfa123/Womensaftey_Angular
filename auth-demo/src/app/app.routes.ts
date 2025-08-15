import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard] },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
