import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { timeInterval } from 'rxjs';
import { NgModel, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Time } from '../shared/Time';
import { TimeSlot } from '../shared/timeSlot';
import { Employee } from '../shared/employee';
import { LessonPlan } from '../shared/lessonPlan';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { TimeslotsService } from '../Services/timeslots.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-booking-slot',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-booking-slot.component.html',
  styleUrl: './edit-booking-slot.component.css'
})
export class EditBookingSlotComponent implements OnInit {
  plans:LessonPlan[]=[];
  employees:Employee[]=[];
  registerFormGroup: FormGroup;
  timeSlot:TimeSlot={
    timeSlotId:0,
    time:new Date(),
    date: new Date(),
    availability:false,
    employee_ID:0,
    lesson_Plan_ID:0

  }
  selectedPlan!:Number;
  selectedEmployee!:Number;
  timeSlotID!:Number;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
minDate!: string;
 
  constructor (private lessonPlanService:LessonPlanService, private timeSLotService:TimeslotsService, private elementRef: ElementRef, private route:ActivatedRoute, private router:Router, private dialog:MatDialog, private fb: FormBuilder){
    this.registerFormGroup = this.fb.group({
      date:[null, Validators.required],
      trainer: [null, Validators.required],
      program: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.timeSlotID = params['bookingSlotID'];
      
    });

    this.getTimeSlot(this.timeSlotID);
    this.GetLessonPlans();
    this.GetEmployees();
    console.log(this.plans)
    console.log(this.employees);
    const today = new Date();
    // Format date to YYYY-MM-DDTHH:MM (datetime-local requires this format)
    this.minDate = today.toISOString().slice(0,16);
    const existingTimeSlot = { date: '2024-09-25T14:30' }; // Sample existing date
    



    // Initialize help content
this.helpContent = [
  {
    title: 'Edit Slot Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Slot page allows you to edit a  booking slot by selecting a diffeent date and time, lesson plan, and/or trainer.</p>`
  },
  {
    title: '1. Select Date and Time',
    content: `
      <ul>
        <li><strong>Date and Time Picker:</strong> Use the date and time picker to select the updated date and time for the booking slot.</li>
      `
  },
  {
    title: '2. Select Lesson Plan',
    content: `
      <ul>
        <li><strong>Lesson Plan Dropdown:</strong> Choose a different lesson plan from the dropdown list. The dropdown is populated with available plans.</li>
        <li><strong>Validation:</strong>
          <ul>
            <li>If a lesson plan is not selected, a warning message will appear stating that the "Program is required."</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '3. Assign Trainer',
    content: `
      <ul>
        <li><strong>Trainer Dropdown:</strong> Select a different trainer from the dropdown list to assign them to the session.</li>
        <li><strong>Validation:</strong>
          <ul>
            <li>If a trainer is not selected, a warning message will appear stating that the "Trainer is required."</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '4. Form Submission',
    content: `
      <ul>
        <li><strong>Save:</strong> Click this button to update the booking slot.</li>
        <li><strong>Validation:</strong> The button become disabled if all required fields are not valid and filled.</li>
      </ul>`
  },
  {
    title: '5. Cancel Button',
    content: `
      <ul>
        <li><strong>Description:</strong> The "Cancel" button allows you to return to the manage booking slot page without creating a new slot.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What should I do if I can’t select a lesson plan?</p>
      <p><strong>A:</strong> Ensure that the lesson plans are properly set up in the system and that they have been sucessfully created and that you have the necessary permissions to access them.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Save" button is disabled even though all fields seem to be filled.</p>
      <p><strong>Solution:</strong> Double-check that all required fields are correctly filled and valid, and ensure that the form control bindings are properly connected.</p>`
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



  GetLessonPlans()
  {
    this.lessonPlanService.GetPlans().subscribe(result => {
      let lessonPlanList:any[] = result;
    
      lessonPlanList.forEach((element) => {
        this.plans.push(element)
        
      });
      
    })
  }

  GetEmployees()
  {
    this.timeSLotService.GetEmployees().subscribe(result => {
      let employeeList:any[] = result;
    
      employeeList.forEach((element) => {
        this.employees.push(element)
        
      });
      
    })
  }

  getTimeSlot(id:Number){
    this.timeSLotService.GetCalendarTimeSlots(id).subscribe(result =>{
      this.timeSlot = result;
      this.selectedPlan = this.timeSlot.lesson_Plan_ID;
      this.selectedEmployee = this.timeSlot.employee_ID;
      console.log("date time", result.slotDate)
      this.registerFormGroup.patchValue({
        date: result.slotDate// Ensure this matches the property in your timeSlot object
        
    });

    
      console.log('Slot:', this.timeSlot)
    })
  }
  onDateChange(updatedDate: Date): void {
    this.timeSlot.date = updatedDate;  // Keep timeSlot in sync with the input
}

  UpdateTimeSlot() {

    const updatedDateTime = this.registerFormGroup.get('date')?.value;
    // Prepare the updated time slot
    this.timeSlot.time = updatedDateTime;
    this.timeSlot.employee_ID = this.selectedEmployee;
    this.timeSlot.lesson_Plan_ID = this.selectedPlan;
    console.log('Updated slot', this.timeSlot);
  
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Booking Slot?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // If the user confirms, proceed with updating the time slot
        this.timeSLotService.UpdateSlot(this.timeSlot.timeSlotId, this.timeSlot).subscribe(
          (result: TimeSlot) => {
            // Navigate and show a success message after successful update
            this.router.navigateByUrl('/booking-slot');
            this.dialog.open(SuccessDialogComponent, { data: { message: 'Slot successfully updated!' } });
            console.log('Slot updated', result);
          },
          (error: HttpErrorResponse) => {
            // Handle error
            alert(error.error);
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  
}
