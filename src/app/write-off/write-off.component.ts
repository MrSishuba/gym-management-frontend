import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { WriteOffViewModel } from '../shared/writeOffViewModel';
import { InventoryService } from '../Services/inventory.service';
import { InventoryViewModel } from '../shared/inventoryViewModel';
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-write-off',
  standalone: true,
  imports: [RouterLink,FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './write-off.component.html',
  styleUrl: './write-off.component.css'
})
export class WriteOffComponent implements OnInit{

  constructor(private inventoryService:InventoryService, private router: Router, private dialog:MatDialog, private route: ActivatedRoute, private fb: FormBuilder){
    this.registerFormGroup = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      

    });
  }

  errorMessage: string = '';
  Write_Off_ID!: Number;
  Date!:Date;
  Write_Off_Reason!:String;
  Inventory_ID!:Number;
  Write_Off_Quantity!:Number;
  Inventory_Item_Name!:String;
  quantityDiff!:Number;
  registerFormGroup: FormGroup;

  inventory: InventoryViewModel={
    inventoryID: 0,
    category: '',
    itemName: '',
    quantity: 0,
    photo: '',
    supplierID: 0,
    supplierName: '',
    received_supplier_order_id: 0
  }
  inventoryID!:Number;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inventoryID = params['inventory_ID'];
      this.getItem(this.inventoryID);
     
    });

       // Initialize help content

    this.helpContent = [
      {
        title: 'Write-Off Inventory Item Overview',
        content: `
          <p><strong>Overview:</strong> The Write-Off Inventory Item form allows you to record the reason and quantity for items that need to be removed from inventory due to damage or other reasons.</p>`
      },
      {
        title: '1. Item Name',
        content: `
          <ul>
            <li><strong>Display Only:</strong> The item name is displayed for reference and cannot be edited.</li>
          </ul>`
      },
      {
        title: '2. Write-off Reason',
        content: `
          <ul>
            <li><strong>Input Field:</strong> Provide a detailed reason for the write-off in the "Write-off Reason" text area. This is a required field.</li>
            <li><strong>Validation:</strong> If left blank, or if the reason is shorter than 10 characters or longer than 250 characters, error messages will prompt you to correct it.</li>
          </ul>`
      },
      {
        title: '3. Write-off Quantity',
        content: `
          <ul>
            <li><strong>Input Field:</strong> Enter the quantity of items to write off in the "Write-off Quantity" field. This field is required.</li>
            <li><strong>Validation:</strong> You will receive error messages if the quantity is less than 1 or exceeds the available inventory quantity.</li>
          </ul>`
      },
      {
        title: '4. Submission Buttons',
        content: `
          <p>At the bottom of the form, you will find the following buttons:</p>
          <ul>
            <li><strong>Add:</strong> Click this button to submit the write-off details. The button will be disabled until all required fields are valid.</li>
            <li><strong>Cancel:</strong> Click this button to cancel the operation and return to the inventory list.</li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> What happens if I try to add a write-off with errors?</p>
          <p><strong>A:</strong> The form will not submit, and you will see error messages indicating which fields need to be corrected.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The "Add" button is disabled even when I have filled out the form.</p>
          <p><strong>Solution:</strong> Ensure that all required fields meet the specified validation rules before submitting.</p>`
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


  getItem(id:Number){
    
    this.inventoryService.GetItem(id).subscribe(result => {
     
      this.inventory = result.value[0];
      
      
    
      console.log('Inventory',this.inventory)
     })
  }



  addWriteOff(WriteOffReason:String, writeOffQuantity:Number){


    this.quantityDiff = ((this.inventory.quantity as number) - (writeOffQuantity as number));




    const newWriteOff:WriteOffViewModel={
      Write_Off_ID: 0,
      Date: new Date(),
      Write_Off_Reason: WriteOffReason,
      Inventory_ID: this.inventory.inventoryID,
      Write_Off_Quantity: writeOffQuantity,
      Inventory_Item_Name: ''
    }

    this.inventoryService.CreateWriteOff(newWriteOff).subscribe((result:WriteOffViewModel)=>{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Are you sure you want to add this Writeoff?' } });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.router.navigateByUrl('/inventory');
          this.dialog.open(SuccessDialogComponent, {data:{message:'WriteOff Successfully added!'}});
        }
      });
      console.log('Writeoff Added', result)
     
    },(error: HttpErrorResponse) => {
      // Handle error
      if(this.quantityDiff < this.inventory.quantity){
        alert("You cannot write off more quantiy than what is on hand!");
      } else{
        alert(error.error)
        console.log('Error:', error.error)
      }
     

      
   
     
    });
  

  }


}
