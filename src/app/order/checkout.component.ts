import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { PayfastComponent } from "./payfast.component";
import { OrderService } from '../Services/order.service';
import { CartItemViewModel } from '../shared/order';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { PaymentService } from '../Services/payment.service';
import { error } from 'jquery';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, PayfastComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  cartItems: CartItemViewModel[] = [];
  subtotal: number = 0;
  totalAmount: number = 0;
  finalAmount: number = 0;
  vatAmount: number = 0;
  vatPercentage: number = 0;
  discountCode: string = '';
  discountPercentage: number = 0;

  constructor(private orderService: OrderService, private location:Location, private vatService: PaymentService, private discountService: PaymentService, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadVAT();
  }

  loadCartItems(): void {
    this.orderService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  loadVAT(): void {
    this.vatService.getVAT().subscribe(vat => {
      this.vatPercentage = vat.vaT_Percentage;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.unit_Price * item.quantity), 0);
    this.vatAmount = this.subtotal * (this.vatPercentage / 100);
    this.totalAmount = this.subtotal + this.vatAmount;
    this.finalAmount = this.totalAmount - (this.totalAmount * (this.discountPercentage / 100));
    this.paymentService.setFinalAmount(this.finalAmount); // Set the final amount in shared service
    console.log('Calculated finalAmount:', this.finalAmount); // Debugging line
  }

  applyDiscount(): void {
    this.discountService.validateDiscountCode(this.discountCode).subscribe({
      next: response => {
        console.log("applied discount", response);
        this.discountPercentage = response.discount_Percentage;
        this.calculateTotal();
        this.discountCode = ''; // Clear discount code after applying
      },
      error: (error) => {
        // Handle error if discount code is invalid or expired
        console.log("error discount", error);
        alert(error);
        this.discountCode = ''; // Clear discount code after applying
      }
    });
  }

  cancel(): void {
    // Navigate back to cart or home
    
  }
  
  goBack(): void {
    this.location.back();
  }
}
