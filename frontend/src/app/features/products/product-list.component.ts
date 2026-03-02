import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-100">
      <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-full max-w-md text-slate-900">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input 
              #searchInput
              (keyup.enter)="productService.searchProducts(searchInput.value)"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 outline-none" 
              placeholder="Search products..." type="text"/>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button routerLink="/products/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20">
            <span class="material-symbols-outlined text-lg">add</span>
            Add Product
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-auto p-8">
        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Product Inventory</h2>
          <p class="text-slate-500 mt-1">Manage your global product catalog and stock levels.</p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stock</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (product of productService.products(); track product.id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900">
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold">{{ product.name }}</span>
                        <span class="text-[10px] text-slate-400 uppercase">ID: {{ product.id.slice(0,8) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                        {{ product.category.name || 'Uncategorized' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-sm font-bold">\${{ product.price }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm" [class.text-red-500]="product.inventoryQty < 10">{{ product.inventoryQty }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-1.5">
                        <div class="h-2 w-2 rounded-full" 
                          [ngClass]="{
                            'bg-emerald-500': product.status === 'ACTIVE',
                            'bg-amber-500': product.status === 'PENDING_APPROVAL',
                            'bg-slate-400': product.status === 'DRAFT',
                            'bg-red-400': product.status === 'ARCHIVED'
                          }"></div>
                        <span class="text-xs font-bold"
                          [ngClass]="{
                            'text-emerald-600': product.status === 'ACTIVE',
                            'text-amber-600': product.status === 'PENDING_APPROVAL',
                            'text-slate-500': product.status === 'DRAFT'
                          }">{{ product.status }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        @if (product.status === 'DRAFT') {
                          <button (click)="submit(product.id)" class="p-1.5 hover:bg-white rounded shadow-sm text-blue-600" title="Submit for Approval">
                            <span class="material-symbols-outlined text-lg">publish</span>
                          </button>
                        }
                        <button [routerLink]="['/products', product.id, 'edit']" class="p-1.5 hover:bg-white rounded shadow-sm text-slate-600">
                          <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <p class="text-xs font-bold text-slate-500 uppercase">Total Products</p>
            <p class="text-2xl font-black mt-1 text-slate-900">{{ productService.products().length }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  submit(id: string): void {
    if (confirm('Submit this product for approval?')) {
      this.productService.submitForApproval(id).subscribe(() => this.productService.loadProducts());
    }
  }
}
