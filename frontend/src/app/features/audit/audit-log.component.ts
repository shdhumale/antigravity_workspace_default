import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../core/services/audit-log.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 overflow-auto bg-slate-50 p-8 text-slate-900">
      <div class="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight">System Audit Trail</h2>
          <p class="text-slate-500 mt-1">Immutable record of all critical system modifications.</p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">Timestamp</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">Entity</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">Action</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">Actor ID</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">Prev Value</th>
                  <th class="px-6 py-4 text-xs font-bold uppercase text-slate-500">New Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (log of auditLogService.logs(); track log.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-6 py-4 text-sm font-medium">{{ log.performedAt | date:'short' }}</td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">
                        {{ log.entityType }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm">{{ log.action }}</td>
                    <td class="px-6 py-4 text-xs font-mono text-slate-500">{{ log.performedBy || 'System' }}</td>
                    <td class="px-6 py-4 text-xs italic text-slate-400 truncate max-w-[150px]">{{ log.oldValue || '∅' }}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-700 truncate max-w-[150px]">{{ log.newValue || '∅' }}</td>
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
    :host { display: block; height: 100vh; overflow: hidden; }
  `]
})
export class AuditLogComponent implements OnInit {
  auditLogService = inject(AuditLogService);

  ngOnInit(): void {
    this.auditLogService.loadLogs();
  }
}
