import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RxStomp } from '@stomp/rx-stomp';
import { map } from 'rxjs/operators';
import { AuditLogService, AuditLog } from './audit-log.service';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  inventoryValue?: number;
  pendingApprovals?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private auditLogService = inject(AuditLogService);
  
  private rxStomp = new RxStomp();
  
  stats = signal<DashboardStats>({ totalProducts: 0, totalUsers: 0 });
  isLoading = signal(false);

  loadStats(): void {
    this.isLoading.set(true);
    this.http.get<DashboardStats>('/api/v1/dashboard/stats').subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  connectWebSocket(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Configuration for STOMP over raw WebSocket (proxied)
      this.rxStomp.configure({
        brokerURL: `ws://${window.location.host}/ws/websocket`,
        reconnectDelay: 200,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (msg: string) => console.log('STOMP:', msg),
      });

      this.rxStomp.activate();

      // Listen for audit updates
      this.rxStomp.watch('/topic/audit').pipe(
        map(message => JSON.parse(message.body) as AuditLog)
      ).subscribe({
        next: (newLog) => {
          console.log('STOMP: Received new activity:', newLog);
          // Prepend new log and refresh stats
          this.auditLogService.logs.update(current => [newLog, ...current.slice(0, 19)]);
          this.loadStats(); 
        },
        error: (err) => console.error('STOMP Error:', err)
      });
    }
  }
}
