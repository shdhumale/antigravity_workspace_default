import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuditLogService } from '../../core/services/audit-log.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex-1 flex flex-col min-w-0 bg-[#f6f7f8] dark:bg-[#101922] overflow-y-auto">
      <div class="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <!-- Welcome Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">Overview Dashboard</h2>
            <p class="text-slate-500 text-sm mt-1">Real-time status of your product ecosystem and user activity.</p>
          </div>
          <div class="flex gap-3">
            <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              <span class="material-symbols-outlined text-lg text-slate-400">download</span>
              Export Data
            </button>
            <button routerLink="/products/new" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition-opacity">
              <span class="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Metric Card 1: Total Products -->
          <div class="bg-white dark:bg-[#101922] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">inventory_2</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-xs">trending_up</span>
                12%
              </span>
            </div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Products</p>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ dashboardService.stats().totalProducts }}</h3>
          </div>

          <!-- Metric Card 2: Active Users -->
          <div class="bg-white dark:bg-[#101922] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">person_celebrate</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-xs">trending_up</span>
                5%
              </span>
            </div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ dashboardService.stats().totalUsers }}</h3>
          </div>

          <!-- Metric Card 3: Inventory Value -->
          <div class="bg-white dark:bg-[#101922] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-xs">trending_down</span>
                2%
              </span>
            </div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Inventory Value</p>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">$1.2M</h3>
          </div>

          <!-- Metric Card 4: Pending Approvals -->
          <div class="bg-white dark:bg-[#101922] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined">rule</span>
              </div>
              <span class="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-xs">trending_up</span>
                18%
              </span>
            </div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Approvals</p>
            <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">24</h3>
          </div>
        </div>

        <!-- Recent Activity Table Section -->
        <div class="bg-white dark:bg-[#101922] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p class="text-slate-500 text-sm">Detailed logs of recent product modifications and user updates.</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <select class="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 pl-3 pr-8 py-2 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Date & Time</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">User</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Action Performed</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Entity</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Status</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (log of auditLogService.logs() | slice:0:5; track log.id) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-slate-900 dark:text-white">{{ log.performedAt | date:'MMM d, y' }}</div>
                      <div class="text-xs text-slate-500">{{ log.performedAt | date:'HH:mm a' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                           <span class="material-symbols-outlined text-blue-600 text-lg">person</span>
                        </div>
                        <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ log.performedBy }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-slate-600 dark:text-slate-400 font-medium">{{ log.action }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded">{{ log.entityType }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Completed
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                      <button class="hover:text-blue-600 transition-colors">
                        <span class="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                }
                @if (auditLogService.logs().length === 0) {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                      <span class="material-symbols-outlined text-4xl mb-2">history</span>
                      <p class="text-sm font-medium">No recent activity found</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Secondary Content Row (Stats + Quick Actions) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          <div class="lg:col-span-2 bg-white dark:bg-[#101922] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-64 relative overflow-hidden">
            <div class="flex items-center justify-between mb-6">
              <h4 class="font-bold text-slate-900 dark:text-white">Monthly Active Trends</h4>
              <div class="flex gap-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span class="text-xs font-bold text-slate-500">Current</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span class="text-xs font-bold text-slate-500">Previous</span>
                </div>
              </div>
            </div>
            <!-- Visual placeholder for a chart -->
            <div class="absolute bottom-0 left-0 right-0 h-32 flex items-end px-6 gap-3">
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-1/2 rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-2/3 rounded-t-sm"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-3/4 rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-full rounded-t-sm"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-1/2 rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-1/3 rounded-t-sm"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-3/4 rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-2/3 rounded-t-sm"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-full rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-3/4 rounded-t-sm"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-1/2 rounded-t-sm"></div>
              <div class="flex-1 bg-blue-600/40 h-full rounded-t-sm"></div>
            </div>
          </div>
          <div class="bg-blue-600 p-6 rounded-xl shadow-xl shadow-blue-600/20 text-white flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-lg mb-2">Need a Report?</h4>
              <p class="text-white/80 text-sm leading-relaxed mb-6">Generate a custom enterprise report with the latest inventory and user metrics instantly.</p>
            </div>
            <button class="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg uppercase text-xs tracking-wider">
              Create New Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
      overflow: hidden; 
      font-family: 'Manrope', 'Inter', sans-serif;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);
  auditLogService = inject(AuditLogService);

  ngOnInit(): void {
    this.dashboardService.loadStats();
    this.auditLogService.loadLogs();
    this.dashboardService.connectWebSocket();
  }
}
