import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { CartItemViewModel, CartViewModel } from '../shared/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { PayfastComponent } from "./payfast.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, PayfastComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: CartItemViewModel[] = [];
  totalAmount: number = 0;

  constructor(private orderService: OrderService, private location:Location) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.orderService.loadWishlistItems();
    this.orderService.loadCartItems();
  }

  loadCartItems(): void {
    this.orderService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotalAmount();
        console.log(items)
      },
      error: (err) => {
        console.error('Error loading cart items', err)
      }
    });
  }

  getImageSrc(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.unit_Price * item.quantity), 0);
  }

  changeQuantity(item: CartItemViewModel, change: number): void {
    if (item.quantity + change <= 0) {
      // Optionally handle removing the item if quantity reaches 0
      this.removeItem(item.product_ID);
      return;
    }

    const updatedItem: CartViewModel = {
      product_ID: item.product_ID,
      quantity: item.quantity + change
    };

    this.orderService.updateCart(updatedItem).subscribe({
      next: () => {
        this.loadCartItems(); // Refresh cart items
        this.orderService.loadCartItems();
      },
      error: (err) => {
        console.error('Error updating cart item quantity', err);
      }
    });
  }

  removeItem(productId: number): void {
    this.orderService.removeFromCart(productId).subscribe({
      next: () => {
        this.loadCartItems(); // Refresh cart items
        this.orderService.loadCartItems();
      },
      error: (err) => {
        console.error('Error removing item from cart', err);
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
}
