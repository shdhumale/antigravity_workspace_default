import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent),
        data: { role: 'MANAGER' }
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/products/product-wizard.component').then(m => m.ProductWizardComponent),
        data: { role: 'MANAGER' }
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./features/products/product-wizard.component').then(m => m.ProductWizardComponent),
        data: { role: 'MANAGER' }
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list.component').then(m => m.UserListComponent),
        data: { role: 'SUPER_ADMIN' }
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form.component').then(m => m.UserFormComponent),
        data: { role: 'SUPER_ADMIN' }
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit-log.component').then(m => m.AuditLogComponent),
        data: { role: 'ADMIN' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
