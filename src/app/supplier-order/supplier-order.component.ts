import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { SupplierOrderService } from '../Services/supplier-order.service';
import { Supplier } from '../shared/supplier';
import { SupplierOrder } from '../shared/supplier-order';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-supplier-order',
  standalone: true,
  imports: [FormsModule,CommonModule, SideNavBarComponent, MasterSideNavBarComponent],
  templateUrl: './supplier-order.component.html',
  styleUrl: './supplier-order.component.css'
})
export class SupplierOrderComponent implements OnInit {

  userTypeID: number | null = null;
  supplierOrders: SupplierOrder[] = [];
  selectedOrder: SupplierOrder | null = null;
  updateInventory: any;
  showModal: boolean = false;
  supplier: Supplier = {
    supplier_ID: 0,
    name: '',
    contact_Number: '',
    email_Address: '',
    physical_Address: ''
  };
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(
    private supplierOrderService: SupplierOrderService, private router: Router, private changeDetectorRef: ChangeDetectorRef, private location: Location, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    this.getSupplierOrders();

    // Initialize help content
    this.helpContent = [
      {
        title: 'Supplier Order Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Supplier Order page allows you to view, manage, and update supplier orders. You can review orders, accept or reject them, and view detailed information. This page also includes functionality to search for specific orders and navigate back to the supplier hub.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Back Icon',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate back to the previous page or hub.</li>
            <li><strong>Usage:</strong> Click the back icon to return to the Supplier Hub.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to easily return to the previous page without losing your current context.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Page Title',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays the current page title.</li>
            <li><strong>Usage:</strong> Identifies the page as the Supplier Orders section.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>The title helps you to quickly identify the context of the page you are viewing.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Find specific supplier orders based on search criteria.</li>
            <li><strong>Usage:</strong> Enter terms like order ID or supplier name. The table will filter orders in real-time based on the search input.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific terms to refine your search results.</li>
                <li>Clear the search field to view all orders.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. Supplier Orders Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Display a list of supplier orders with relevant details.</li>
            <li><strong>Usage:</strong> Review the table which includes the following columns:
              <ul>
                <li><strong>Supplier Order ID:</strong> Unique identifier for each order.</li>
                <li><strong>Date Ordered:</strong> Date when the order was placed.</li>
                <li><strong>Quantity:</strong> Quantity of products ordered.</li>
                <li><strong>Product Name:</strong> Name of the ordered products.</li>
                <li><strong>Total Price:</strong> Total cost of the order.</li>
                <li><strong>Order Details:</strong> Additional information about the order.</li>
                <li><strong>Supplier:</strong> Name of the supplier.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Review order details carefully to ensure all information is accurate before taking action.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Order Actions',
        content: `
          <ul>
            <li><strong>Accept Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Accept the selected order.</li>
                <li><strong>Usage:</strong> Click the “Accept” button to mark the order as accepted. This will open a modal for confirmation.</li>
              </ul>
            </li>
            <li><strong>Reject Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Reject the selected order.</li>
                <li><strong>Usage:</strong> Click the “Reject” button to mark the order as rejected. This will open a modal to provide details on discrepancies.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '6. Modal for Order Details',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Display detailed information and options to accept or reject an order.</li>
            <li><strong>Usage:</strong>
              <ul>
                <li><strong>Order Details:</strong> View the order ID, supplier name, and date ordered.</li>
                <li><strong>Discrepancies:</strong> Enter any discrepancies if rejecting the order. This field is only visible when rejecting the order.</li>
                <li><strong>Accept/Reject:</strong> Confirm the action by clicking “Accept” or “Reject.” This will update the order status and close the modal.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Double-check all details before confirming the action.</li>
                <li>Provide clear details on discrepancies to avoid misunderstandings.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '7. Back to Supplier Hub Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Return to the Supplier Hub page.</li>
            <li><strong>Usage:</strong> Click this button to navigate back to the Supplier Hub.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to quickly return to the main supplier management area.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> How do I search for a specific order?</p>
          <p><strong>A:</strong> Enter search terms in the "Search Supplier" field. The table will update to display only those orders matching the criteria.</p>
          <p><strong>Q:</strong> How can I view and handle order details?</p>
          <p><strong>A:</strong> Click the “Accept” or “Reject” button in the "Action" column next to the order. This will open a modal where you can confirm or reject the order.</p>
          <p><strong>Q:</strong> What should I do if the order details modal does not open?</p>
          <p><strong>A:</strong> Ensure that the order is selected and try again. If the issue persists, refresh the page or check for errors in the console.</p>
          <p><strong>Q:</strong> How do I handle discrepancies when rejecting an order?</p>
          <p><strong>A:</strong> In the modal, enter the details of the discrepancies in the “Discrepancies” field before clicking “Reject.” This field is only available when rejecting an order.</p>
          <p><strong>Q:</strong> What if the status of the order does not update after accepting or rejecting?</p>
          <p><strong>A:</strong> Ensure that you have a stable internet connection and check for any error messages. If the status does not update, try refreshing the page or contacting support.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The order list is not loading.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and logged in. If the problem persists, try refreshing the page or contact technical support.</p>
          <p><strong>Problem:</strong> Unable to update order status.</p>
          <p><strong>Solution:</strong> Check your internet connection and ensure that all required fields are filled out correctly. If the issue continues, contact support.</p>`
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

  getSupplierOrders(): void {
    this.supplierOrderService.getAllSupplierOrders().subscribe({
      next: (orders: SupplierOrder[]) => {
        console.log("orders",orders);
        this.supplierOrders = orders;
      },
      error: (error) => {
        console.error('Error fetching supplier orders:', error);
      }
    });
  }

  onSelectOrder(order: SupplierOrder): void {
    this.selectedOrder = order;
    this.updateInventory = {
      supplies_Received_Date: new Date(),
      accepted: true,
      discrepancies: 'None',
      received_Supplier_Order_Lines: order.orderLines.map(line => ({
        received_Supplier_Order_Line_ID: line.supplier_Order_Line_ID, // Assuming this is the correct ID
        supplier_Order_Line_ID: line.supplier_Order_Line_ID,
        received_Supplies_Quantity: line.supplier_Quantity,
        product_ID: line.product_ID // Only include product_ID
      }))
    };
    this.showModal = true;
  }
  
  openModal(order: SupplierOrder): void {
    this.selectedOrder = order;
    this.updateInventory = {
      supplies_Received_Date: new Date(),
      accepted: false,
      discrepancies: '',
      received_Supplier_Order_Lines: order.orderLines.map(line => ({
        received_Supplier_Order_Line_ID: line.supplier_Order_Line_ID, // Assuming this is the correct ID
        supplier_Order_Line_ID: line.supplier_Order_Line_ID,
        received_Supplies_Quantity: line.supplier_Quantity,
        product_ID: line.product_ID // Only include product_ID
      }))
    };
    this.showModal = true;
  }  

  handleOrder(): void {
    const order = this.selectedOrder; // Define a local variable to help TypeScript understand it's not null
  
    if (!order) return; // Exit if no order is selected
  
    const status = this.updateInventory.accepted ? 2 : 3; // 2 for Accepted, 3 for Rejected
    console.log('Handling order with ID:', order.supplier_Order_ID, 'and status:', status);
  
    this.supplierOrderService.receiveSupplierOrder(this.updateInventory).subscribe({
      next: (result) => {        
        this.snackBar.open('Order updated successfully', 'Close', { duration: 3000 });
        console.log('Order updated successfully:', result);
  
        // Ensure order is not null here
        if (order) {
          this.updateSupplierOrderStatus(order.supplier_Order_ID, status).subscribe({
            next: (response) => {
              console.log("updateSupplierOrderStatus",response)
              this.getSupplierOrders(); // Refresh the orders list
              this.showModal = false;
            },
            error: (error) => {
              alert(error);
              console.error('Error updating supplier order status:', error);
            }
          });
        }
      },
      error: (error) => {
        alert(error);
        console.error('Error updating order:', error);
      }
    });
  }

  updateSupplierOrderStatus(orderId: number, status: number): Observable<any> {
    return this.supplierOrderService.updateSupplierOrderStatus({
      supplier_Order_ID: orderId,
      status: status
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOrder = null;
  }

  goBack() {
    this.router.navigateByUrl(`/supplier-hub`);
  }

  filterSupplier(): void {
    // Implement filtering logic if needed
  }  
}
