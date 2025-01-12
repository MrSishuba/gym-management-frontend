import { Component, ViewChild } from '@angular/core';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RouterLink, Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingReportComponent } from '../booking-report/booking-report.component';
import { BookingService } from '../Services/booking.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';


// import { IonicModule, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-booking-manager',
  standalone: true,
  imports: [CommonModule, MasterSideNavBarComponent, SideNavBarComponent, MatCard, MatCardModule, RouterLink, FormsModule],
  templateUrl: './booking-manager.component.html',
  styleUrl: './booking-manager.component.css'
})
export class BookingManagerComponent {      
  
  userTypeID: number | null = null;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor (private router:Router){}
  
  ngOnInit() {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    // Initialize help content
this.helpContent = [
  {
    title: 'Booking Manager Overview',
    content: `
      <p><strong>Overview:</strong> The Booking Manager allows you to manage various aspects of bookings, workouts, and lesson plans.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Back Button',
    content: `
      <ul>
        <li><strong>Description:</strong> An arrow icon that allows you to return to the previous page.</li>
        <li><strong>Functionality:</strong> Clicking the back button navigates you back to the last screen you were on.</li>
      </ul>`
  },
  {
    title: '2. Header Title',
    content: `
      <ul>
        <li><strong>Description:</strong> The title of the page, indicating you are in the Booking Manager.</li>
        <li><strong>Functionality:</strong> Serves as a reminder of your current location within the application.</li>
      </ul>`
  },
  {
    title: '3. Menu Items',
    content: `
      <ul>
        <li><strong>Description:</strong> Links to different sections of the application, including Workouts, Lesson Plans, and Bookings.</li>
        <li><strong>Functionality:</strong> Clicking on any menu item will navigate you to the page pertaiing to the home page.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I navigate to a different section?</p>
      <p><strong>A:</strong> Click on the corresponding menu item in the Booking Manager to go to Workouts, Lesson Plans, or Bookings.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The menu items are not responsive.</p>
      <p><strong>Solution:</strong> Ensure your internet connection is stable. Refresh the page if the issue persists.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
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
