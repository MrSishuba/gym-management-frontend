import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Supplier } from '../shared/supplier';
import { SupplierService } from '../Services/supplier.service';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [RouterLink, SideNavBarComponent, MasterSideNavBarComponent, NgFor, NgIf, FormsModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit {

  userTypeID: number | null = null;
  suppliers:Supplier[] = []
  showModal: boolean = false;
  supplier:Supplier={
    supplier_ID:0,
    name:'',
    contact_Number:'',
    email_Address:'',
    physical_Address:''
  }
  filteredsuppliers: Supplier[] = [];
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor (private supplierService:SupplierService, private elementRef: ElementRef, private router : Router, private dialog:MatDialog){}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    this.GetSuppliers();
    console.log(this.suppliers);

    // Initialize help content
    this.helpContent = [
      {
        title: 'Supplier Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Supplier page allows you to view, search, and manage suppliers for AVS Fitness. You can add new suppliers, view details, edit existing suppliers, delete them, and place orders.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> To find specific suppliers in the list.</li>
            <li><strong>Usage:</strong> Enter search criteria such as supplier name or ID. The table will update in real-time based on the search input.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific terms to narrow down the search results efficiently.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Add Supplier Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate to the page where you can add a new supplier.</li>
            <li><strong>Usage:</strong> Click this button to access the form for adding a new supplier.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Ensure that all required fields are filled out when adding a new supplier.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Suppliers Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a list of suppliers with their details and available actions.</li>
            <li><strong>Usage:</strong> 
              <ul>
                <li><strong>ID:</strong> Unique identifier for each supplier.</li>
                <li><strong>Name:</strong> Name of the supplier.</li>
                <li><strong>Contact Number:</strong> Supplier’s contact phone number.</li>
                <li><strong>Email:</strong> Supplier’s email address.</li>
                <li><strong>Actions:</strong> Includes buttons to view supplier details, edit supplier information, delete the supplier, and place an order with the supplier.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Review supplier details and actions before making any changes or placing orders.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. View Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal with detailed information about the selected supplier.</li>
            <li><strong>Usage:</strong> Click the “View” button to see details such as the supplier's name, physical address, contact number, and email address.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to review supplier details before making any decisions.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Edit Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate to the page where you can edit the supplier's details.</li>
            <li><strong>Usage:</strong> Click the “Edit” button to access the form for editing the supplier’s information.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Update supplier details as needed and ensure accuracy before saving changes.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '6. Delete Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Delete the selected supplier from the list.</li>
            <li><strong>Usage:</strong> Click the “Delete” button to remove the supplier. A confirmation dialog will appear to confirm the deletion.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Be cautious when deleting suppliers; confirm that you intend to remove them permanently.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '7. Place Order Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate to the page where you can place an order with the selected supplier.</li>
            <li><strong>Usage:</strong> Click the “Place Order” button to access the order placement form.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Ensure you have selected the correct supplier before placing an order.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Modal for Viewing Supplier Details',
        content: `
          <ul>
            <li><strong>Supplier Details:</strong> Display detailed information about the selected supplier.</li>
            <li><strong>Usage:</strong> The modal shows the supplier's name, physical address, contact number, and email address. Click "Close" to exit the modal.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the modal to get a comprehensive view of the supplier's information before taking any action.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I search for a supplier?</p>
          <p><strong>A:</strong> Enter search terms in the "Search Supplier" input field. The table will filter suppliers based on ID or name matching the search criteria.</p>
          <p><strong>Q:</strong> How can I view a supplier’s details?</p>
          <p><strong>A:</strong> Click the “View” button next to the supplier in the table. This will open a modal with detailed information about the supplier.</p>
          <p><strong>Q:</strong> What should I do if the supplier list is not updating after adding, editing, or deleting a supplier?</p>
          <p><strong>A:</strong> Ensure that you have refreshed the supplier list by calling the GetSuppliers method after any changes. Verify that the changes are reflected in the supplier data.</p>
          <p><strong>Q:</strong> How do I delete a supplier?</p>
          <p><strong>A:</strong> Click the “Delete” button for the supplier you want to remove. A confirmation dialog will appear. Confirm the deletion to remove the supplier from the list.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The supplier list is not updating after changes.</p>
          <p><strong>Solution:</strong> Refresh the page or call the GetSuppliers method to reload the supplier data.</p>
          <p><strong>Problem:</strong> The search bar is not filtering results correctly.</p>
          <p><strong>Solution:</strong> Ensure that you are entering accurate search terms and check for any connectivity issues.</p>`
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


  viewSupplier(id:Number){
    this.supplierService.GetSupplier(id).subscribe(result => {
     
      this.supplier = result;
      
     this.open();
      console.log('Supplier',this.supplier)
     })
  }
  
  filterSupplier(): void {
    if (!this.searchTerm) {
      this.filteredsuppliers = [...this.suppliers];
    } else {
      //console.log('Search Term',this.searchTerm)
      const term = this.searchTerm.toLowerCase();
      this.filteredsuppliers = this.filteredsuppliers.filter(supp =>
        supp.name.includes(term) ||
        supp.supplier_ID.toString().includes(term) || supp.contact_Number.toString().includes(term)
      );
    }
    console.log('Filtered suppliers:', this.filteredsuppliers);
  }
  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.sup-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.sup-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }
  GetSuppliers()
  {
    this.supplierService.GetSuppliers().subscribe(result => {
      let supplierList:any[] = result;
    
      supplierList.forEach((element) => {
        this.suppliers.push(element);
        this.filteredsuppliers = [...this.suppliers];
      });

      console.log(result);
      
    })

    
  }


  deleteSupplier(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Supplier?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.supplierService.DeleteSupplier(id).subscribe((result: Supplier) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Supplier successfully deleted!' } });
          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Supplier deleted!', result);
        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
          console.log('Error:', error.error);
        });
      }
    });
  }
  
  goBack(): void {
  this.router.navigate(['/supplier-hub']);
  }

}
