import { Component } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { Product } from '../shared/order';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  productImage: string | null = null;
  products:Product[] = [];
  totalCartItems: number = 0;
  filteredProducts: Product[] = [];
  isSidebarOpen: boolean = false;
  searchTerm: string = '';

  constructor(private orderService:OrderService, private location: Location, private router: Router) {}

  ngOnInit(){
    this.GetAllProducts();
    this.orderService.cartItemsCount.subscribe(count => this.totalCartItems = count); // Update cart items count
    this.orderService.loadWishlistItems();
    this.orderService.loadCartItems();
  }

  GetAllProducts(): void {
    this.orderService.getAllProducts().subscribe({
      next: (p) => {
        this.products = p;
        this.filteredProducts = p;   
        console.log(p);        
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  filterProductsByCategory(categoryId: number): void {
    if (categoryId === 0) {
      this.filteredProducts = this.products; // Display all products if 'All' is selected
    } else {
      this.filteredProducts = this.products.filter(product => product.product_Category_ID === categoryId);
    }
    // this.toggleSidebar(); // Close sidebar after selecting a category
  }
  

  filteredProductsBySearch(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.product_Name.toLowerCase().includes(term)
      );
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onCartUpdated(quantity: number) {  // Update cart count
    this.totalCartItems += quantity;
    // this.orderService.updateCartCount(this.totalCartItems); // Update the cart count in the service
  }

  getImageSrc(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }
  
  goBack() {
    const userTypeId = JSON.parse(localStorage.getItem('User')!).userTypeId;
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    if (userTypeId === 1) {  // Ensure userTypeID is compared as string
      this.router.navigateByUrl(`/OwnerHome/${userId}`);
    } else if (userTypeId === 2) {
      this.router.navigateByUrl(`/EmployeeHome/${userId}`);
    } else if (userTypeId === 3) {
      this.router.navigateByUrl(`/Home/${userId}`);
    }
  }
}
