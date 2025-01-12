import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [RouterLink, MasterSideNavBarComponent],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }
}
