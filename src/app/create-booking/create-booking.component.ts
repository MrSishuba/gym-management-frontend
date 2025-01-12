import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TmeSlotCalanderViewModel } from '../shared/bookingCalanderView';
import { TimeslotsService } from '../Services/timeslots.service';
import { BookingService } from '../Services/booking.service';
import { BookingTimeSlotViewModel } from '../shared/bookingTimeSlotViewModel';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { AuthenticationService } from '../Services/authentication.service';
import { BookingViewModel } from '../shared/bookingViewModel';
import { timeInterval } from 'rxjs';
import { NgModel } from '@angular/forms';
import { Time } from '../shared/Time';
import { NgControl } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-create-booking',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgFor, NgIf, RouterLink, FormsModule, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule, MatDatepickerModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent implements OnInit {

timeSlots:TmeSlotCalanderViewModel[] =[]
selectedDate!: Date;

selectdDateTimeSlot:TmeSlotCalanderViewModel={
  timeSlotId:0 ,
  slotTime: {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  },
  slotDate: new Date(),
  availability: true,
  description: '',
  programName: '',
  employee_Name: '',
  numberOfBookings: 0
}
showModal: boolean = false;
timeSlotsAvailable!:Number;
selectedDateTimeSlots:TmeSlotCalanderViewModel[] =[]
selectedTime: TmeSlotCalanderViewModel | null = null;
//availableSlots!:number[];
lessonPlanID!:Number;
programName!:String;
availableDates: Date[] = [];
isAvailable!:Boolean
helpContent: any[] = [];
filteredContent: any[] = [];
today = new Date();
firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
lastDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1,0 );
startDate!: Date;
endDate!: Date; 
minDate = this.firstDayOfMonth;
maxDate = this.lastDayOfMonth;
dateValue :string = "";
slotedDates:  Date[] = []; // Store the dates with available slots
userID:number | null = null;
showHelpModal = false; 
// datesToHighlight = ["2024-08-22T18:30:00.000Z", "2024-08-22T18:30:00.000Z", "2024-08-24T18:30:00.000Z", "2024-08-28T18:30:00.000Z", "2024-08-24T18:30:00.000Z", "2024-08-23T18:30:00.000Z", "2024-08-22T18:30:00.000Z", "2024-08-25T18:30:00.000Z"];
// newDatesToHighLight =['2024-08-11T09:41:50.817Z', '2024-08-11T09:41:50.817Z', '2024-08-11T09:41:50.817Z', '2024-08-11T09:41:50.817Z', '2024-08-11T09:41:50.817Z', '2024-08-18T15:02:00.000Z', '2024-08-18T18:36:00.000Z', '2024-08-22T16:46:00.000Z', '2024-08-22T19:46:00.000Z']
formattedDates: string[] = []
stringDates: string [] = [];
times:Time | undefined;
slotTimes: Time[]=[];
bookedTimes: Time[] = [];
memberBookings: BookingViewModel[] = []
booked!:boolean;
searchTerm: string = '';

constructor (private timeSlotService:TimeslotsService, private elementRef:ElementRef, private bookingService:BookingService,  private route: ActivatedRoute, private dialog:MatDialog, private router:Router, private authenticationService:AuthenticationService){}



ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.lessonPlanID = params['lesson_Plan_ID'];
    this.programName = params['lessonPlanName'];
    
    
  });
  this.selectedDate = new Date();
  console.log(this.lessonPlanID);
  this.GetSlots(this.lessonPlanID);
  console.log(this.programName);
  this.GetUser();
  this.GetBookings();
  this.selectedDate = new Date();
  
  console.log('Time slots',this.timeSlots);


  this.helpContent = [
    {
      title: 'Booking a Slot',
      content: `
        <p><strong>Overview:</strong> Use this section to book available time slots for various programs.</p>
        <p><strong>Steps to Book:</strong></p>
        <ul>
          <li>Select a date from the calendar.</li>
          <li>Choose an available time slot to proceed.</li>
          <li>Click "Book Now" to confirm your booking.</li>
        </ul>`
    },
    {
      title: 'Understanding Availability',
      content: `
        <p><strong>Availability Indicators:</strong> The number of slots available for a slot are indicated below the time slot.</p>
        <p>If a slot is lightly greyed out with red text, it indicate that the booking has no more slots available or that the booking date or time has passed.</p>
        <p>If a slot is lightly greyed out but still shows the number of available bookings, it indicates a slot you have already booked.</p>`

    },
    {
      title: 'Changing Your Mind',
      content: `
        <p><strong>Back Button:</strong> Use the back button to return to the previous page without making changes to your booking.</p>`
    },
    {
      title: 'Troubleshooting',
      content: `
        <p><strong>Problem:</strong> No slots available.</p>
        <p><strong>Solution:</strong> Try selecting a different date or check back later for updates.</p>`
    }
  ];

  this.filteredContent = [...this.helpContent];
}



GetSlots(lessonPlanID: Number): void {
  this.timeSlotService.GetByLessonPlan(lessonPlanID).subscribe(result => {
    let slotList: any[] = result;
    console.log('Slots', slotList)
    slotList.forEach((element) => {
      this.timeSlots.push(element);

      this.timeSlotsAvailable = 20 - element.numberOfBookings;
      
      this.availableDates = this.timeSlots.map(slot => slot.slotDate);
      this.slotTimes = this.timeSlots.map(slot => slot.slotTime)
     
      this.formattedDates = this.availableDates.map(date => new Date(date).toISOString());
      
    });
  
  });

  //console.log('Dates',this.availableDates)


}

