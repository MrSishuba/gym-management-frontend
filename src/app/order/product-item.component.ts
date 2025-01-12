import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product, WishlistViewModel } from '../shared/order';
import { OrderService } from '../Services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, MemberSideNavBarComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Output() cartUpdated = new EventEmitter<number>();
  
  ReceivedProductData!: Subscription;
  product_id!: number;
  product!: Product;
  availableSizes: string[] = [];
  selectedSize: string = '';
  selectedQuantity: number = 1;
  isProductInWishlist: boolean = false;
  maxQuantity: number = 0; // Track the maximum quantity available for the product

  ProductItemForm : FormGroup =new FormGroup({
    product_Name : new FormControl(""),    
    product_Description : new FormControl(""),
    product_Img : new FormControl(""),
    quantity : new FormControl(""),
    unit_Price : new FormControl(""),
    size : new FormControl("")
  });

  constructor(private orderService:OrderService, private router:Router, private activatedRoute:ActivatedRoute, private snackBar: MatSnackBar, private location: Location) {}

  ngOnInit(){
    this.ReceivedProductData = this.activatedRoute.params.subscribe(params => {
      this.product_id = params["product_id"];
      this.getProuct();
      this.orderService.loadWishlistItems();
      this.orderService.loadCartItems();
      this.loadWishlistStatus();
    })
  }

  ngOnDestroy(): void {
    if (this.ReceivedProductData) {
      this.ReceivedProductData.unsubscribe();
    }
  }

  getProuct(){
    this.orderService.getProductById(this.product_id).subscribe({
      next: p=> {
        console.log(p);
        this.ResetForm();
        this.product = p;
        this.Values();
        this.availableSizes = this.getAvailableSizesForProduct(p); // Fetch available sizes based on product
        this.selectedSize = this.product.size;
        this.selectedQuantity = 1;
        this.maxQuantity = this.product.quantity; // Set max quantity available for the product
      },
      error: er => {
        console.log(er);
      }
    });
  }

  getImageSrc(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  Values(){
    this.ProductItemForm.controls["product_Name"].setValue(this.product.product_Name);
    this.ProductItemForm.controls["product_Description"].setValue(this.product.product_Description);
    this.ProductItemForm.controls["product_Img"].setValue(this.product.product_Img);
    this.ProductItemForm.controls["quantity"].setValue(this.product.quantity);
    this.ProductItemForm.controls["unit_Price"].setValue(this.product.unit_Price);
    this.ProductItemForm.controls["size"].setValue(this.product.size);
  }

  ResetForm(){
    this.ProductItemForm.reset();
  }

  getAvailableSizesForProduct(product: Product): string[] {
    return ['XS', 'S', 'M', 'L', 'XL'];
  }


  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }else {
      this.snackBar.open('The minimum quantity has to be 1.', 'Close', { duration: 3000 });
    }
  }

  increaseQuantity(): void {
    if (this.selectedQuantity < this.maxQuantity) {
      this.selectedQuantity++;
    } else {
      this.snackBar.open('You have reached the maximum quantity available.', 'Close', { duration: 3000 });
    }
  }

  addToCart(): void {
    if (this.selectedQuantity > this.maxQuantity) {
      this.snackBar.open('Selected quantity exceeds available stock. Please add product to wishlist.', 'Close', { duration: 3000 });
      return;
    }

    const cartViewModel = {
      product_ID: this.product.product_ID,
      quantity: this.selectedQuantity,
      size: this.selectedSize
    };

    this.orderService.addToCart(cartViewModel).subscribe({
      next: (response) => {
        console.log('Product added to cart successfully', response);
        this.cartUpdated.emit(this.selectedQuantity);
        this.orderService.loadCartItems();
        this.snackBar.open('Product added to cart successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error adding product to cart', err);
          this.snackBar.open(err.error, 'Close', { duration: 3000 });
      }
    });
  }

  addToWishlist(): void {
    const wishlistViewModel: WishlistViewModel = {
      product_ID: this.product.product_ID,
      size: this.selectedSize
    };

    this.orderService.addToWishlist(wishlistViewModel).subscribe({
      next: (response) => {
        console.log('Product added to wishlist successfully', response);
        this.orderService.loadWishlistItems();
        this.loadWishlistStatus();
        this.snackBar.open('Product added to wishlist!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error adding product to wishlist', err);
          this.snackBar.open(err.error, 'Close', { duration: 3000 });
      }
    });
  }

  loadWishlistStatus(): void {
    this.orderService.getWishlistItems().subscribe({
      next: (items: WishlistViewModel[]) => {
        this.isProductInWishlist = items.some(item => item.product_ID === this.product.product_ID);
      },
      error: (err: any) => {
        console.error('Error loading wishlist items', err);
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
}
