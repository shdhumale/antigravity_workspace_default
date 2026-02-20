import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <span class="material-symbols-outlined">shield</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-white leading-none">Enterprise</h1>
              <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Product Management v2.4</p>
            </div>
          </div>

          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-8">Please enter your credentials to access your account.</p>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" for="email">Email Address</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="credentials.email"
                  required
                  email
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" for="password">Password</label>
                <a href="#" class="text-xs font-bold text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="credentials.password"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" id="remember" class="rounded border-slate-300 text-blue-600 focus:ring-blue-600">
              <label for="remember" class="text-sm text-slate-600 dark:text-slate-400 font-medium">Remember for 30 days</label>
            </div>

            @if (error()) {
              <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">error</span>
                {{ error() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              @if (isLoading()) {
                <div class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <span class="material-symbols-outlined text-[18px]">login</span>
              }
              Sign In
            </button>
          </form>

          <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account yet?
            <a href="#" class="font-bold text-blue-600 hover:underline">Contact Administrator</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid email or password');
        this.isLoading.set(false);
      }
    });
  }
}
