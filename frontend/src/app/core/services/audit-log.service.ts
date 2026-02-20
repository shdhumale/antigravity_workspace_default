import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  oldValue: string;
  newValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private http = inject(HttpClient);
  
  logs = signal<AuditLog[]>([]);
  isLoading = signal(false);

  loadLogs(): void {
    this.isLoading.set(true);
    this.http.get<AuditLog[]>('/api/v1/audit/logs').subscribe({
      next: (data) => {
        this.logs.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
