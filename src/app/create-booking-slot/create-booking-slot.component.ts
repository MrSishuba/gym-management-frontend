import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';
import { timeInterval } from 'rxjs';
import { NgModel } from '@angular/forms';
import { Time } from '../shared/Time';
import { TimeSlot } from '../shared/timeSlot';
import { LessonPlan } from '../shared/lessonPlan';
import { Employee } from '../shared/employee';
import { TimeslotsService } from '../Services/timeslots.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-booking-slot',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgFor, NgIf, RouterLink, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './create-booking-slot.component.html',
  styleUrl: './create-booking-slot.component.css'
})
export class CreateBookingSlotComponent implements OnInit {
  plans:LessonPlan[]=[];
  employees:Employee[]=[];
  timeSlotId!:Number;
  slotTime!:Time;
  slotDate!:Date;
  availability!:Boolean;
  employee_ID!:Number;
  lesson_Plan_ID!:Number;
  selectedTime: Time | null = null;
  selectedDate: Date = new Date();
  createLessonPlanFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
 filteredContent: any[] = [];
 minDate!: string;


  constructor (private lessonPlanService:LessonPlanService, private timeSLotService:TimeslotsService, private elementRef: ElementRef, private router:Router,private dialog:MatDialog, private fb: FormBuilder){

    this.createLessonPlanFormGroup = this.fb.group({
      date:[null, Validators.required],
      trainer: [null, Validators.required],
      program: [null, Validators.required],

    });
  }


  ngOnInit(): void {
    this.GetLessonPlans();
    this.GetEmployees();
    console.log(this.plans);
    console.log(this.employees);
    const today = new Date();
    // Format date to YYYY-MM-DDTHH:MM (datetime-local requires this format)
    this.minDate = today.toISOString().slice(0,16);

    // Initialize help content
this.helpContent = [
  {
    title: 'Create Slot Overview',
    content: `
      <p><strong>Overview:</strong> The Create Slot page allows you to set up a new booking slot by selecting a date and time, lesson plan, and trainer. This page is essential for scheduling new sessions in the system.</p>`
  },
  {
    title: '1. Select Date and Time',
    content: `
      <ul>
        <li><strong>Date and Time Picker:</strong> Use the date and time picker to select the exact date and time for the booking slot.</li>
        <li><strong>Validation:</strong>
          <ul>
            <li>If the date is not selected, a warning message will appear stating that the "Date is required."</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '2. Select Lesson Plan',
    content: `
      <ul>
        <li><strong>Lesson Plan Dropdown:</strong> Choose a lesson plan from the dropdown list. The dropdown is populated with available plans.</li>
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
        <li><strong>Trainer Dropdown:</strong> Select a trainer from the dropdown list to assign them to the session.</li>
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
        <li><strong>Add:</strong> Once all fields are filled, click this button to create the booking slot.</li>
        <li><strong>Validation:</strong> The button remains disabled until all required fields are valid and filled.</li>
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
      <p><strong>Problem:</strong> The "Add" button is disabled even though all fields seem to be filled.</p>
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

  CreateBookingSlot(slot_Date: Date, slot_Time: Time, availability: Boolean, employeeID: Number, lessonPlanID: Number) {
    // Construct the new booking slot object
    const newBookingSlot: TimeSlot = {
      timeSlotId: 0,
      time: slot_Date, // Use the slot_Time parameter directly
      date: slot_Date, // Use the slot_Date parameter directly
      availability: availability,
      employee_ID: employeeID,
      lesson_Plan_ID: lessonPlanID
    };
    console.log('New booking slot', newBookingSlot);
  
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to create this booking slot?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // If the user confirms, proceed with creating the booking slot
        this.timeSLotService.CreateBookingSlot(newBookingSlot).subscribe(
          (result: TimeSlot) => {
            // Navigate and show a success message after successful creation
            this.router.navigateByUrl('/booking-slot');
            this.dialog.open(SuccessDialogComponent, { data: { message: 'Slot successfully created!' } });
            console.log('Booking Slot Added', result);
          },
          (error: HttpErrorResponse) => {
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
           // alert(error.error);
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  






}
