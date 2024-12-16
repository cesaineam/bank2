import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../src/environments/environment';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  getProduct(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(`${this.apiUrl}/bp/products`)
      .pipe(
        map((response: { data: any; }) => response.data) // Extraer la propiedad "data"
      );
  }
  addProduct(data: Product): Observable<any> {
    return this.http.post(this.apiUrl+'/bp/products', data);
  }
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/bp/products/verification/${id}`);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/bp/products/${id}`);
  }

  

  updateProduct(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bp/products/${id}`, payload);
  }

}
