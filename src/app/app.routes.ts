import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', loadComponent: () => import('./features/landpage/landpage.component').then(m => m.LandpageComponent) },
    { path: 'login', loadComponent: () => import('./features/auth/signin/signin.component').then(m => m.SigninComponent) },
    { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
    { path: 'home', loadComponent: () => import('./features/app-layout/layout/layout.component').then(m => m.LayoutComponent) },
    { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) }
];
