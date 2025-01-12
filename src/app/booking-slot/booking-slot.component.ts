import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { TimeSlot } from '../shared/timeSlot';
import { BookingSlotViewModel } from '../shared/timeSlotViewModel';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { timeInterval } from 'rxjs';
import { Time } from "@angular/common"
import { RouterLink } from '@angular/router';
import { TimeslotsService } from '../Services/timeslots.service';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { AttendanceList } from '../shared/attendanceList';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-booking-slot',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, CommonModule,MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './booking-slot.component.html',
  styleUrl: './booking-slot.component.css'
})
export class BookingSlotComponent {
  

  bookingSlots: BookingSlotViewModel[] = []


  bookingSlot:BookingSlotViewModel={
    timeSlotId:0,
    slotDate: new Date(),
    slotTime: {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
    },
    programName:'',
    employee_Name:'',
    numberOfBookings:0

  }
  filteredbookingSlots: BookingSlotViewModel[] = [];
  searchTerm: string = '';
  selectedDate: string = new Date().toISOString().slice(0,10);
  today: Date = new Date();
  userTypeID: number | null = null;
  list:AttendanceList[]=[]
  slotHasBookings!:boolean;
  displayBookings!:boolean
  helpContent: any[] = [];
filteredContent: any[] = [];

  showModal: boolean = false;

  constructor (private timeSlotService:TimeslotsService, private elementRef: ElementRef, private dialog:MatDialog){}


  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.GetBookingSlots();
   
    console.log(this.bookingSlots);

    // Initialize help content
this.helpContent = [
  {
    title: 'Manage Booking Slots Overview',
    content: `
      <p><strong>Overview:</strong> The Manage Booking Slots page allows you to view, search, and manage booking slots for various lesson plans. You can create new slots, edit existing ones, view slot details, and generate attendance lists.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Navigation and Sidebars',
    content: `
      <ul>
        <li><strong>Back Arrow:</strong> The arrow icon in the header lets you navigate back to the Booking Manager page.</li>
      </ul>`
  },
  {
    title: '2. Create Booking Slot Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button that navigates to the Create Booking Slot page, allowing you to set up a new slot for a lesson plan.</li>
      </ul>`
  },
  {
    title: '3. Search Booking Slot',
    content: `
      <ul>
        <li><strong>Description:</strong> A search input field that lets you filter booking slots by name, date, or other criteria.</li>
        <li><strong>Functionality:</strong>
          <ul>
            <li>As you type, the list of booking slots updates to match your search terms.</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '4. Booking Slots Table',
    content: `
      <ul>
        <li><strong>Description:</strong> Displays a list of all booking slots in a tabular format.</li>
        <li><strong>Columns:</strong>
          <ul>
            <li><strong>Date:</strong> The date of the booking slot.</li>
            <li><strong>Time:</strong> The time of the booking slot.</li>
            <li><strong>Lesson Plan:</strong> The name of the lesson plan associated with the slot.</li>
            <li><strong>Actions:</strong> Buttons to view, edit, delete, or generate an attendance list for the slot.</li>
          </ul>
        </li>
        <li><strong>Actions:</strong>
          <ul>
            <li><strong>View:</strong> Opens a modal with detailed information about the selected booking slot.</li>
            <li><strong>Edit:</strong> Lets you edit the booking slot, available only if the slot date and time haven't passed.</li>
            <li><strong>Delete:</strong> Deletes the booking slot, available only if the slot date and time haven't passed.</li>
            <li><strong>Generate Attendance List:</strong> Generates a downloadable attendance list if there are bookings for the slot.</li>
          </ul>
        </li>
      </ul>`
  },
  
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What happens if I try to delete a slot for a past date?</p>
      <p><strong>A:</strong> The delete option is disabled for past slots to prevent accidental removal of historical data.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Edit" button is not visible for a booking slot.</p>
      <p><strong>Solution:</strong> Ensure the slot date has not passed. Slots in the past cannot be edited.</p>
      <p><strong>Problem:</strong> The "Delete" button is not visible for a booking slot.</p>
      <p><strong>Solution:</strong> Ensure the slot date has not passed. Slots in the past cannot be edited.</p>
      <p><strong>Problem:</strong> The "Generate Attendance List" button is not visible for a booking slot.</p>
      <p><strong>Solution:</strong> This means no member has booked for that timeslot. The button only displays if at least one member has booked.</p>`
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
  

  GetBookingSlots()
  {
    this.timeSlotService.GetSlots().subscribe(result => {
      let slotsList:any[] = result;
    
      slotsList.forEach((element) => {
        this.bookingSlots.push(element);
        console.log("booking slots", this.bookingSlots)
        this.filteredbookingSlots.push(element);
        this.displayBookings = slotsList.some(slot => slot.numberOfBookings > 0);
      
        
      });
    
    })
  }
  
  
  filterBookingSlots(): void {
    if (!this.searchTerm) {
      this.filteredbookingSlots = this.bookingSlots;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredbookingSlots = this.filteredbookingSlots.filter(slots =>
        slots.programName.toLowerCase().includes(term) || slots.slotDate.toString().includes(term) 
      );
    }
  }

  getSlot(id:Number)
  {
    this.timeSlotService.GetCalendarTimeSlots(id).subscribe(result => {
     
     this.bookingSlot = result;
     
    this.open();
     
    
     console.log('Slot',this.bookingSlot)
    })
  }

  
  
  hasDatePassed(bookingDate: Date): boolean {
    const today = new Date();
    return new Date(bookingDate) < today;
  }
  
    
  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.bookslot-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.bookslot-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }

  
formatSlotTime(slotTime: any): string {
  if (typeof slotTime === 'string') {
    return new Date(slotTime).toISOString();
  }
  return slotTime;
}

deleteSlot(id: Number) {
  // Open the confirmation dialog first
  const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
    data: { message: 'Are you sure you want to delete this Time Slot?' } 
  });

  // Handle the result of the confirmation dialog
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.timeSlotService.DeleteSlot(id).subscribe(
        (result: any) => {
          // Open success dialog
          this.dialog.open(SuccessDialogComponent, { 
            data: { message: 'Time Slot successfully deleted!' } 
          });

          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Time Slot deleted!', result);
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


}
