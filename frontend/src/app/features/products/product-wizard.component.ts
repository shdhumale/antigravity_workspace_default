import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Category } from '../../core/services/product.service';

@Component({
  selector: 'app-product-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-100 flex flex-col">
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <h1 class="text-xl font-extrabold tracking-tight text-slate-900">Create New Product</h1>
          </div>
          <button routerLink="/products" class="text-slate-400 hover:text-slate-600">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main class="max-w-4xl mx-auto py-8 px-4 w-full flex-1">
        <!-- Stepper -->
        <div class="mb-10 relative">
          <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div class="relative z-10 flex justify-between">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-white"
                [ngClass]="currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'">1</div>
              <span class="mt-3 text-[10px] font-bold uppercase tracking-wider" [class.text-blue-600]="currentStep >= 1">Basic Info</span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-white"
                [ngClass]="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'">2</div>
              <span class="mt-3 text-[10px] font-bold uppercase tracking-wider" [class.text-blue-600]="currentStep >= 2">Pricing</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <form #wizardForm="ngForm" class="p-8 space-y-8">
            
            @if (currentStep === 1) {
              <div class="space-y-6 text-slate-900">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-blue-600">info</span>
                  Basic Information
                </h3>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
                  <input name="name" [(ngModel)]="product.name" required class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Quantum Flux Headphones"/>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                  <select name="category" [(ngModel)]="product.category.id" required class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="" disabled>Select a category</option>
                    @for (cat of categories; track cat.id) {
                      <option [value]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea name="description" [(ngModel)]="product.description" rows="4" class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-4 outline-none" placeholder="Product features..."></textarea>
                </div>
              </div>
            }

            @if (currentStep === 2) {
              <div class="space-y-6 text-slate-900">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-blue-600">payments</span>
                  Pricing & Inventory
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-slate-700">Price ($) *</label>
                    <input name="price" type="number" [(ngModel)]="product.price" required class="w-full rounded-lg border-slate-300 py-2.5 px-4 outline-none"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-slate-700">Initial Stock *</label>
                    <input name="inventoryQty" type="number" [(ngModel)]="product.inventoryQty" required class="w-full rounded-lg border-slate-300 py-2.5 px-4 outline-none"/>
                  </div>
                </div>
              </div>
            }

          </form>

          <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button (click)="prev()" [disabled]="currentStep === 1" class="px-6 py-2.5 text-sm font-bold text-slate-400 disabled:opacity-30 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">arrow_back</span> Previous
            </button>
            <div class="flex gap-4">
              @if (currentStep < totalSteps) {
                <button (click)="next()" [disabled]="wizardForm.invalid" class="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 transition-all">
                  Next <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              } @else {
                <button (click)="save()" [disabled]="wizardForm.invalid" class="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 flex items-center gap-2 transition-all">
                  Create Product <span class="material-symbols-outlined text-sm">check</span>
                </button>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: []
})
export class ProductWizardComponent implements OnInit {
  productService = inject(ProductService);
  router = inject(Router);

  currentStep = 1;
  totalSteps = 2;
  categories: Category[] = [];

  product: any = {
    name: '',
    description: '',
    price: 0,
    inventoryQty: 0,
    category: { id: '' },
    status: 'DRAFT'
  };

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  next(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prev(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  save(): void {
    const payload = { ...this.product };
    // The backend expects category object with id
    this.productService.createProduct(payload).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}
