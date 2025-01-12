import { Component, OnInit } from '@angular/core';
import { InventoryViewModel } from '../shared/inventoryViewModel';
import { InventoryService } from '../Services/inventory.service';
import { Supplier } from '../shared/supplier';
import { SupplierService } from '../Services/supplier.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormBuilder  } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../Services/product.service';
import { ProductCategories } from '../shared/productCategories';

@Component({
  selector: 'app-edit-inventory',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './edit-inventory.component.html',
  styleUrl: './edit-inventory.component.css'
})
export class EditInventoryComponent {
  item:InventoryViewModel={
    inventoryID: 0,
    category: '',
    itemName: '',
    quantity: 0,
    photo: '',
    supplierID: 0,
    supplierName: '',
    received_supplier_order_id: 0
  }

  registerFormGroup: FormGroup;
  itemID!:Number;
  suppliers:Supplier[]=[];
  selectedSupplier!:Number;
  errorMessage: string = '';
  selectedFile: File | null = null;
  base64String: string = '';
  photo!:string;
  productCategories:ProductCategories[]=[];
  
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
 
  constructor(private supplierService:SupplierService,private inventoryService: InventoryService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog, private productService:ProductService, private fb: FormBuilder){

    this.registerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      category: [null, Validators.required],
      supplier: [null, Validators.required],

    });
  }

  ngOnInit():void{
    this.route.params.subscribe(params => {
      this.itemID = params['inventoryID'];
      this.getInventoryItem(this.itemID);
     
    });

    this.GetSuppliers();
    this.getCategories();

    // Initialize help content
this.helpContent = [
  {
    title: 'Edit Inventory Item Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Inventory Item form allows you to update the details of an existing inventory item. This includes changing the item name, selecting a new category, and updating the supplier associated with the item.</p>`
  },
  {
    title: '1. Inventory Item Name',
    content: `
      <ul>
        <li><strong>Input Field:</strong> Enter the inventory item name in the "Inventory Item Name" field. This field is required</li>
        <li><strong>Validation:</strong> You will see an error message if the name is left blank, or if it does not meet the minimum (2 characters) or maximum (20 characters) length requirements.</li>
      </ul>`
  },
  {
    title: '2. Inventory Category',
    content: `
      <ul>
        <li><strong>Dropdown Menu:</strong> Select the appropriate inventory category from the dropdown list. This field is required.</li>
        <li><strong>Validation:</strong> An error message will display if no category is selected.</li>
      </ul>`
  },
  {
    title: '3. Select Supplier',
    content: `
      <ul>
        <li><strong>Dropdown Menu:</strong> Choose the supplier associated with the inventory item from the dropdown menu. This field is also required.</li>
        <li><strong>Validation:</strong> You will receive an error message if no supplier is selected.</li>
      </ul>`
  },
  {
    title: '4. Submission Buttons',
    content: `
      <p>At the bottom of the form, you will find the following buttons:</p>
      <ul>
        <li><strong>Save:</strong> Click this button to save the changes made to the inventory item. The button will be disabled until all required fields are valid.</li>
        <li><strong>Cancel:</strong> Click this button to cancel the operation and return to the inventory list.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What happens if I try to save the form with errors?</p>
      <p><strong>A:</strong> The form will not save, and you will see error messages highlighting any invalid fields.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Save" button is disabled even when I have filled out the form.</p>
      <p><strong>Solution:</strong> Ensure that all required fields are valid according to the specified validation rules before saving.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }


  GetSuppliers(){
    this.supplierService.GetSuppliers().subscribe(result => {
      let supplierList:any[] = result;
    
      supplierList.forEach((element) => {
        this.suppliers.push(element)
      });
      
    })
  }


  getCategories(){
    this.productService.getProductCategories().subscribe(result => {
      let categoryList:any[] = result;
    console.log('Categories', result)
      categoryList.forEach((element) => {
        this.productCategories.push(element)
      });
      
    })
  }

  getInventoryItem(id:Number){
    this.inventoryService.GetItem(id).subscribe(result => {
      this.item = result.value[0];

     console.log('Inventory Item:', this.item)
      this.selectedSupplier = this.item.supplierID;
      this.item.photo = this.item.itemName + '.jpg'
    });
    
  }

  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);

      reader.onload = () => {
        this.base64String = (reader.result as string).split(',')[1];
        console.log(this.base64String);
      };

      reader.onerror = (error) => {
        console.error('Error: ', error);
      };
    }
  }


  updateInventory() {
    this.photo = this.base64String;
    this.item.photo = this.photo;
  
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Item?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Proceed with updating the inventory item if confirmed
        this.inventoryService.EditItem(this.item.inventoryID, this.item).subscribe(
          (result: InventoryViewModel) => {
            // Show success message after successful update
            this.dialog.open(SuccessDialogComponent, { data: { message: 'Item successfully updated!' } });
            console.log('Item Updated', result);
            this.router.navigateByUrl('/inventory');
          },
          (error: HttpErrorResponse) => {
            // Handle error
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  
}
