import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { OrderViewModel } from '../shared/order';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orders: OrderViewModel[] = [];
  filteredOrders: OrderViewModel[] = [];
  pagedOrders: OrderViewModel[] = [];
  selectedOrder: OrderViewModel | null = null;
  searchTerm: string = '';

  // Pagination properties
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private orderService: OrderService, private snackBar: MatSnackBar, private router: Router, private location:Location) {}

  ngOnInit(): void {
    this.loadOrders();
    this.orderService.loadWishlistItems();
    this.orderService.loadCartItems();
  }

  loadOrders(): void {
    this.orderService.getMemberOrders().subscribe({
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

  collectOrder(orderId: number): void {
    this.orderService.collectOrder(orderId).subscribe({
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

  openOrderModal(order: OrderViewModel): void {
    this.selectedOrder = order;
    $('#orderModal').modal('show');
  }

  closeOrderModal(): void {
    $('#orderModal').modal('hide');
  }
  
  goBack(): void {
    this.location.back();
  }
}
