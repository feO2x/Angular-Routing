import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../messages/message.service';
import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  pageTitle = 'Product Edit';
  errorMessage: string;

  private dataIsValid: { [key: string]: boolean } = {}
  private currentProduct: Product;
  private originalProduct: Product;

  get product(): Product { return this.currentProduct; }
  set product(value: Product) { 
    this.currentProduct = value; 
    this.originalProduct = { ...value };
  }

  get isDirty(): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(data => {
      const resolvedData: ProductResolved = data['product'];
      this.errorMessage = resolvedData.error;
      this.onProductRetrieved(resolvedData.product);
    })
  }

  reset(): void {
   this.dataIsValid = null;
   this.currentProduct = null;
   this.originalProduct = null; 
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id)
          .subscribe(
            () => this.onSaveComplete(`${this.product.productName} was deleted`),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      } else {
        this.productService.updateProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      }
      
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();
    this.router.navigate(['/products']);
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }

    return this.dataIsValid && Object.keys(this.dataIsValid).every(key => this.dataIsValid[key] === true);
  }

  validate(): void {
    this.dataIsValid = {}

    const product = this.product;
    const isInfoValid: boolean = product.productName && product.productCode && product.productName.length >= 3;
    const areTagsValid: boolean = product.category && product.category.length >= 3;

    this.dataIsValid["info"] = isInfoValid;
    this.dataIsValid["tags"] = areTagsValid;

  }
}
