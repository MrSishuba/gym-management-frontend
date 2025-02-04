import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ProductTypeViewModel } from '../shared/order';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './product-type.component.html',
  styleUrl: './product-type.component.css'
})
export class ProductTypeComponent implements OnInit {
  prodType: ProductTypeViewModel[] = [];
  filteredProdTypes: ProductTypeViewModel[] = [];
  selectedprodType: any;
  prodTypeForm: FormGroup;
  searchTerm: string = '';

  constructor(private productService: ProductService, private fb: FormBuilder, private location: Location) {
    this.prodTypeForm = this.fb.group({
      type_Name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProdTypes();
  }

  loadProdTypes(): void {
    this.productService.getProductTypes().subscribe((prodType: ProductTypeViewModel[]) => {
      this.prodType = prodType;
      this.filteredProdTypes = prodType;
    });
  }

  filterProdTypes(): void {
    if (!this.searchTerm) {
      this.filteredProdTypes = this.prodType;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProdTypes = this.prodType.filter(prodType =>
        prodType.type_Name.toLowerCase().includes(term) ||
        prodType.product_Type_ID.toString().includes(term)
      );
    }
  }

  openAddModal(): void {
    this.prodTypeForm.reset();
    $('#addModal').modal('show');
  }

  openViewModal(prodType: ProductTypeViewModel): void {
    this.selectedprodType = prodType;
    $('#viewModal').modal('show');
  }

  openEditModal(prodType: ProductTypeViewModel): void {
    this.selectedprodType = prodType;
    this.prodTypeForm.patchValue({
      type_Name: prodType.type_Name
    });
    $('#editModal').modal('show');
  }

  openDeleteModal(prodType: ProductTypeViewModel): void {
    this.selectedprodType = prodType;
    $('#deleteModal').modal('show');
  }

  addProdType(): void {
    if (this.prodTypeForm.valid) {
      const newprodType: ProductTypeViewModel = {
        product_Type_ID: 0, // ID is auto-generated by the server
        type_Name: this.prodTypeForm.value.type_Name
      };
      this.productService.addProdType(newprodType).subscribe(() => {
        this.loadProdTypes();
        $('#addModal').modal('hide');
      });
    }
  }

  updateProdType(): void {
    if (this.prodTypeForm.valid && this.selectedprodType) {
      const typeName = this.prodTypeForm.value.type_Name;
      this.productService.updateProdType(this.selectedprodType.product_Type_ID, typeName).subscribe({
        next: () => {
          this.loadProdTypes();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.error(error);
          alert('Update failed');
        }
      });
    }
  }

  deleteProdType(): void {
    if (this.selectedprodType) {
      this.productService.deleteProdType(this.selectedprodType.product_Type_ID).subscribe(() => {
        this.loadProdTypes();
        $('#deleteModal').modal('hide');
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}