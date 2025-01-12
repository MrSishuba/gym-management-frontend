import { Component } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { Router, RouterLink } from '@angular/router';
import { HelpModalComponent } from './help-modal.component';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, HelpModalComponent, MemberSideNavBarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  totalCartItems: number = 0;
  wishlistCount: number = 0;

  constructor(private cartService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItemsCount.subscribe(count => this.totalCartItems = count);
    this.cartService.wishlistItemsCount.subscribe(count => this.wishlistCount = count);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
