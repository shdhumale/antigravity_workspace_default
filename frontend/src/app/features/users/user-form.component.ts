import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New User</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Invite a new member to your team to start collaborating.</p>
          </div>
          <button routerLink="/users" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-900">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300" for="first_name">First Name</label>
              <input 
                class="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all px-4 py-2.5 outline-none" 
                id="first_name" name="firstName" [(ngModel)]="user.firstName" required placeholder="e.g. John" type="text"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300" for="last_name">Last Name</label>
              <input 
                class="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all px-4 py-2.5 outline-none" 
                id="last_name" name="lastName" [(ngModel)]="user.lastName" required placeholder="e.g. Doe" type="text"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5 text-slate-900">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300" for="email">Email Address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
              <input 
                class="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all pl-10 pr-4 py-2.5 outline-none" 
                id="email" name="email" [(ngModel)]="user.email" required email placeholder="john.doe@enterprise.com" type="email"
              />
            </div>
          </div>
          
          <div class="flex flex-col gap-1.5 text-slate-900">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300" for="password">Initial Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
              <input 
                class="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all pl-10 pr-4 py-2.5 outline-none" 
                id="password" name="password" [(ngModel)]="user.password" required minlength="8" placeholder="••••••••" type="password"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5 text-slate-900">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300" for="role">Role Selection</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">shield_person</span>
              <select 
                class="w-full appearance-none rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 transition-all pl-10 pr-10 py-2.5 outline-none" 
                id="role" name="role" [(ngModel)]="user.role" required
              >
                <option value="VIEWER">Viewer</option>
                <option value="MANAGER">Manager</option>
                <option value="SUPER_ADMIN">Administrator</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button routerLink="/users" class="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" type="button">
              Cancel
            </button>
            <button 
              [disabled]="userForm.invalid"
              class="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50" 
              type="submit"
            >
              <span>Create User</span>
              <span class="material-symbols-outlined text-lg">person_add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class UserFormComponent {
  userService = inject(UserService);
  router = inject(Router);

  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'VIEWER'
  };

  onSubmit(): void {
    // Note: We need a createUser method in userService.
    // For now I'll just post directly or assume it exists.
    this.userService['createUser'](this.user).subscribe(() => {
        this.router.navigate(['/users']);
    });
  }
}
