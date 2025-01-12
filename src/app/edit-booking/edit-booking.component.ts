import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { TmeSlotCalanderViewModel } from '../shared/bookingCalanderView';
import { TimeslotsService } from '../Services/timeslots.service';
import { BookingService } from '../Services/booking.service';
import { BookingTimeSlotViewModel } from '../shared/bookingTimeSlotViewModel';
import { BookingViewModel } from '../shared/bookingViewModel';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { AuthenticationService } from '../Services/authentication.service';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { timeInterval } from 'rxjs';
import { NgModel } from '@angular/forms';
import { Time } from '../shared/Time';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-booking',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [RouterLink, FormsModule, NgFor, NgIf, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule, MatDatepickerModule],
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.css'
})
export class EditBookingComponent {
  
timeSlots:TmeSlotCalanderViewModel[] =[]
selectedDate!: Date;

availableDates: Date[] = [];
bookedTimes: Time[] = [];
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

booking:BookingViewModel={
  booking_ID:0,
  date: new Date(),
  time: {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  },
  lessonPlanName:'',
  timeSlot_ID:0,
  instructorName:'',
  lessonPlanID:0

}
formattedDates: string[] = []
stringDates: string [] = []
showModal: boolean = false;
slotsAvailable!:Number;
selectedDateTimeSlots:TmeSlotCalanderViewModel[] =[]
selectedTime: TmeSlotCalanderViewModel | null = null;
oldselectedTime: Time | undefined;
  
  updatedBooking:BookingTimeSlotViewModel={
    timeSlot_ID:0,
    member_Id:1,
  }

  bookingId!:Number;
  timeslot_ID!:Number;
  memberBookings: BookingViewModel[] = []
  slotTimes: Time[]=[];
  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  lastDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  minDate = this.firstDayOfMonth;
  maxDate = this.lastDayOfMonth;
  dateValue :string = "";
  userID:number | null = null;
  lessonPlanID!:Number;

  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

constructor (private timeSlotService:TimeslotsService, private elementRef:ElementRef, private bookingService:BookingService, private route: ActivatedRoute,private dialog:MatDialog, private router:Router,private authenticationService:AuthenticationService){}


ngOnInit():void{
  this.route.params.subscribe(params => {
     this.bookingId = params['booking_ID'];
     this.timeslot_ID = params['timeSlot_ID'];
     this.lessonPlanID = params['lessonPlanID']
    // this.bookingId = 1;
    // this.timeslot_ID = 1;
   
   
  });
  console.log('Booking ID',this.bookingId)
  console.log('Timeslot ID',this.timeslot_ID)
  this.GetUser();
  this.GetSlots(this.lessonPlanID);
  this.getBookingSlot(this.bookingId);
  
   this.helpContent = [
      {
        title: 'Changing a Slot',
        content: `
          <p><strong>Overview:</strong> Use this section to change an exiting time slots for various programs.</p>
          <p><strong>Steps to Change your slot:</strong></p>
          <ul>
            <li>Select a date from the calendar.</li>
            <li>Choose a different available time slot to proceed.</li>
            <li>Click "Update Booking" to confirm your booking.</li>
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

filterHelpContent(): void {
  const term = this.searchTerm.toLowerCase();
  this.filteredContent = this.helpContent.filter(item =>
    item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
  );
}

GetUser(){

  this.userID = this.authenticationService.getUserId();

  if(this.userID == null){
   console.log()
  }

 }
getBookingSlot(id: Number): void {
  this.bookingService.GetBooking(id, this.userID).subscribe(result => {
     this.booking = result;
    console.log(result)
    console.log('Booking:',  result)
    this.selectedDate = this.booking.date
    this.GetBookings(result.lessonPlanName);
    
  });
  
 
}

GetBookings(programName:string)
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
    .filter(booking => booking.lessonPlanName === programName)
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




GetSlots(lessonPlanID: Number): void {
  this.timeSlotService.GetByLessonPlan(lessonPlanID).subscribe(result => {
    let slotList: any[] = result;
    console.log('Slots', slotList)
    slotList.forEach((element) => {
      this.timeSlots.push(element);

      this.slotsAvailable = 20 - element.numberOfBookings
      
      this.availableDates = this.timeSlots.map(slot => slot.slotDate);
      this.slotTimes = this.timeSlots.map(slot => slot.slotTime)
     
      this.formattedDates = this.availableDates.map(date => new Date(date).toISOString());
      
    });
  
  });

  //console.log('Dates',this.availableDates)


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

  
  onDateChange(date:Date | null): void {
    // Logic to fetch time slots for the selected date from the service can be implemented here
    if(date){
      console.log('Date', date)
      this.dateValue = date.toLocaleDateString('en-CA').slice(0,10);  
      console.log(this.dateValue)
      
        this.selectedDateTimeSlots = this.timeSlots.filter(slot => new Date(slot.slotDate) === date);
        console.log(this.selectdDateTimeSlot)
        this.getTimeSlot(this.dateValue)
    }
    
    
  }

  
  getTimeSlot(date:string){
    
    this.timeSlotService.GeByDate(date).subscribe(result => {
      let selectedSLot:any[] = result;
      selectedSLot.forEach((element) => {
        this.selectedDateTimeSlots.push(element)
       // this.selectedDate = this.selectdDateTimeSlot.slotDate;
        
      });
      console.log('Slot',this.selectedDateTimeSlots);
      this.onSubmit();
     })
  }
  
  
  
  onSubmit(): void {
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
  
  
  isSelected(timeSlot: TmeSlotCalanderViewModel): boolean {
    return this.selectedTime !== null && this.selectedTime.slotTime.hours === timeSlot.slotTime.hours && this.selectedTime.slotTime.minutes === timeSlot.slotTime.minutes;
  }
  
  BookSlot(timeSlotID: Number, memberID: Number) {
    // Create the updated booking object
    const updatedBooking: BookingTimeSlotViewModel = {
      timeSlot_ID: timeSlotID,
      member_Id: memberID,
    };
    console.log('Updated booking', updatedBooking);
  
    // Open the confirmation dialog before proceeding with the update
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Booking?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Only call UpdateBooking if the user confirms the action
        this.bookingService.UpdateBooking(this.booking.booking_ID, updatedBooking).subscribe(
          (result: BookingTimeSlotViewModel) => {
            console.log('Booking Updated', result);
  
            // Navigate to bookings and show success dialog after successful update
            this.dialog.open(SuccessDialogComponent, { 
              data: { message: 'Booking successfully updated!' } 
            });

            this.router.navigateByUrl('/booking');
          },
          (error: HttpErrorResponse) => {
            // Handle error
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
  

  formatSlotTime(slotTime: any): string {
    if (typeof slotTime === 'string') {
      return new Date(slotTime).toISOString();
    }
    return slotTime;
  }
}
