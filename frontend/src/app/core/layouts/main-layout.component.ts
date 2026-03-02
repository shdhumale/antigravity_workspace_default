import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-slate-100 antialiased font-display">
      <!-- Sidebar Navigation -->
      <aside class="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101922] flex flex-col">
        <div class="p-6 flex items-center gap-3">
          <div class="bg-[#137fec] rounded-lg p-1.5 text-white">
            <span class="material-symbols-outlined block text-2xl">layers</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-slate-900 dark:text-white text-base font-bold leading-none">Enterprise</h1>
            <p class="text-slate-500 text-xs font-medium">Product Management</p>
          </div>
        </div>

        <nav class="flex-1 px-4 space-y-1 py-4">
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all"
             routerLink="/dashboard" routerLinkActive="bg-[#137fec]/10 text-[#137fec] font-bold"
             [routerLinkActiveOptions]="{exact: true}">
            <span class="material-symbols-outlined text-xl">dashboard</span>
            <span class="text-sm">Dashboard</span>
          </a>
          
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
             routerLink="/products" routerLinkActive="bg-[#137fec]/10 text-[#137fec] font-bold">
            <span class="material-symbols-outlined text-xl">inventory_2</span>
            <span class="text-sm">Products</span>
          </a>

          <a *ngIf="isAdmin()" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
             routerLink="/users" routerLinkActive="bg-[#137fec]/10 text-[#137fec] font-bold">
            <span class="material-symbols-outlined text-xl">group</span>
            <span class="text-sm">Users</span>
          </a>

          <a *ngIf="isAdmin()" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
             routerLink="/audit" routerLinkActive="bg-[#137fec]/10 text-[#137fec] font-bold">
            <span class="material-symbols-outlined text-xl">monitoring</span>
            <span class="text-sm">Audit Logs</span>
          </a>

          <div class="pt-4 pb-2">
            <span class="px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">Settings</span>
          </div>
          
          <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors" href="#">
            <span class="material-symbols-outlined text-xl">settings</span>
            <span class="text-sm">Preferences</span>
          </a>
        </nav>

        <div class="p-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
            <div class="h-8 w-8 rounded-full bg-[#137fec]/20 flex items-center justify-center text-[#137fec]">
              <span class="material-symbols-outlined text-sm font-bold">person</span>
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-xs font-bold text-slate-900 dark:text-white truncate">
                {{ user()?.firstName }} {{ user()?.lastName }}
              </p>
              <p class="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{{ user()?.role }}</p>
            </div>
            <button (click)="logout()" class="text-slate-400 hover:text-slate-600 transition-colors">
              <span class="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 bg-[#f6f7f8] dark:bg-[#101922]">
        <!-- Header -->
        <header class="h-16 flex-shrink-0 flex items-center justify-between px-8 bg-white dark:bg-[#101922] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div class="flex items-center gap-4">
            <nav class="flex text-sm text-slate-500 font-medium">
              <a class="hover:text-[#137fec] transition-colors" href="#">Home</a>
              <span class="mx-2 text-slate-300">/</span>
              <span class="text-slate-900 dark:text-white font-bold capitalize">{{ currentRouteTitle() }}</span>
            </nav>
          </div>
          <div class="flex items-center gap-6">
            <div class="relative w-64 hidden md:block">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input class="w-full pl-10 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#137fec]/20 transition-all outline-none" placeholder="Search system..." type="text"/>
            </div>
            <div class="flex items-center gap-3">
              <button class="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative transition-colors">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#101922]"></span>
              </button>
              <button class="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <span class="material-symbols-outlined">chat_bubble</span>
              </button>
            </div>
          </div>
        </header>

        <!-- View Content -->
        <div class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .font-display { font-family: 'Manrope', 'Inter', sans-serif; }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }

  isAdmin() {
    const role = this.user()?.role;
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  currentRouteTitle() {
    // Basic route title extraction
    const url = window.location.pathname;
    const parts = url.split('/').filter(p => p);
    return parts.length > 0 ? parts[parts.length-1].replace(/-/g, ' ') : 'Dashboard';
  }
}
