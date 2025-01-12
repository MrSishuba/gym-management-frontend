import { Component, OnInit } from '@angular/core';
import { InventoryViewModel } from '../shared/inventoryViewModel';
import { InventoryService } from '../Services/inventory.service';
import { NgFor, NgIf } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {

  userTypeID: number | null = null;
  inventories:InventoryViewModel[]=[];
  showModal:boolean = false;

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

  filteredInventory: InventoryViewModel[] = [];

  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private inventoryService:InventoryService, private elementRef:ElementRef, private dialog:MatDialog){}


  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    
    this.GetInventories();
    console.log('Inventories:',this.inventories);

    // Initialize help content
    this.helpContent = [
      {
        title: 'Inventory Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Inventory page allows you to view, search, and manage inventory items. You can search for items, view details, edit inventory items, write-off items, and create inspections.</p>
          <p><strong>Elements and Features:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Description:</strong> A text input field that allows you to search for specific inventory items.</li>
            <li><strong>Functionality:</strong> Enter search criteria such as item name, category, or supplier. The inventory table updates in real-time based on the search input.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific keywords to narrow down your search results.</li>
                <li>Clear the search field to view all inventory items.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Create Inspection Button',
        content: `
          <ul>
            <li><strong>Description:</strong> A button that navigates to the page where you can create a new inspection for inventory items.</li>
            <li><strong>Functionality:</strong> Click this button to access the inspection creation form.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Click this button to initiate inspections for items that require review or quality checks.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Inventory Table',
        content: `
          <ul>
            <li><strong>Description:</strong> Displays a list of inventory items with their details and available actions.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Photo:</strong> Displays the item image.</li>
                <li><strong>Item Name:</strong> Name of the inventory item.</li>
                <li><strong>Category:</strong> Category of the inventory item.</li>
                <li><strong>Quantity On Hand:</strong> The available quantity of the item.</li>
                <li><strong>Supplier:</strong> Supplier name of the inventory item.</li>
                <li><strong>Actions:</strong> Includes buttons to view item details, edit item information, and write-off items.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. View Button',
        content: `
          <ul>
            <li><strong>Description:</strong> Opens a modal with detailed information about the selected inventory item.</li>
            <li><strong>Functionality:</strong> Click the “View” button to see details such as item name, quantity, and supplier details.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to get more information about an item before making any changes or decisions.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Edit Button',
        content: `
          <ul>
            <li><strong>Description:</strong> Navigates to the page where you can edit the inventory item's details.</li>
            <li><strong>Functionality:</strong> Click the “Edit” button to access the form for updating the item's information.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to update inventory details such as item name, quantity, or supplier information.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '6. Write-Off Button',
        content: `
          <ul>
            <li><strong>Description:</strong> Navigates to the page where you can write off the selected inventory item.</li>
            <li><strong>Functionality:</strong> Click the “Write-Off” button to access the form for writing off the item. This button is only visible if the item's quantity is not zero.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to remove items from inventory that are damaged or no longer available.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Technical Details:',
        content: `
          <ul>
            <li>Dynamic Data: The inventory list is dynamically updated based on data retrieved from the backend.</li>
            <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> How do I search for an inventory item?</p>
          <p><strong>A:</strong> Enter search terms in the "Search Inventory" input field. The table will filter items based on name, category, supplier, or quantity matching the search criteria.</p>
          <p><strong>Q:</strong> How can I view an inventory item’s details?</p>
          <p><strong>A:</strong> Click the “View” button next to the item in the table. This will open a modal with detailed information about the item.</p>
          <p><strong>Q:</strong> What should I do if the inventory list is not updating after adding, editing, or writing off an item?</p>
          <p><strong>A:</strong> Ensure that you have refreshed the inventory list by calling the appropriate method to fetch the updated list. Verify that the changes are reflected in the inventory data.</p>
          <p><strong>Q:</strong> How do I write off an inventory item?</p>
          <p><strong>A:</strong> Click the “Write-Off” button for the item you want to write off. This button is only visible if the item's quantity is not zero. You will be redirected to the write-off page.</p>
          <p><strong>Q:</strong> How do I create a new inspection?</p>
          <p><strong>A:</strong> Click the “Create Inspection” button to navigate to the inspection creation form.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The inventory list is not loading.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and logged in. If the problem persists, try refreshing the page or contact technical support.</p>
          <p><strong>Problem:</strong> Unable to update inventory information.</p>
          <p><strong>Solution:</strong> Check your internet connection and ensure all required fields are filled out correctly. If the issue continues, contact support.</p>`
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

  GetInventories()
  {
    this.inventoryService.GetItems().subscribe(result => {
      let inventoryList:any[] = result.value;
      console.log('Result:', result)
    
      inventoryList.forEach((element) => {
        this.inventories.push(element);
        this.filteredInventory.push(element);
        
      });
      
    })

    
  }

  viewInventory(id:Number){
    this.inventoryService.GetItem(id).subscribe(result => {
     
      this.inventory = result.value[0];
      
      
     this.open();
      console.log('Inventory',this.inventory)
     })
  }

  deleteInventory(id:Number){
 // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Item?' } 
    });

    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.inventoryService.DeleteItem(id).subscribe((result: InventoryViewModel) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Item successfully deleted!' } });
          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Item deleted!', result);
        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
         
        });
      }
    });
  }

  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.inv-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

close(){
  //hide the div with the modal class
  const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.inv-modal');
if (modalElement) {
  modalElement.style.display = 'none'; // Hide the modal
}
this.showModal = false;
}

filterInventory(): void {
  if (!this.searchTerm) {
    this.filteredInventory = this.inventories;
  } else {
    const term = this.searchTerm.toLowerCase();
    this.filteredInventory = this.filteredInventory.filter(inventory =>
      inventory.itemName.includes(term)|| inventory.category.includes(term) || inventory.supplierName.includes(term) || inventory.quantity.toString().includes(term)
    );
  }
}






}
