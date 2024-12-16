import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/productos.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductStateService } from '../../services/product-state.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [DatePipe]
})
export class ProductosComponent {

  products: Product[] = [];
  paginatedProducts: Product[] = [];
  totalResults: number = 0;

  showDeleteModal = false;
  selectedProduct: Product | null = null;

  filterText: string = '';
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 20];


  constructor(private productService: ProductService,private router: Router, private productStateService: ProductStateService,) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProduct().subscribe({
      next: (data) => {
        this.products = data;
        this.totalResults = data.length;
        this.applyPagination();  // Asegúrate de paginar los productos después de cargarlos
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }

  applyPagination(): void {
    this.paginatedProducts = this.products.slice(0, this.pageSize);
  }

  onPageSizeChange(): void {
    this.applyPagination();
  }

  applyFilter(): void {
    const filtered = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        p.description.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.totalResults = filtered.length;
    this.paginatedProducts = filtered.slice(0, this.pageSize);
  }
  redirectForm():void{
    this.router.navigate(['/agregarProducto']);
  }

  openDropdownProduct: Product | null = null;

 

  openDeleteDialog(product: Product): void {
    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar el producto "${product.description}"?`
    );
    if (confirmDelete) {
      this.deleteProduct(product);
    }
  }

  openEdit(product: any) {
    this.productStateService.setProduct(product); 
    this.router.navigate(['/editar', product.id]); 
  }

  deleteProduct(product: Product): void {
    
    this.paginatedProducts = this.paginatedProducts.filter(
      (p) => p !== product
    );
    this.totalResults = this.totalResults -1
  }

  confirmDelete(): void {
    if (this.selectedProduct) {
     
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: (response) => {
          console.log(response.message);
          this.paginatedProducts = this.paginatedProducts.filter(
            (p) => p.id !== this.selectedProduct?.id
          );
          this.closeDeleteModal()
          this.fetchProducts();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err.message);
          alert('No se pudo eliminar el producto.');
          this.closeDeleteModal();
        },
      });
    }
  }

  toggleDropdown(product: Product): void {
    this.openDropdownProduct =
      this.openDropdownProduct === product ? null : product;
  }

  isDropdownOpen(product: Product): boolean {
    return this.openDropdownProduct === product;
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }


  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }


 
  
}
