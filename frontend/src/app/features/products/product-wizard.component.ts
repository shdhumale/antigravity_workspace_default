import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Category } from '../../core/services/product.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark flex flex-col transition-colors duration-500">
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="bg-primary text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined">edit_note</span>
            </div>
            <div>
              <h1 class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {{ isEditMode ? 'Modify Product' : 'Create New Asset' }}
              </h1>
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5" *ngIf="productId">ID: {{ productId }}</p>
            </div>
          </div>
          <button routerLink="/products" class="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main class="max-w-4xl mx-auto py-12 px-4 w-full flex-1">
        <!-- Stepper -->
        <div class="mb-12 relative flex justify-center">
          <div class="absolute top-5 left-1/4 right-1/4 h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
          <div class="relative z-10 flex justify-between w-full max-w-lg">
            <div class="flex flex-col items-center group cursor-pointer" (click)="currentStep = 1">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark transition-all duration-500 shadow-sm"
                [ngClass]="currentStep >= 1 ? 'bg-primary text-white scale-110' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'">1</div>
              <span class="mt-4 text-[10px] font-black uppercase tracking-wider transition-colors" [class.text-primary]="currentStep >= 1" [class.text-slate-400]="currentStep < 1">Identity</span>
            </div>
            <div class="flex flex-col items-center group cursor-pointer" (click)="canGoNext() ? currentStep = 2 : null">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark transition-all duration-500 shadow-sm"
                [ngClass]="currentStep >= 2 ? 'bg-primary text-white scale-110' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'">2</div>
              <span class="mt-4 text-[10px] font-black uppercase tracking-wider transition-colors" [class.text-primary]="currentStep >= 2" [class.text-slate-400]="currentStep < 2">Value & Inventory</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in-95 duration-500">
            <div class="relative h-16 w-16">
              <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="mt-6 text-slate-500 dark:text-slate-400 font-extrabold text-sm uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="errorMessage" class="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-top-4">
            <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-full text-red-600 mb-4">
               <span class="material-symbols-outlined text-4xl">error_outline</span>
            </div>
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">Retrieval Failed</h4>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xs text-center">{{ errorMessage }}</p>
            <button (click)="loadData()" class="mt-6 px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold text-sm">Retry Request</button>
          </div>

          <!-- Form Content -->
          <ng-container *ngIf="!isLoading && !errorMessage">
            <form #wizardForm="ngForm" class="p-10 space-y-10">
              
              <div *ngIf="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                   <span class="material-symbols-outlined text-primary">fingerprint</span>
                   <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">Core Identity</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Catalog Name *</label>
                    <input name="name" [(ngModel)]="product.name" required 
                      class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white font-medium transition-all placeholder:text-slate-400" 
                      placeholder="e.g. Stealth-X Enterprise Server"/>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset Category *</label>
                    <select name="category" [(ngModel)]="product.category.id" required 
                      class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white font-medium transition-all">
                      <option value="" disabled>Choose a classification...</option>
                      @for (cat of categories; track cat.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Internal Description</label>
                  <textarea name="description" [(ngModel)]="product.description" rows="4" 
                    class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-5 outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white font-medium transition-all" 
                    placeholder="Define the technical specifications and use cases..."></textarea>
                </div>
              </div>

              <div *ngIf="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span class="material-symbols-outlined text-primary">data_usage</span>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">Quantifiable Metrics</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="flex flex-col gap-2 group">
                    <label class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit Valuation ($) *</label>
                    <div class="relative">
                      <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input name="price" type="number" [(ngModel)]="product.price" required 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 pl-10 pr-5 outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white font-black transition-all"/>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stockholding Capacity *</label>
                    <input name="inventoryQty" type="number" [(ngModel)]="product.inventoryQty" required 
                      class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white font-black transition-all"/>
                  </div>
                </div>
                
                <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 flex gap-4">
                  <span class="material-symbols-outlined text-blue-600">info_i</span>
                  <p class="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                    Modifying stock levels during an active lifecycle will trigger an automated inventory recount event in the global audit trail.
                  </p>
                </div>
              </div>

            </form>

            <div class="px-10 py-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button (click)="prev()" [disabled]="currentStep === 1 || isLoading" class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white disabled:opacity-20 transition-all">
                <span class="material-symbols-outlined text-lg">west</span> Previous
              </button>
              <div class="flex gap-4">
                <button *ngIf="currentStep < totalSteps" (click)="next()" [disabled]="!canGoNext() || isLoading" 
                  class="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                  Continue <span class="material-symbols-outlined text-lg">east</span>
                </button>
                <button *ngIf="currentStep === totalSteps" (click)="save()" [disabled]="wizardForm.invalid || isLoading" 
                  class="px-10 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                  {{ isEditMode ? 'Commit Changes' : 'Initialize Asset' }}
                  <span class="material-symbols-outlined text-lg">verified</span>
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      min-height: 100vh;
      font-family: 'Manrope', sans-serif;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class ProductWizardComponent implements OnInit {
  productService = inject(ProductService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  currentStep = 1;
  totalSteps = 2;
  categories: Category[] = [];
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  product: any = {
    name: '',
    description: '',
    price: 0,
    inventoryQty: 0,
    category: { id: '' },
    status: 'DRAFT'
  };

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Use forkJoin to load categories and product (if editing) in parallel
    const categories$ = this.productService.getCategories().pipe(
      catchError(err => {
        console.error('Wizard: Failed to load categories', err);
        return of([] as Category[]);
      })
    );

    const product$ = this.productId 
      ? this.productService.getProductById(this.productId).pipe(
          catchError(err => {
            console.error('Wizard: Failed to load product', err);
            this.errorMessage = 'Could not retrieve product specifications. The asset may have been removed or you lack sufficient clearance.';
            return of(null);
          })
        )
      : of(null);

    forkJoin({
      categories: categories$,
      product: product$
    }).subscribe({
      next: (result) => {
        this.categories = result.categories;
        
        if (this.productId) {
          this.isEditMode = true;
          if (result.product) {
            console.log('Wizard: Hydrating form with data:', result.product);
            this.product = {
              name: result.product.name,
              description: result.product.description,
              price: result.product.price,
              inventoryQty: result.product.inventoryQty,
              category: { id: result.product.category?.id || '' },
              status: result.product.status
            };
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'A critical system error occurred while preparing the application environment.';
      }
    });
  }

  canGoNext(): boolean {
    if (this.currentStep === 1) {
      return !!(this.product.name && this.product.category.id);
    }
    return true;
  }

  next(): void {
    if (this.canGoNext()) this.currentStep++;
  }

  prev(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  save(): void {
    this.isLoading = true;
    const action$ = (this.isEditMode && this.productId)
      ? this.productService.updateProduct(this.productId, this.product)
      : this.productService.createProduct(this.product);

    action$.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Operation failed: ' + (err.error?.message || 'Check connection to central server.'));
      }
    });
  }
}
