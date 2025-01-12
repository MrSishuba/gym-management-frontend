import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, RouterLink } from '@angular/router';
import { WorkoutViewModel } from '../shared/workoutViewModel';
import { WorkoutService } from '../Services/workout.service';
import { NgFor, NgIf } from '@angular/common';
import { Workout } from '../shared/workout';
import { WorkoutCategory } from '../shared/workoutCategory';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent implements OnInit {
  workouts:WorkoutViewModel[]=[];
  showModal: boolean = false;
  workout: WorkoutViewModel={
    workout_ID:0,
    workout_Category_ID:0,
    workout_Description:'',
    workout_Name:'',
    sets:0,
    reps:0,
    workoutCategory:''
  }
  filteredWorkouts: WorkoutViewModel[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;

  helpContent: any[] = [];
filteredContent: any[] = [];


  constructor (private workoutService:WorkoutService, private elementRef: ElementRef, private router: Router, private dialog:MatDialog){}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.GetWorkouts();
    console.log('Workouts',this.workouts);


    // Initialize help content
this.helpContent = [
  {
    title: 'Workouts Overview',
    content: `
      <p><strong>Overview:</strong> The Workouts section allows you to manage your workouts, including creating, viewing, editing, and deleting workouts.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Search Workout',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field to search for workouts by name or category.</li>
        <li><strong>Functionality:</strong> Type in the name or category to filter the list of workouts in real-time.</li>
      </ul>`
  },
  {
    title: '2. Workout Categories Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to view all available workout categories.</li>
        <li><strong>Functionality:</strong> Clicking this button navigates you to the Workout Categories page.</li>
      </ul>`
  },
  {
    title: '3. Create Workout Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to create a new workout.</li>
        <li><strong>Functionality:</strong> Clicking this button opens a form to enter workout details.</li>
      </ul>`
  },
  {
    title: '4. Workout Table',
    content: `
      <ul>
        <li><strong>Description:</strong> Displays a list of workouts in a table format with relevant details.</li>
        <li><strong>Functionality:</strong> You can view, edit, or delete workouts from this table.</li>
      </ul>`
  },
  {
    title: '5. Action Buttons',
    content: `
      <ul>
        <li><strong>Description:</strong> Buttons for viewing, editing, or deleting each workout.</li>
        <li><strong>Functionality:</strong> Each button allows you to perform the respective action on the selected workout.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I add a new workout?</p>
      <p><strong>A:</strong> Click on the "Create Workout" button to open the form and fill in the workout details.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> Workouts are not appearing in the list.</p>
      <p><strong>Solution:</strong> Check your search term to ensure it matches existing workouts. Refresh the page if necessary.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];


  }
  filterWorkout(): void {
    if (!this.searchTerm) {
      this.filteredWorkouts = this.workouts;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredWorkouts = this.filteredWorkouts.filter(workout =>
        workout.workout_Name.toLowerCase().includes(term) ||
        workout.workout_ID.toString().includes(term) || workout.workoutCategory.toLowerCase().includes(term)
      );
    }
  }
 
  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }
  GetWorkouts() {
    this.workoutService.GetWorkouts().subscribe(
      result => {
        let workoutList:any[] = result;
    
        workoutList.forEach((element) => {
          this.workouts.push(element);
          this.filteredWorkouts.push(element);
        });
  });
  }
  

  viewWorkout(id:Number){
    this.workoutService.ViewWorkout(id).subscribe(result => {
     
      this.workout = result.value[0];
      
     this.open();
      console.log('Workout',this.workout)
     })
  }


  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.work-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.work-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }
  
  deleteWorkout(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Workout?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.workoutService.DeleteWorkout(id).subscribe((result: Workout) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Workout successfully deleted!' } });
          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Workout deleted!', result);
        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
         
        });
      }
    });
  }
  

}
