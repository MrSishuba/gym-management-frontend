import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { LessonPlanWorkoutService } from '../Services/lesson-plan-workout.service';
import { LessonPlan } from '../shared/lessonPlan';
import { Workout } from '../shared/workout';
import { LessonPlanWorkout } from '../shared/lessonPlanWorkout';
import { WorkoutService } from '../Services/workout.service';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormBuilder, NgModel, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-add-lesson-plan',
  standalone: true,
  imports: [RouterLink,FormsModule, NgFor, NgIf,  ReactiveFormsModule],
  templateUrl: './add-lesson-plan.component.html',
  styleUrl: './add-lesson-plan.component.css'
})
export class AddLessonPlanComponent implements OnInit {
  newLessonPlan: LessonPlan = {
    program_Name: '', 
    program_Description: '',
    lesson_Plan_ID: 0
  };

  newLessonPlanWorkout: LessonPlanWorkout={
    lessonPlanWorkoutID:0,
    lessonPlanID:0,
    workout_ID:[ ],
  }
  availableWorkouts: any[][] = [];
  workoutdropdowns!: FormArray; // Initial dropdown
  selectedWorkouts: number[] = []; // Selected workout IDs
  workouts: Workout[] = []; // Placeholder for fetched workouts
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
  createLessonPlanFormGroup: FormGroup;

  constructor(private lessonPlanService: LessonPlanService, private workoutService:WorkoutService, private lessonPlanWorkoutService:LessonPlanWorkoutService, private cdr:ChangeDetectorRef, private router:Router, private dialog:MatDialog, private fb: FormBuilder) { 

    this.createLessonPlanFormGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      workoutDropdowns: this.fb.array([this.createWorkoutDropdown()]) // Start with one dropdown
    });
    
  
  }

  ngOnInit(): void {

    this.fetchWorkouts();
    console.log('Workouts',this.workouts);

    // Initialize help content
this.helpContent = [
  {
    title: 'Create Lesson Plan Overview',
    content: `
      <p><strong>Overview:</strong> The Create Lesson Plan page allows you to create a new workout lesson plan by providing a program name, description, and selecting associated workouts.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Program Name Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the name of the program.</li>
        <li><strong>Requirements:</strong> Must be between 2 and 20 characters and is required.</li>
        <li><strong>Validation:</strong>
          <ul>
            <li>Displays an error message if the field is empty or does not meet the length requirements.</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '2. Program Description Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the description of the program.</li>
        <li><strong>Requirements:</strong> Must be between 10 and 100 characters and is required.</li>
        <li><strong>Validation:</strong>
          <ul>
            <li>Displays an error message if the field is empty or does not meet the length requirements.</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '3. Select Workouts',
    content: `
      <ul>
        <li><strong>Description:</strong> Dropdowns for selecting workouts associated with the lesson plan.</li>
        <li><strong>Functionality:</strong>
          <ul>
            <li>Select workouts from the provided options for each workout dropdown.</li>
            <li>You can add or remove workout dropdowns as needed.</li>
          </ul>
        </li>
        <li><strong>Validation:</strong> At least one workout must be selected for the lesson plan.</li>
      </ul>`
  },
  {
    title: '4. Buttons',
    content: `
      <ul>
        <li><strong>Add Button:</strong> Submits the form to create the lesson plan if all validations pass.</li>
        <li><strong>Cancel Button:</strong> Navigates back to the Lesson Plans page without saving changes.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What happens if I try to submit the form without filling in all required fields?</p>
      <p><strong>A:</strong> You will see error messages indicating which fields need to be completed.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Add" button is disabled and I can't submit the form.</p>
      <p><strong>Solution:</strong> Ensure all required fields are filled out correctly and that the selected workouts are valid.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  fetchWorkouts(): void {
   
    this.workoutService.GetWorkouts().subscribe(
      result => {
        let workoutList:any[] = result;
         
        workoutList.forEach((element) => {
          this.workouts.push(element)
          //this.cdr.detectChanges();
        });
  });

  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }

  createWorkoutDropdown(): FormGroup {
    return this.fb.group({
      workout: [null, Validators.required] // Each dropdown has its own control
    });
  }

  get workoutDropdowns(): FormArray {
    return this.createLessonPlanFormGroup.get('workoutDropdowns') as FormArray;
  }

  addDropdown(): void {
    this.workoutDropdowns.push(this.createWorkoutDropdown()); // Add a new dropdown
    this.selectedWorkouts.push(); // Add a new null entry for the selected workout
  }

  removeDropdown(index: number): void {
    this.workoutDropdowns.removeAt(index); // Remove the dropdown at index
    this.selectedWorkouts.splice(index, 1)
  }

  updateSelectedWorkout(index: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Assert the type
    const selectedValue = Number(selectElement.value); // Get the value
    this.selectedWorkouts[index] = selectedValue; // Update the selected workout
    console.log('Selected Workouts', this.selectedWorkouts);
}

isWorkoutDisabled(workoutId: Number, currentDropdownIndex: number): boolean {
  // Disable if the workout is selected in another dropdown, but not in the current one
  return this.selectedWorkouts.some((selected, idx) => selected === workoutId && idx !== currentDropdownIndex);
}

  createLessonPlan(workoutIDs:number[]){
    console.log('Workout Ids', workoutIDs)

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: { message: 'Are you sure you want to add this Lesson Plan?' }});

       
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
    this.lessonPlanService.AddPlan(this.newLessonPlan).subscribe((result:LessonPlan)=>{
      console.log('Lesson Plan Added', result), 
      
      this.newLessonPlanWorkout.workout_ID = workoutIDs;
      this.newLessonPlanWorkout.lessonPlanID = result.lesson_Plan_ID;

    this.lessonPlanWorkoutService.AddPlanWorkout(this.newLessonPlanWorkout).subscribe((result:LessonPlanWorkout)=>{

      this.router.navigateByUrl('/lesson-plan')
      this.dialog.open(SuccessDialogComponent, {data: { message: 'Lesson Plan successfully added!' }});
     
    },);
    }),(error: HttpErrorResponse) => {
      // Handle error
      this.dialog.open(ErrorDialogComponent, { 
        data: { message: error.error || 'An unexpected error occurred Please try again.' } 
      });
      console.log('Error:', error.error)
    
    };

        }
      });

     

  } 
}
