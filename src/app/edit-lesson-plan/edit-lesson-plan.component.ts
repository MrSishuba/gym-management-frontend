import { Component, OnInit } from '@angular/core';
import { LessonPlan } from '../shared/lessonPlan';
import { LessonPlanWorkout } from '../shared/lessonPlanWorkout';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { LessonPlanViewModel } from '../shared/lessonPlanViewModel';
import { Workout } from '../shared/workout';
import { WorkoutService } from '../Services/workout.service';
import { LessonPlanWorkoutService } from '../Services/lesson-plan-workout.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormBuilder, NgForm, NgModelGroup, FormArray } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-lesson-plan',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-lesson-plan.component.html',
  styleUrl: './edit-lesson-plan.component.css'
})
export class EditLessonPlanComponent implements OnInit {


  updatedLessonPlan: LessonPlan = {
    program_Name: '', 
    program_Description: '',
    lesson_Plan_ID: 0
  };

  lessonPlan: LessonPlanViewModel ={
    lessonPlan_ID:0,
    workoutID:[],
    workouts:[],
    program_Description:'',
    lessonPlanName:'', 
  }

  lessonPlanWorkout: LessonPlanWorkout={
    lessonPlanWorkoutID:0,
    lessonPlanID:0,
    workout_ID:[ ],
  }
  lessonPlanID!:Number;
  workoutdropdowns!: FormArray; // Initial dropdown
  selectedWorkouts: (Number | null)[] = []; // Selected workout IDs
  existingworkouts:Number []=[];
  workouts:Workout[]=[]
  createLessonPlanFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
  constructor(private workoutService:WorkoutService, private  lessonPlanService:LessonPlanService, private route: ActivatedRoute, private router: Router, private  lessonPlanWorkoutService:LessonPlanWorkoutService, private dialog:MatDialog, private fb: FormBuilder){
    this.createLessonPlanFormGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      workoutDropdowns: this.fb.array([this.createWorkoutDropdown()])
    });
  }

  ngOnInit():void{
    this.route.params.subscribe(params => {
      this.lessonPlanID = params['lesson_Plan_ID'];
      this.getLessonPlan(this.lessonPlanID);
     
    });

    this.createLessonPlanFormGroup.valueChanges.subscribe(formValue => {
      console.log('Form Value:', formValue);  // Logs form values
      console.log('Form Validity:', this.createLessonPlanFormGroup.valid);  // Logs if the overall form is valid
      
      // Check validity of each dropdown control inside the form array (workoutDropdowns)
      this.workoutDropdowns.controls.forEach((control, index) => {
        console.log(`Dropdown ${index + 1} - Validity:`, control.valid);  // Check if this control is valid
        console.log(`Dropdown ${index + 1} - Value:`, control.value);  // If there are errors, log them
      });
    });

    this.fetchWorkouts();

    
    // Initialize help content
this.helpContent = [
  {
    title: 'Edit Lesson Plan Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Lesson Plan page allows you to update an existing lesson plan by providing new values for the program name and/ordescription.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Program Name Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the updated name of the program.</li>
        <li><strong>Requirements:</strong> Must be between 2 and 20 characters and is required.</li>`
  },
  {
    title: '2. Program Description Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the updated description of the program.</li>
        <li><strong>Requirements:</strong> Must be between 10 and 100 characters and is required.</li>`
  },
  
  {
    title: '3. Buttons',
    content: `
      <ul>
        <li><strong>Save Button:</strong> Submits the form to update the lesson plan if all validations pass.</li>
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
      <p><strong>Problem:</strong> The "Save" button is disabled and I can't submit the form.</p>
      <p><strong>Solution:</strong> Ensure all required fields are filled out correctly and that the selected workouts are valid.</p>`
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

  get workoutDropdowns(): FormArray {
    return this.createLessonPlanFormGroup.get('workoutDropdowns') as FormArray;
  }

  isSelected(workoutId: Number, index: number): boolean {
    return this.lessonPlan.workoutID.includes(workoutId);
  }
 createWorkoutDropdown(): FormGroup {
    return this.fb.group({
      workout: [null, Validators.required] // Each dropdown has its own control
    });
  }
 
  getLessonPlan(id: Number): void {
    this.lessonPlanService.GetPlanWithWorkouts(id).subscribe(result => {
      this.lessonPlan = result.value[0];
       // Pre-select the workouts in the dropdowns
      
       this.existingworkouts = this.lessonPlan.workoutID.slice();
       this.selectedWorkouts =  [...this.existingworkouts]; // Start with existing workouts selected
       this.workoutDropdowns.clear();

       this.existingworkouts.forEach(workoutId => {
      this.workoutDropdowns.push(this.createWorkoutDropdown());
      this.workoutDropdowns.at(this.workoutDropdowns.length - 1).get('workout')!.setValue(workoutId);
    });
    

       console.log('Fetched Lesson Plan:', this.lessonPlan);  // Debug log
       console.log('Selected Workouts:', this.selectedWorkouts); // Debug log for selected workouts
      //this.selectedCategory = this.workout.workout_Category_ID;
    });
   
  }

  fetchWorkouts(): void {
    //Call your service method to fetch workouts
    this.workoutService.GetWorkouts().subscribe(result => {
      this.workouts = result;  // Assign workouts fetched from the backend
      console.log('Fetched Workouts:', this.workouts);  // Debug log
    }, (error) => {
      console.error('Error fetching workouts:', error);
    });

}  

  addDropdown(): void {
    // Add a new dropdown (new FormControl) to the FormArray
  const newDropdown = this.createWorkoutDropdown(); 
  this.workoutDropdowns.push(newDropdown); 

  // Add a placeholder null value to selectedWorkouts
  this.selectedWorkouts.push(null); 

  // Subscribe to changes for this specific control
  newDropdown.get('workout')?.valueChanges.subscribe(value => {
    // Update selectedWorkouts array at the index of the new dropdown
    const index = this.workoutDropdowns.length - 1; // Get the index of the current dropdown
    this.selectedWorkouts[index] = value; // Update selected workout for this dropdown
    console.log('Updated selectedWorkouts:', this.selectedWorkouts); // Debug log
});
  }

  removeDropdown(index: number): void {
    this.workoutDropdowns.removeAt(index); // Remove the dropdown at index
   // this.selectedWorkouts[index] = null;
    this.selectedWorkouts.splice(index, 1); // Remove corresponding selected workout
    console.log('After removal', this.selectedWorkouts)
  }

  

  
  onWorkoutChange(index: number, selectedValue: Number | null): void {
    // Update the selectedWorkout at the given index
    this.selectedWorkouts[index] = Number(selectedValue); // Update the selected workout
    
    // Log the updated array
    console.log('SelectedWorkouts Change', this.selectedWorkouts);
    
    // Explicitly set the value of the dropdown for this index
    const workoutDropdown = this.workoutDropdowns.at(index);
    
    // Set the workout value in the form control
    workoutDropdown.get('workout')?.setValue(Number(selectedValue));
    
  
}

  
  isWorkoutDisabled(workoutId: Number, currentDropdownIndex: number): boolean {
    // Disable if the workout is selected in another dropdown, but not in the current one
    return this.selectedWorkouts.some((selected, idx) => selected === workoutId && idx !== currentDropdownIndex);

  }

  // filterAndUpdateLessonPlan(): void {
  //   const validWorkoutIDs = this.selectedWorkouts.filter(id => id !== null) as Number[];
  //   this.updateLessonPlan(validWorkoutIDs);
  // }

  updateLessonPlan() {
    //console.log('Workout Ids', workoutIDs);
     const workoutIDs = this.selectedWorkouts.filter(id => id !== null) as Number[]; // Filter out null values
    // Set updated lesson plan details
    this.updatedLessonPlan.lesson_Plan_ID = this.lessonPlan.lessonPlan_ID;
    this.updatedLessonPlan.program_Name = this.lessonPlan.lessonPlanName;
    this.updatedLessonPlan.program_Description = this.lessonPlan.program_Description;
  
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Lesson Plan?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Proceed with updating the lesson plan if confirmed
        this.lessonPlanService.UpdatePlan(this.updatedLessonPlan, this.updatedLessonPlan.lesson_Plan_ID)
          .subscribe((result: LessonPlan) => {
            console.log('Lesson Plan Updated', result);
  
            // Prepare workout update details
            this.lessonPlanWorkout.workout_ID = workoutIDs;
            this.lessonPlanWorkout.lessonPlanID = this.lessonPlan.lessonPlan_ID;
  
            // Update the associated workouts
            this.lessonPlanWorkoutService.UpdatePlanWorkout(this.lessonPlanWorkout, this.lessonPlanWorkout.lessonPlanID)
              .subscribe((result: LessonPlanWorkout) => {
                // Show success message after successful workout update
                this.dialog.open(SuccessDialogComponent, { data: { message: 'Lesson Plan successfully updated!' } });
                console.log('Lesson Plan Workout Updated', result);
                this.router.navigateByUrl('/lesson-plan');
              });
          }, (error: HttpErrorResponse) => {
            // Handle error
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
            console.log('Error:', error.error);
          });
      }
    });
  
    console.log('Updated Lesson Plan:', this.lessonPlan);
  }
  
}
