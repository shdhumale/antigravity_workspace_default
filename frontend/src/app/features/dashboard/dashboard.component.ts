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
    <div class="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto">
      <div class="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <!-- Welcome Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">Overview Dashboard</h2>
            <p class="text-slate-500 text-sm mt-1">Real-time status of your product ecosystem and user activity.</p>
          </div>
          <div class="flex gap-3">
            <button (click)="exportData()" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              <span class="material-symbols-outlined text-lg text-slate-400">download</span>
              Export Data
            </button>
            <button routerLink="/products/new" class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              <span class="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
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

          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center">
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

          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
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

          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg flex items-center justify-center">
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
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-500">
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p class="text-slate-500 text-sm">Detailed logs of recent product modifications and user updates.</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg animate-pulse" *ngIf="dashboardService.isLoading()">
                <div class="size-2 bg-primary rounded-full"></div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Updating Live</span>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto min-h-[300px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Date & Time</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">User</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Operation</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">Entity</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 text-right">More</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (log of auditLogService.logs() | slice:0:10; track log.id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-bold text-slate-900 dark:text-white">{{ log.performedAt | date:'MMM d, y' }}</div>
                      <div class="text-[10px] text-slate-500 uppercase font-medium">{{ log.performedAt | date:'HH:mm:ss a' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                           <span class="material-symbols-outlined text-primary text-lg">person_2</span>
                        </div>
                        <div>
                          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {{ log.performedBy.firstName || 'System' }} {{ log.performedBy.lastName || '' }}
                          </div>
                          <div class="text-[10px] text-slate-400 capitalize">{{ log.performedBy.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-[10px] font-extrabold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md tracking-wider border border-slate-200 dark:border-slate-700">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-bold text-primary">{{ log.entityType }}: {{ log.entityId.substring(0, 8) }}...</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                      <button class="hover:text-primary transition-colors">
                        <span class="material-symbols-outlined">analytics</span>
                      </button>
                    </td>
                  </tr>
                }
                @if (auditLogService.logs().length === 0 && !auditLogService.isLoading()) {
                  <tr>
                    <td colspan="5" class="px-6 py-20 text-center text-slate-400">
                      <span class="material-symbols-outlined text-5xl mb-4 text-slate-200 dark:text-slate-800">event_busy</span>
                      <p class="text-base font-bold text-slate-500">No recent activity detected.</p>
                      <p class="text-xs mt-1">Actions like creating products will appear here in real-time.</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Secondary Content Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-72">
            <div class="flex items-center justify-between mb-6">
              <h4 class="font-bold text-slate-900 dark:text-white">Monthly Active Distribution</h4>
              <div class="flex gap-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-primary/40"></span>
                  <span class="text-[10px] font-bold text-slate-500 uppercase">Growth</span>
                </div>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-40 flex items-end px-12 gap-4 pb-4">
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-12 rounded-t-lg transition-all duration-700 hover:h-24"></div>
              <div class="flex-1 bg-primary/30 h-16 rounded-t-lg transition-all duration-700 hover:h-32 hover:bg-primary"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-24 rounded-t-lg transition-all duration-700"></div>
              <div class="flex-1 bg-primary/30 h-32 rounded-t-lg transition-all duration-700"></div>
              <div class="flex-1 bg-slate-100 dark:bg-slate-800 h-16 rounded-t-lg transition-all duration-700"></div>
              <div class="flex-1 bg-primary/30 h-12 rounded-t-lg transition-all duration-700"></div>
              <div class="flex-1 bg-primary/30 h-28 rounded-t-lg transition-all duration-700"></div>
            </div>
          </div>
          <div class="bg-primary p-8 rounded-xl shadow-xl shadow-primary/30 text-white flex flex-col justify-between group overflow-hidden relative">
            <div class="absolute -right-8 -top-8 size-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            <div>
              <h4 class="font-bold text-xl mb-3">Enterprise Insights</h4>
              <p class="text-white/80 text-sm leading-relaxed mb-6">Export high-fidelity reports for production and inventory management instantly.</p>
            </div>
            <button (click)="createReport()" class="w-full py-4 bg-white text-primary font-extrabold rounded-xl hover:translate-y-[-2px] transition-all shadow-lg uppercase text-xs tracking-widest active:translate-y-0">
              Generate Report
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
  `]
})
export class DashboardComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  public auditLogService = inject(AuditLogService);

  private wsConnected = false;

  ngOnInit(): void {
    this.dashboardService.loadStats();
    this.auditLogService.loadLogs();
    
    // Guard against multiple connections
    if (!this.wsConnected) {
      this.dashboardService.connectWebSocket();
      this.wsConnected = true;
    }
  }

  exportData(): void {
    alert('STOMP: Data export initiated for high-fidelity inventory audit.');
  }

  createReport(): void {
    alert('STOMP: Custom enterprise report is currently being optimized for delivery.');
  }
}
