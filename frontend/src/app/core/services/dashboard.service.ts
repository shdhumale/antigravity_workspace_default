import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

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

  // Simplified WebSocket logic for this task
  connectWebSocket(): void {
    if (isPlatformBrowser(this.platformId)) {
      // In a real app, use @stomp/stompjs
      console.log('Connecting to WebSocket for real-time updates...');
    }
  }
}
