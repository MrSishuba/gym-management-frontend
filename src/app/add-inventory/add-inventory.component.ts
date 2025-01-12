import { Component, OnInit } from '@angular/core';
import { Equipment } from '../shared/equipment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { InventoryService } from '../Services/inventory.service';
import { SupplierService } from '../Services/supplier.service';
import { Supplier } from '../shared/supplier';
import { InventoryViewModel } from '../shared/inventoryViewModel';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.css'
})
export class AddInventoryComponent implements OnInit {

  constructor(private inventoryService:InventoryService, private supplierService: SupplierService, private dialog:MatDialog, private router:Router){}

  inventoryID!: 0;
  category!: '';
  itemName!: '';
  quantity!: 0;
  photo!: '';
  supplierID!: 0;
  supplierName!: '';
  received_supplier_order_id!: 1;
  errorMessage:string = '';
  selectedFile: File | null = null;
  base64String: string = '';
  suppliers:Supplier[]=[]

  ngOnInit(): void {
    this.GetSuppliers()
    console.log(this.suppliers)
  }
  GetSuppliers(){
    this.supplierService.GetSuppliers().subscribe(result => {
      let supplierList:any[] = result;
    
      supplierList.forEach((element) => {
        this.suppliers.push(element)
      });
      
    })
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

  addInventory(category:String, quantity:Number, photo:String, supplier_id:Number, itemName:String){

    photo = this.base64String;
    console.log(photo)
    const newItem: InventoryViewModel={
      inventoryID: 0,
      category: category,
      itemName: itemName,
      quantity: quantity,
      photo: photo,
      supplierID: supplier_id,
      supplierName: '',
      received_supplier_order_id: 1
    }


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: { message: 'Are you sure you want to add this Item?' }});
    
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.inventoryService.AddItem(newItem).subscribe({
          next: (result: InventoryViewModel) => {
            this.router.navigateByUrl('/inventory');
            console.log('Inventory Added', result);
            this.dialog.open(SuccessDialogComponent, {data: { message: 'Inventory successfully added!' }});
          },
          error: (error: HttpErrorResponse) => {
            alert( error.error);
          },
          complete: () => {
            alert('Add inventory item process complete.');
          }
        });
      }
    });
    

  }

}
