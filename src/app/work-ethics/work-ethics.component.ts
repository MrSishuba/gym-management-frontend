import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-work-ethics',
  standalone: true,
  imports: [RouterLink,CommonModule,SideNavBarComponent],
  templateUrl: './work-ethics.component.html',
  styleUrl: './work-ethics.component.css'
})
export class WorkEthicsComponent {
  showModal: boolean = false;
  userTypeID: number | null = null;

  constructor(private router: Router) {}
 

  ngOnInit() {
     const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
     this.userTypeID = userTypeId;
   }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goBackToEmployeeHome(): void {
    this.router.navigate(['EmployeeHome/:id']);
  }


}
