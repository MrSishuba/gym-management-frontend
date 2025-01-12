import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../Services/booking.service';
import { BookingViewModel } from '../shared/bookingViewModel';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { AuthenticationService } from '../Services/authentication.service';
import { timeInterval } from 'rxjs';
import { Time } from "@angular/common";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule, MemberSideNavBarComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  bookings: BookingViewModel[] = []

  booking:BookingViewModel={
    booking_ID:0,
    date: new Date(),
    time: {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
    },
    lessonPlanName:'',
    timeSlot_ID:0,
    instructorName: '',
    lessonPlanID:0

  }
  
  selectedDate: string = new Date().toISOString().slice(0,10);
  
 userID:number | null = null;
  filteredbookings: BookingViewModel[] = [];
  searchTerm: string = '';

  showModal: boolean = false;
  passedBooking: boolean = false;
  isData: boolean = true;
  today: Date = new Date();
  helpContent: any[] = [];
filteredContent: any[] = [];
  constructor (private bookingService:BookingService, private elementRef: ElementRef, private authenticationService:AuthenticationService, private dialog:MatDialog){}


  ngOnInit(): void {
   
    this.GetUser();
    this.GetBookings();
    console.log(this.bookings);

    // Initialize help content
this.helpContent = [
  {
    title: 'My Bookings Overview',
    content: `
      <p><strong>Overview:</strong> The My Bookings page displays all your active bookings with details for easy management.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Back Button',
    content: `
      <ul>
        <li><strong>Description:</strong> An arrow icon that allows you to return to the Available Bookings page.</li>
        <li><strong>Functionality:</strong> Clicking the back button navigates you back to the previous screen.</li>
      </ul>`
  },
  {
    title: '2. Help Icon',
    content: `
      <ul>
        <li><strong>Description:</strong> A help icon that opens the help modal for guidance on using the My Bookings page.</li>
        <li><strong>Functionality:</strong> Click to view helpful information regarding the various features on this page.</li>
      </ul>`
  },
  {
    title: '3. Search Booking',
    content: `
      <ul>
        <li><strong>Description:</strong> A search input field to filter your bookings based on keywords.</li>
        <li><strong>Functionality:</strong> Type in the booking number or program name to quickly locate a specific booking.</li>
      </ul>`
  },
  {
    title: '4. Bookings Table',
    content: `
      <ul>
        <li><strong>Description:</strong> Displays a list of all your bookings in a table format.</li>
        <li><strong>Functionality:</strong> Each row shows booking details including the booking number, program name, date, and time.</li>
        <li><strong>Actions:</strong> You can view, edit, or delete bookings using the respective buttons in the Actions column.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I edit a booking?</p>
      <p><strong>A:</strong> Click the "Edit" button next to the booking you wish to change and follow the prompts.</p>
      <p><strong>Q:</strong> What if I want to cancel a booking?</p>
      <p><strong>A:</strong> Click the "Delete" button next to the booking, and confirm the deletion in the prompt that appears.</p>
      <p><strong>Q:</strong> The cancel and delete button no longer display, why??</p>
      <p><strong>A:</strong> The delete and edit buttons are only made available for slots that are yet to happen. Once the slot date and time have passed, you can no longer make changes to the slot even if you did not attend.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> My bookings are not displaying.</p>
      <p><strong>Solution:</strong> Ensure you are logged in. If the issue persists, try refreshing the page or contact support.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  GetUser(){

   this.userID = this.authenticationService.getUserId();

   if(this.userID == null){
    console.log()
   }

  }
  
  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }
  
  
  


  GetBookings()
  {
   
  // Check if userID is not null
  if (this.userID !== null) {
    this.bookingService.GetMemberBooking(this.userID).subscribe(result => {
      let bookingsList:any[] = result;
      
      bookingsList.forEach((element) => {
        this.bookings.push(element)
        console.log('bookings', this.bookings)
        this.filteredbookings.push(element)
        
        this.isData = this.bookings.length > 0;
    
      });
      
    })
  }
  }


  
  filterBookings(): void {
    if (!this.searchTerm) {
      this.filteredbookings = this.bookings;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredbookings = this.filteredbookings.filter(book =>
        book.lessonPlanName.toLowerCase().includes(term) ||
        book.date.toString().includes(term) ||  book.time.toString().includes(term)
      );
    }
  }

  hasDatePassed(bookingDate: Date): boolean {
    const today = new Date();
    return new Date(bookingDate) < today;
  }


  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.slot-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.slot-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }

  viewBookingDetails(id: Number){

    this.bookingService.GetBooking(id, this.userID).subscribe(result => {
      this.booking = result;
     console.log(result)
     console.log('Booking:',  result)

     
   });
   
   this.open()
  }


  deleteBooking(id: Number) {
    // Open the confirmation dialog before proceeding with the deletion
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to cancel this booking?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Only call DeleteBooking if the user confirms the action
        this.bookingService.DeleteBooking(id).subscribe(
          (result: BookingViewModel) => {
            console.log('Booking deleted!');
  
            this.dialog.open(SuccessDialogComponent, { 
              data: { message: 'Booking successfully canceled!' } 
            });

            setTimeout(() => {
              location.reload();
          }, 1000);
          
            
          },
          (error: HttpErrorResponse) => {
            // Handle error
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  
  
formatSlotTime(slotTime: any): string {
  if (typeof slotTime === 'string') {
    return new Date(slotTime).toISOString();
  }
  return slotTime;
}

}
