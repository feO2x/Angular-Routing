import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductResolved } from '../product';

@Component({
  templateUrl: './product-edit-info.component.html'
})
export class ProductEditInfoComponent implements OnInit {
  @ViewChild(NgForm) productForm: NgForm;

  errorMessage: string;
  product: Product;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(data => {

      this.resetForm();

      const productResolved: ProductResolved = data['product'];
      this.errorMessage = productResolved.error;
      this.product = productResolved.product;
    });
  }
  resetForm(): void {
    if (this.productForm)
      this.productForm.reset();
  }
}
