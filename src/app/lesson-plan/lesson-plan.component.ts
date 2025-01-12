import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LessonPlan } from '../shared/lessonPlan';
import { LessonPlanViewModel } from '../shared/lessonPlanViewModel';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-lesson-plan',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './lesson-plan.component.html',
  styleUrl: './lesson-plan.component.css'
})
export class LessonPlanComponent implements OnInit{

  plans:LessonPlan[]=[];
  //plan:LessonPlanViewModel[] =[]

  plan:LessonPlanViewModel={
    lessonPlan_ID:0,
    lessonPlanName:"",
    workoutID:[],
    workouts:[],
    program_Description:''
  }
  filteredlessonPlans: LessonPlan[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;
  showModal: boolean = false;
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor (private lessonPlanService:LessonPlanService, private elementRef: ElementRef, private router: Router, private dialog:MatDialog){}

  
  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.GetLessonPlans();
    console.log(this.plans);

    // Initialize help content
this.helpContent = [
  {
    title: 'Lesson Plans Overview',
    content: `
      <p><strong>Overview:</strong> The Lesson Plans page allows you to view, search, and manage workout lesson plans.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Search Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for searching lesson plans by their name.</li>
        <li><strong>Functionality:</strong> Type in the name of the lesson plan to filter the displayed list.</li>
      </ul>`
  },
  {
    title: '2. Create Lesson Plan Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to navigate to the page for creating a new lesson plan.</li>
        <li><strong>Action:</strong> Clicking this button takes you to the "Add Lesson Plan" page.</li>
      </ul>`
  },
  {
    title: '3. Lesson Plan Table',
    content: `
      <ul>
        <li><strong>Description:</strong> Displays a list of existing lesson plans with their program names, descriptions, and action buttons.</li>
        <li><strong>Actions:</strong>
          <ul>
            <li><strong>View:</strong> Opens a modal displaying details about the selected lesson plan, including its workouts.</li>
            <li><strong>Edit:</strong> Navigates to the edit page for the selected lesson plan.</li>
            <li><strong>Delete:</strong> Permanently removes the selected lesson plan from the list.</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '4. Modal for Lesson Plan Details',
    content: `
      <ul>
        <li><strong>Description:</strong> A modal that displays detailed information about the selected lesson plan, including its name, description, and list of workouts.</li>
        <li><strong>Action:</strong> The modal contains a "Close" button to dismiss the modal and return to the lesson plans list.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How can I find a specific lesson plan?</p>
      <p><strong>A:</strong> Use the search input at the top of the page to filter lesson plans by name.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> I cannot see the lesson plan I just created.</p>
      <p><strong>Solution:</strong> Ensure that the lesson plan is saved correctly and refresh the page if necessary.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  filterlessonPlans(): void {
    if (!this.searchTerm) {
      this.filteredlessonPlans = this.plans;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredlessonPlans = this.filteredlessonPlans.filter(plan =>
        plan.program_Name.toLowerCase().includes(term) ||
        plan.lesson_Plan_ID.toString().includes(term)
      );
    }
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
        this.filteredlessonPlans.push(element);
        
      });
      
    })
  }

  GetLessonPlansWithWorkouts(id:Number)
  {
    this.lessonPlanService.GetPlanWithWorkouts(id).subscribe(result => {
     
     this.plan = result.value[0];
     
    this.open();
     console.log('Plan',this.plan)
    })
  }

  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.lessplan-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.lessplan-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }

  deleteLessonPlan(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Lesson Plan?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.lessonPlanService.DeletePlan(id).subscribe(
          (result: any) => {
            // Open success dialog
            this.dialog.open(SuccessDialogComponent, { 
              data: { message: 'Lesson Plan successfully deleted!' } 
            });
            setTimeout(() => {
              location.reload();
          }, 1000)
            console.log('Lesson Plan deleted!', result);

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
