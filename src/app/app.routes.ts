import { Routes } from '@angular/router';
import { authGuard } from './core/routerguards/auth/auth.guard';
import { pollResolver } from './core/resolver/poll/poll.resolver';

export const routes: Routes = [

    { path: '', loadComponent: () => import('./features/landpage/landpage.component').then(m => m.LandpageComponent) },
    { path: 'login', loadComponent: () => import('./features/auth/signin/signin.component').then(m => m.SigninComponent) },
    { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },

    {
        path: 'app', loadComponent: () => import('./features/app-layout/layout/layout.component').then(m => m.LayoutComponent), canActivateChild: [authGuard],
        children: [
            { path: 'home', resolve: { poll: pollResolver }, loadComponent: () => import('./features/page/page.component').then(m => m.PageComponent) },
            { path: 'home/:id', resolve: { poll: pollResolver }, loadComponent: () => import('./features/page/page.component').then(m => m.PageComponent) },
            { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) }
        ]
    },
];
