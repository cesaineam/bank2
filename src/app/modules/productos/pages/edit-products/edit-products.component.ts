import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductStateService } from '../../services/product-state.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productos.service';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {
  formulario: FormGroup;
  idProduct: string;

  constructor(
    private fb: FormBuilder,
    private productStateService: ProductStateService,
    private router: Router,
    private productService: ProductService,
  ) {
    this.idProduct = '';
    this.formulario = this.fb.group({
      id: [{ value: '' }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      fechaLiberacion: ['', [Validators.required]],
      fechaRevision: ['', [Validators.required]],
    });
  }

  getErrorMessage(control: string): string {
    const field = this.formulario.get(control);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Debe tener al menos ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `No debe exceder ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  ngOnInit(): void {
    const product = this.productStateService.getProduct();
    
  
    if (product) {
    
      this.formulario.get('id')?.enable();
  
      
      this.formulario.patchValue({
        id: product.id,
        nombre: product.name,
        descripcion: product.description,
        logo: product.logo,
        fechaLiberacion: product.date_release,
        fechaRevision: product.date_revision,
      });
  
      
      this.formulario.get('id')?.disable();
    } else {
      console.error('No se encontró el producto');
      this.router.navigate(['/productos']);
    }
  }
  
  

  redirectProducts(): void {
    this.router.navigate(['/productos']);
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const formValues = this.formulario.value;
     
  
      
      const id = this.formulario.get('id')?.value;  
  
    
      const payload = {
        id: id,  
        name: formValues.nombre,
        description: formValues.descripcion,
        logo: formValues.logo,
        date_release: formValues.fechaLiberacion,
        date_revision: formValues.fechaRevision
      };
  
      
  
      // Llamar al servicio para actualizar el producto
      this.productService.updateProduct(payload.id, payload).subscribe({
        next: (response) => {
          
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  
}