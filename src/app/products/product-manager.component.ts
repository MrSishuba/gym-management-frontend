import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [RouterLink, MasterSideNavBarComponent],
  templateUrl: './product-manager.component.html',
  styleUrl: './product-manager.component.css'
})
export class ProductManagerComponent {
  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }

}
