import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { LessonPlan } from '../shared/lessonPlan';
import { LessonPlanViewModel } from '../shared/lessonPlanViewModel';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';
import { TimeslotsService } from '../Services/timeslots.service';
import { TmeSlotCalanderViewModel } from '../shared/bookingCalanderView';
import { TimeScale } from 'chart.js';

@Component({
  selector: 'app-available-bookings',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, MemberSideNavBarComponent],
  templateUrl: './available-bookings.component.html',
  styleUrl: './available-bookings.component.css'
})
export class AvailableBookingsComponent {
  plans:LessonPlan[]=[];
  //plan:LessonPlanViewModel[] =[]

  plan:LessonPlanViewModel={
    lessonPlan_ID:0,
    lessonPlanName:"",
    workoutID:[],
    workouts:[],
    program_Description:''
  }
  timeSlots:TmeSlotCalanderViewModel[] =[]
  lessonPlanNames:String[] = [];
  slotProgramNames:String[]=[];
  display:boolean = false;
  showModal: boolean = false;
  searchTerm: string = '';
  helpContent: any[] = [];
 filteredContent: any[] = [];

  constructor (private lessonPlanService:LessonPlanService, private elementRef: ElementRef, private timeSLotService:TimeslotsService){}

  ngOnInit(): void {
    this.GetLessonPlans();
    console.log(this.plans);

    this.helpContent = [
      {
        title: 'Available Programs Overview',
        content: `
          <p><strong>Overview:</strong> The Available Programs section allows you to view various programs available for booking.</p>
          <p><strong>Elements and Features:</strong></p>`
      },
      {
        title: '1. Back Button',
        content: `
          <ul>
            <li><strong>Description:</strong> An arrow icon located in the navigation area that allows you to return to the home page.</li>
            <li><strong>Functionality:</strong> Clicking the back button navigates you back to the home screen.</li>
          </ul>`
      },
      {
        title: '2. My Bookings Button',
        content: `
          <ul>
            <li><strong>Description:</strong> A button that redirects you to your bookings.</li>
            <li><strong>Functionality:</strong> Click to view all your current bookings and their statuses.</li>
          </ul>`
      },
      {
        title: '3. Programs List',
        content: `
          <ul>
            <li><strong>Description:</strong> Displays a list of available programs.</li>
            <li><strong>Functionality:</strong> Each program card shows the name and description of the program.</li>
            <li><strong>Booking:</strong> Click the "Book" button on each program card to start the booking process.</li>
          </ul>`
      },
      {
        title: 'Technical Details:',
        content: `
          <ul>
            <li>Dynamic Data: The programs displayed are retrieved from the backend based on availability.</li>
            <li>Navigation: Utilizes Angular's Router for seamless transitions between different sections of the application.</li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> How do I book a program?</p>
          <p><strong>A:</strong> Click on the "Book" button associated with the program you want to book.</p>
          <p><strong>Q:</strong> What should I do if I encounter an issue?</p>
          <p><strong>A:</strong> If you face any issues, try refreshing the page or contact support for assistance.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> Programs are not loading.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet. Refresh the page or contact technical support if the issue persists.</p>`
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


  GetLessonPlans() {
    this.lessonPlanService.GetPlans().subscribe(result => {
      console.log('Lesson Plans:', result); // Log the lesson plans
      let lessonPlanList: any[] = result;
  
      this.plans = lessonPlanList;
      this.lessonPlanNames = this.plans.map(name => name.program_Name);
      this.displayProgram(this.lessonPlanNames);
    });
  }
  

  displayProgram(programNames: String[]) {
    console.log('Programs:', programNames);
  
    this.timeSLotService.GetSlots().subscribe(result => {
      console.log('Slots:', result); // Check the slot data
      let slotList: any[] = result;
      this.timeSlots = slotList;
  
      // Normalize and ensure unique slot program names
      this.slotProgramNames = Array.from(new Set(this.timeSlots.map(slot => slot.programName.trim().toLowerCase())));
      console.log('Slot Program Names:', this.slotProgramNames);
  
      // Normalize program names for comparison
      const normalizedProgramNames = programNames.map(name => name.trim().toLowerCase());
  
      // Filter the plans to show only those with available slots
      this.plans = this.plans.filter(plan => 
        this.slotProgramNames.includes(plan.program_Name.trim().toLowerCase())
      );
  
      // Update display based on whether there are any plans to show
      this.display = this.plans.length > 0;
  
      console.log('Filtered Plans:', this.plans);
      console.log('Display:', this.display);
    });
  }
  
  
  
  GetLessonPlansWithWorkouts(id:Number)
  {
    this.lessonPlanService.GetPlanWithWorkouts(id).subscribe(result => {
     
     this.plan = result.value[0];
     
     console.log('Plan',this.plan)
    })
  }

}
