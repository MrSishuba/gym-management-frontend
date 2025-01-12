import { Component, OnInit } from '@angular/core';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-owner-help-page',
  standalone: true,
  imports: [MasterSideNavBarComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './owner-help-page.component.html',
  styleUrls: ['./owner-help-page.component.css']
})
export class OwnerHelpPageComponent implements OnInit {
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
