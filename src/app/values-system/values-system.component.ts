import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-values-system',
  standalone: true,
  imports: [RouterLink,CommonModule,SideNavBarComponent],
  templateUrl: './values-system.component.html',
  styleUrl: './values-system.component.css'
})
export class ValuesSystemComponent {
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
