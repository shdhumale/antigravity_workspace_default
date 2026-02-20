import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex-1 overflow-auto bg-slate-50 p-8 text-slate-900">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Welcome Section -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Overview Dashboard</h2>
            <p class="text-slate-500 mt-1">Real-time status of your product ecosystem and user activity.</p>
          </div>
          <div class="flex gap-3">
            <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <span class="material-symbols-outlined text-lg">download</span>
              Export Data
            </button>
            <button routerLink="/products/new" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
              <span class="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">inventory_2</span>
              </div>
              <span class="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                Stable
              </span>
            </div>
            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Products</p>
            <h3 class="text-2xl font-black">{{ dashboardService.stats().totalProducts }}</h3>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">group</span>
              </div>
              <span class="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Users</p>
            <h3 class="text-2xl font-black">{{ dashboardService.stats().totalUsers }}</h3>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Est. Value</span>
            </div>
            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Inventory Value</p>
            <h3 class="text-2xl font-black">$1.2M</h3>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">rule</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Alerts</span>
            </div>
            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Pending Approvals</p>
            <h3 class="text-2xl font-black">24</h3>
          </div>
        </div>

        <!-- Recent Activity Placeholder -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold">System Status</h3>
              <p class="text-slate-500 text-sm">Real-time health monitoring of enterprise services.</p>
            </div>
            <span class="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <div class="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div class="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <span class="material-symbols-outlined text-4xl">analytics</span>
            </div>
            <div>
              <p class="font-bold text-slate-700">Detailed Analytics Coming Soon</p>
              <p class="text-sm text-slate-500">We're finalizing the integration with your data warehouse.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; overflow: hidden; }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.loadStats();
    this.dashboardService.connectWebSocket();
  }
}
