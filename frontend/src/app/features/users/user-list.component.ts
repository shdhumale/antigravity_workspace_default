import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-100">
      <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-full max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400" placeholder="Search users by name, email or role..." type="text"/>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button routerLink="/users/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20">
            <span class="material-symbols-outlined text-lg">person_add</span>
            Add New User
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-auto p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold tracking-tight mb-1 text-slate-900">User Management</h2>
          <p class="text-slate-500 text-sm">Review, manage, and update user access and administrative roles across the platform.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Users</span>
              <span class="material-symbols-outlined text-blue-600 bg-blue-600/10 p-1.5 rounded-lg">groups</span>
            </div>
            <p class="text-2xl font-extrabold">{{ userService.users().length }}</p>
          </div>
          <!-- Add other cards as symbols -->
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-slate-500">User Details</th>
                  <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-slate-500 text-center">Role</th>
                  <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-slate-500 text-center">Status</th>
                  <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (user of userService.users(); track user.id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-slate-900">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="size-10 rounded-full border-2 border-slate-100 dark:border-slate-800 bg-slate-200 flex items-center justify-center text-blue-600 font-bold">
                          {{ user.firstName[0] }}{{ user.lastName[0] }}
                        </div>
                        <div>
                          <p class="text-sm font-bold">{{ user.firstName }} {{ user.lastName }}</p>
                          <p class="text-[11px] text-slate-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        [ngClass]="{
                          'bg-blue-100 text-blue-700': user.role === 'SUPER_ADMIN',
                          'bg-amber-100 text-amber-700': user.role === 'MANAGER',
                          'bg-slate-100 text-slate-700': user.role === 'VIEWER'
                        }">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="inline-flex items-center gap-1.5 text-xs font-semibold"
                        [class.text-green-500]="user.isActive"
                        [class.text-red-500]="!user.isActive">
                        <span class="size-1.5 rounded-full" [class.bg-green-500]="user.isActive" [class.bg-red-500]="!user.isActive"></span>
                        {{ user.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button (click)="deleteUser(user.id)" class="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors" title="Delete User">
                        <span class="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe();
    }
  }
}
