import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../Services/order.service';
import { WishlistItemViewModel } from '../shared/order';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItemViewModel[] = [];

  constructor(private orderService: OrderService, private router: Router, private location: Location, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadWishlistItems();
    this.orderService.loadWishlistItems();
    this.orderService.loadCartItems();
  }

  loadWishlistItems(): void {
    this.orderService.getWishlistItems().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        console.log(items);
      },
      error: (err) => {
        console.error('Error loading wishlist items', err);
      }
    });
  }

  getImageSrc(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  removeFromWishlist(productId: number): void {
    this.orderService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadWishlistItems();
        this.orderService.loadWishlistItems();
      },
      error: (err) => {
        console.error('Error removing item from wishlist', err);
      }
    });
  }

  moveToCart(product_ID: number): void {
    this.orderService.moveFromWishlistToCart(product_ID).subscribe({
      next: () => {
        console.log('Product moved to cart successfully');
        this.loadWishlistItems();
        this.orderService.loadWishlistItems();
        this.orderService.loadCartItems();
        this.snackBar.open('Product added to wishlist!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error moving item to cart', err);
        this.snackBar.open(err.error, 'Close', { duration: 3000 });
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
  
}
