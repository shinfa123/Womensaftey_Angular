import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { AdminComplaintsComponent } from './pages/admin-complaints/complaints.component';
import { UserComplaintsComponent } from './pages/user-complaints/user-complaints.component';
import { AddComplaintComponent } from './pages/add-complaint/add-complaint.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'complaints', component: ComplaintsComponent, canActivate: [authGuard] },
  { path: 'admin-complaints', component: AdminComplaintsComponent, canActivate: [authGuard] },
  { path: 'user-complaints', component: UserComplaintsComponent, canActivate: [authGuard] },
  { path: 'add-complaint', component: AddComplaintComponent, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard] },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
