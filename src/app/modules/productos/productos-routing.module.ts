import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { AddProductsComponent } from './pages/add-products/add-products.component';
import {EditProductsComponent} from './pages/edit-products/edit-products.component' 
const routes: Routes = [
  {path: 'productos', component: ProductosComponent},
  {path: 'agregarProducto', component: AddProductsComponent},
  { path: 'editar/:id', component: EditProductsComponent },
  {path: '**', redirectTo: 'productos', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
