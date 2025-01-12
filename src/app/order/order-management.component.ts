import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../Services/order.service';
import { OrderViewModel } from '../shared/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {

  userTypeID: number | null = null;
  orders: OrderViewModel[] = [];
  filteredOrders: OrderViewModel[] = [];
  pagedOrders: OrderViewModel[] = [];
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2; 

  // Pagination properties
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private orderService: OrderService, private snackBar: MatSnackBar, private router: Router, private location: Location) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadOrders();
    this.orderService.loadWishlistItems();
    this.orderService.loadCartItems();

    

    // Initialize help content
    this.helpContent = [
        {
          title: 'Order Management Screen Context-Sensitive Help',
          content: `
              <p><strong>Overview:</strong> The Order Management screen is designed for administrators and employees to view and manage all orders. This screen provides detailed information about each order, including order ID, member ID, order details, order date, total price, and status. It also allows for order collection actions.</p>
              <p><strong>Elements and Features:</strong></p>`
        },
        {      
          title:    `1. Back Button`,
          content:`
              <ul>
                  <li><strong>Description:</strong> An arrow icon located in the header that allows you to return to the previous page.</li>
                  <li><strong>Functionality:</strong> Clicking the back button navigates to the previous page you visited, typically the main administration or dashboard page.</li>
                  <li><strong>Helpful Tips:</strong>
                      <ul>
                          <li>Use the back button if you want to return to your previous page without losing your current context.</li>
                      </ul>
                  </li>
              </ul>`
        },
        {     
            title:  `2. Header Title`,
            content:`
              <ul>
                  <li><strong>Description:</strong> Displays the title "Order Manager" to indicate the purpose of the screen.</li>
                  <li><strong>Functionality:</strong> Provides a clear indication of the current screen's functionality.</li>
              </ul>`
        },      
        {
            title:  `3. Search Bar`,
            content:`
              <ul>
                  <li><strong>Description:</strong> An input field that allows you to search for orders by various criteria.</li>
                  <li><strong>Functionality:</strong>
                      <ul>
                          <li><strong>Placeholder:</strong> "Search orders"</li>
                          <li><strong>Two-way Binding:</strong> Uses [(ngModel)] to bind the search term to the component.</li>
                          <li><strong>Search Filtering:</strong> Filters the displayed orders based on the search term.</li>
                      </ul>
                  </li>
                  <li><strong>Helpful Tips:</strong>
                      <ul>
                          <li>You can search by order ID, member ID, product name, quantity, price, or order status.</li>
                          <li>Use specific keywords to narrow down the search results quickly.</li>
                      </ul>
                  </li>
              </ul>`
        },
        {    
            title:  `4. Orders Table`,
            content:`
              <ul>
                  <li><strong>Description:</strong> Displays a list of all orders in a tabular format with detailed information.</li>
                  <li><strong>Functionality:</strong>
                      <ul>
                          <li><strong>Order ID:</strong> A unique identifier for each order.</li>
                          <li><strong>Member ID:</strong> The ID of the member who placed the order.</li>
                          <li><strong>Order Details:</strong> Displays the product names, quantities, and prices for each item in the order.</li>
                          <li><strong>Order Date:</strong> The date and time when the order was placed.</li>
                          <li><strong>Total Price:</strong> The total cost of the order.</li>
                          <li><strong>Status:</strong> The current status of the order, such as "Ready for Collection," "Overdue for Collection," "Collected," or "Late Collection."</li>
                      </ul>
                  </li>
                  <li><strong>Helpful Tips:</strong>
                      <ul>
                          <li>Regularly review order statuses to ensure timely collection and management.</li>
                          <li>Order details provide a quick overview of what items are included in each order.</li>
                      </ul>
                  </li>
              </ul>`
        },
        {      
            title:  `5. Actions Column`,
            content:`
              <ul>
                  <li><strong>Description:</strong> Provides action buttons for each order.</li>
                  <li><strong>Functionality:</strong>
                      <ul>
                          <li><strong>Collect Button:</strong> Allows you to mark an order as collected.</li>
                          <li><strong>Conditional Display:</strong> The collect button is only visible for orders that are not yet collected.</li>
                      </ul>
                  </li>
                  <li><strong>Helpful Tips:</strong>
                      <ul>
                          <li>Click the "Collect" button to mark an order as collected. This action updates the order status and refreshes the order list.</li>
                      </ul>
                  </li>
              </ul>`
        },
        {      
             title: `Technical Details:`,
             content:`
              <ul>
                  <li>Dynamic Data: The order list dynamically updates based on the data retrieved from the backend.</li>
                  <li>Search Functionality: Uses Angular's two-way binding and filtering to provide real-time search results.</li>
                  <li>Status Update: The status of each order is updated based on backend data, ensuring you have the latest information.</li>
                  <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
              </ul>`
        },
        {      
            title:  `Common Questions:`,
            content:`
              <p><strong>Q:</strong> How do I mark an order as collected?</p>
              <p><strong>A:</strong> Click the "Collect" button in the Actions column for the respective order. This will mark the order as collected and update the order status.</p>
              <p><strong>Q:</strong> What should I do if an order is overdue for collection?</p>
              <p><strong>A:</strong> Follow up with the member to ensure they are aware of the overdue status and encourage them to collect the order as soon as possible.</p>
              <p><strong>Q:</strong> How can I search for a specific order?</p>
              <p><strong>A:</strong> Use the search bar at the top of the screen. You can search by order ID, member ID, product name, quantity, price, or order status.</p>
              <p><strong>Q:</strong> What happens if I click the back button?</p>
              <p><strong>A:</strong> Clicking the back button will navigate you to the previous page you visited. This helps you return to your previous administrative tasks quickly.</p>
              `
        },      
        {      
            title:  `Troubleshooting:`,
            content:`
              <p><strong>Problem:</strong> The order list is not displaying any orders.</p>
              <p><strong>Solution:</strong> Ensure you are connected to the internet and logged in with the appropriate permissions. If the problem persists, try refreshing the page or contact technical support.</p>
              <p><strong>Problem:</strong> The order status is not updating.</p>
              <p><strong>Solution:</strong> Check your internet connection and try refreshing the page. If the issue continues, it may be a temporary problem with the server. Contact support for further help.</p>
              <p><strong>Problem:</strong> The search functionality is not working correctly.</p>
              <p><strong>Solution:</strong> Ensure you are entering valid search terms. If the issue persists, try clearing the search term and entering it again or contact technical support for assistance.</p>
          `
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

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.updatePagedOrders();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.snackBar.open('Failed to load orders', 'Close', { duration: 5000 });
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedOrders();
  }

  updatePagedOrders(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  onPageChange(event: MouseEvent, newPage: number): void {
    event.preventDefault();
    this.page = newPage;
    this.updatePagedOrders();
  }
  

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.order_ID.toString().includes(term) ||
      order.member_ID.toString().includes(term) ||
      order.total_Price.toString().includes(term) ||
      order.order_Status_ID.toString().includes(term) ||
      order.orderLines.some(line =>
        line.product_Name.toLowerCase().includes(term) ||
        line.quantity.toString().includes(term) ||
        line.unit_Price.toString().includes(term)
      )||
      this.getOrderStatusDescription(order.order_Status_ID).toLowerCase().includes(term)
    );
    this.page = 1;  // Reset to first page
    this.updatePagination();
  }
  
  getOrderStatusDescription(statusId: number): string {
    switch (statusId) {
      case 1: return "Ready for Collection";
      case 2: return "Overdue for Collection";
      case 3: return "Collected";
      case 4: return "Late Collection";
      default: return "Unknown";
    }
  }
  

  collectOrder(orderId: number): void {
    this.orderService.orderCollect(orderId).subscribe({
      next: (response) => {
        console.log("Order collected: ", response)
        this.snackBar.open('Order collected successfully', 'Close', { duration: 5000 });
        this.loadOrders(); // Refresh orders
      },
      error: (err) => {
        console.error('Error collecting order: ', err);
        this.snackBar.open('Failed to collect order', 'Close', { duration: 5000 });
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
}
