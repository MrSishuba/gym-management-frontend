import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-guest-manager',
  standalone: true,
  imports: [SideNavBarComponent,MasterSideNavBarComponent,CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './guest-manager.component.html',
  styleUrl: './guest-manager.component.css'
})
export class GuestManagerComponent {
    userTypeID: number | null = null;
     
    constructor( private router: Router) {}
  
    ngOnInit(): void {
  
      const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
      this.userTypeID = userTypeId;
    }
  
    goBack(): void {
      this.router.navigate(['/user-manager']);
    }
}
