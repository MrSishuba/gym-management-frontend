import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,MasterSideNavBarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  userTypeID: number | null = null;

  constructor(private router: Router) { }
  ngOnInit(): void {
    
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  openPhotosApp(): void {
    // Open the Windows Photos application directly
    window.open('ms-photos:', '_blank');
  }

  goBack() {
    this.router.navigate(['/OwnerHome/:id']);
  }
}
