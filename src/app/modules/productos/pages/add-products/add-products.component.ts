import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../services/productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    // Inicializar el formulario con validaciones
    this.formulario = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],
        [this.idExistsValidator.bind(this)] 
      ],
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      fechaLiberacion: ['', [Validators.required, this.fechaLiberacionValidator]],
      fechaRevision: [{ value: '', disabled: true }],
    });
    this.formulario.get('fechaLiberacion')?.valueChanges.subscribe((fechaLiberacion: string) => {
      if (fechaLiberacion) {
        const fechaLiberacionDate = new Date(fechaLiberacion);
        const fechaRevisionDate = new Date(fechaLiberacionDate.setFullYear(fechaLiberacionDate.getFullYear() + 1));
    
        // Formateamos la fecha para que sea YYYY-MM-DD
        const fechaRevisionFormatted = fechaRevisionDate.toISOString().split('T')[0];
        
        // Si no está deshabilitado, asignamos el valor
        this.formulario.get('fechaRevision')?.setValue(fechaRevisionFormatted);
      }
    });
    
  }

  // Validación asíncrona para verificar que el ID no exista
  idExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return this.productService.verifyId(control.value).pipe(
      debounceTime(300), 
      switchMap(exists => exists 
        ? of({ idExists: true }) 
        : of(null) 
      ),
      catchError(() => of({ idCheckError: true })) 
    );
  }

  // Validador personalizado para fecha igual o mayor a la fecha actual
  fechaLiberacionValidator(control: AbstractControl): ValidationErrors | null {
    const fechaLiberacion = new Date(control.value);
    const yesterday = new Date();
  
    
    yesterday.setDate(yesterday.getDate() - 1); 
    yesterday.setHours(0, 0, 0, 0); 
  
    // Ajustar la fecha de liberación a la medianoche
    fechaLiberacion.setHours(0, 0, 0, 0);
  
    // Validar si la fecha de liberación es menor que ayer
    if (fechaLiberacion < yesterday) {
      return { fechaLiberacionInvalida: true }; 
    }
    return null; 
  }
 

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.formulario.valid) {
      const formValues = this.formulario.value;
      
      // Verificar que la fechaRevision tiene un valor
      if (!formValues.fechaRevision) {
        const fechaLiberacionDate = new Date(formValues.fechaLiberacion);
        const fechaRevisionDate = new Date(fechaLiberacionDate.setFullYear(fechaLiberacionDate.getFullYear() + 1));
        formValues.fechaRevision = fechaRevisionDate.toISOString().split('T')[0]; // Asignamos la fecha de revisión
      }
  
      const payload = {
        id: formValues.id,
        name: formValues.nombre,
        description: formValues.descripcion,
        logo: formValues.logo,
        date_release: formValues.fechaLiberacion,
        date_revision: formValues.fechaRevision
      };
  
      console.log('Objeto JSON a enviar:', payload);
  
      this.productService.addProduct(payload).subscribe({
        next: (response) => {
          console.log('Producto guardado con éxito:', response);
        },
        error: (err) => {
          console.error('Error al guardar el producto:', err);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
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
    if (field?.hasError('fechaLiberacion')) {
      return 'La fecha de revisión debe ser un año posterior a la fecha de liberación';
    }
    if (field?.hasError('idExists')) {
      return 'El ID ya existe';
    }
    if (field?.hasError('fechaLiberacionInvalida')) {
      return 'La fecha de liberación debe ser igual o mayor a la fecha de hoy';
    }
    return '';
  }
  onReset() {
    this.formulario.reset();
  }
  redirectProducts():void{
    this.router.navigate(['/productos']);
  }
  
 
}
