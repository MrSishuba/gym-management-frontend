import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent implements OnInit {

  userTypeID: number | null = null;


  constructor(private router: Router, private location: Location) { }
  
  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);
  }

  goBack(): void {
    this.location.back();
  }
}
