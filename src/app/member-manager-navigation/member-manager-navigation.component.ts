import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-manager-navigation',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SideNavBarComponent,MasterSideNavBarComponent,RouterLink],
  templateUrl: './member-manager-navigation.component.html',
  styleUrl: './member-manager-navigation.component.css'
})
export class MemberManagerNavigationComponent {
  userTypeID: number | null = null;

  
  constructor( private router: Router) {}




  ngOnInit(): void {

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  goBack(): void {
    this.router.navigate(['/member-manager']);
  }

}
