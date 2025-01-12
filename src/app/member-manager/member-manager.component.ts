import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
declare var $: any;

@Component({
  selector: 'app-member-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './member-manager.component.html',
  styleUrl: './member-manager.component.css'
})

export class MemberManagerComponent implements OnInit{
  
  userTypeID: number | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void{
  const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
  this.userTypeID = userTypeId;
  console.log('User Type ID',userTypeId);
  }

  goBack() {
    const userTypeId = JSON.parse(localStorage.getItem('User')!).userTypeId;
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    if (userTypeId === 1) {  // Ensure userTypeID is compared as string
      this.router.navigateByUrl(`/OwnerHome/${userId}`);
    } else if (userTypeId === 2) {
      this.router.navigateByUrl(`/EmployeeHome/${userId}`);
    } else if (userTypeId === 3) {
      this.router.navigateByUrl(`/Home/${userId}`);
    }
  }

}
