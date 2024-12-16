import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './pages/productos/productos.component';
import { FormsModule } from '@angular/forms';
import { AddProductsComponent } from './pages/add-products/add-products.component';
import { EditProductsComponent } from './pages/edit-products/edit-products.component';

@NgModule({
  declarations: [
    ProductosComponent,
    AddProductsComponent,
    EditProductsComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class ProductosModule { }
