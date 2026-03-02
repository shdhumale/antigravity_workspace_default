import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  inventoryQty: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/v1/products';
  
  products = signal<Product[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  loadProducts(): void {
    this.isLoading.set(true);
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((newProduct) => {
        this.products.update(prods => [...prods, newProduct]);
      })
    );
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap((updatedProduct) => {
        this.products.update(prods => prods.map(p => p.id === id ? updatedProduct : p));
      })
    );
  }

  submitForApproval(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/submit`, {});
  }

  approveProduct(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/v1/categories');
  }

  searchProducts(query: string): void {
    this.isLoading.set(true);
    this.http.get<Product[]>(`/api/v1/search/products?q=\${query}`).subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