filterHelpContent() {
  if (this.searchTerm) {
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.filteredContent = this.helpContent;  // Reset to all content if search term is empty
  }
}



dateClass() {
 
 // console.log('formattedDates at the start of dateClass:', this.formattedDates);
  this.stringDates = this.formattedDates
  return (date: Date): MatCalendarCellCssClasses => {
    const highlightDate = this.stringDates
      .map(strDate => {
        const parsedDate = new Date(strDate);
       // console.log('Parsed date from formattedDates:', parsedDate);
        return parsedDate;
      })
      .some(d => {
        const isSameDate = d.getDate() === date.getDate() &&
                           d.getMonth() === date.getMonth() &&
                           d.getFullYear() === date.getFullYear();
        //console.log(`Comparing ${d} with ${date}:`, isSameDate);
        return isSameDate;
      });

   // console.log('Is highlight date:', highlightDate);
    return highlightDate ? 'special-date' : '';
  };
}

filterTimeSlotsForToday(): void {
  this.onDateChange(this.selectedDate); // Trigger the logic to filter time slots
}

onDateChange(date:Date | null):void {

  if(date){
    //console.log('Date', date)
    this.dateValue = date.toLocaleDateString('en-CA').slice(0,10);  
    console.log(this.dateValue)
      this.selectedDateTimeSlots = this.timeSlots.filter(slot => new Date(slot.slotDate) === new Date(date));
      this.isAvailable = this.availableDates.includes(this.selectedDate);
      this.getTimeSlot(this.dateValue);
  }
 

}


GetBookings()
{
// Check if userID is not null
if (this.userID !== null) {
  this.bookingService.GetMemberBooking(this.userID).subscribe(result => {
    let bookingsList:any[] = result;

    bookingsList.forEach((element) => {
      this.memberBookings.push(element)
      
      console.log('bookings', this.memberBookings)
    });

    //this check if the lesson plan names are the same and if they are extracts the exiting times and dates already booked so they can be blocked on the calander for rebooking by the member
    this.bookedTimes = this.memberBookings
    .filter(booking => booking.lessonPlanName === this.programName)
    .map(booking => booking.time);


  })
}
}



isSelectedTime(slot: TmeSlotCalanderViewModel): boolean {
  if (!this.bookedTimes || !this.slotTimes) {
    return false;
}

 if (!this.bookedTimes.includes(slot.slotTime)) {
        return false; // Slot time is not found in booked times
    }

return true;
}


getTimeSlot(date:string){
  
  this.timeSlotService.GeByDate(date).subscribe(result => {
    let selectedSLot:any[] = result;
    selectedSLot.forEach((element) => {
      this.selectedDateTimeSlots.push(element)
      this.selectedDateTimeSlots = this.selectedDateTimeSlots.filter(slot => slot.programName === this.programName);
      
    });
    console.log('Slot',this.selectedDateTimeSlots);
    
    this.onSubmit();
   })
}

formatSlotTime(slotTime: any): string {
  if (typeof slotTime === 'string') {
    return new Date(slotTime).toISOString();
  }
  return slotTime;
}


onSubmit(): void {
  // Add your form submission logic here
  console.log('Selected Date and Time:', this.selectedDate, this.selectTime);
}

selectTime(timeSlot: TmeSlotCalanderViewModel, id:Number): void {
  this.selectedTime = timeSlot;

  this.timeSlotService.GetCalendarTimeSlots(id).subscribe(result => {
     
    this.selectdDateTimeSlot = result;
    
   this.open();
    console.log('Selected Time SLot',this.selectdDateTimeSlot)
   })
  
   this.open();

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


GetUser(){

  this.userID = this.authenticationService.getUserId();

  if(this.userID == null){
   console.log()
  }

 }

 BookSlot(timeSlotID: Number) {
  const newBooking: BookingTimeSlotViewModel = {
    timeSlot_ID: timeSlotID,
    member_Id: 0,
  };

  console.log('New booking', newBooking);

  // Open the confirmation dialog
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Are you sure you want to book this slot?' },
  });

  // Only proceed with the booking after the dialog is closed and the user confirms
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {  // Check if the user clicked Confirm
      this.bookingService.CreateBooking(newBooking, this.userID).subscribe(
        (result: BookingTimeSlotViewModel) => {
          console.log('Booking Added', result);

          // Navigate to bookings and open success dialog
          this.router.navigateByUrl('/booking');
          this.dialog.open(SuccessDialogComponent, {
            data: { message: 'Booking Successfully Made!' },
          });
        },
        (error: HttpErrorResponse) => {
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
          console.log('Error:', error.error);
        }
      );
    }
  });
}


slotsAvailableStyling(slotsAvailable: number): string {
  if (slotsAvailable <= 20 && slotsAvailable >= 11) {
    return 'green'; 
  } else if (slotsAvailable <= 10 && slotsAvailable >=5) {
    return 'orange'; 
  } else {
    return 'red';
  }
}



}
