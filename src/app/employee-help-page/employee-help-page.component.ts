import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-employee-help-page',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SideNavBarComponent],
  templateUrl: './employee-help-page.component.html',
  styleUrl: './employee-help-page.component.css'
})
export class EmployeeHelpPageComponent implements OnInit {
  userTypeID: number | null = null;
  searchQuery: string = '';

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    this.userTypeID = user.userTypeId;
  }

  filterContent() {
    const helpContent = document.querySelector('.help-content') as HTMLElement;
    const sections = helpContent.querySelectorAll('section');

    sections.forEach((section) => {
      const text = section.textContent?.toLowerCase() || '';
      section.style.display = text.includes(this.searchQuery.toLowerCase()) ? 'block' : 'none';
    });
  }
}
