import { Component, OnInit } from '@angular/core';
import { Workout } from '../shared/workout';
import { WorkoutService } from '../Services/workout.service';
import { WorkoutCategoryService } from '../Services/workout-category.service';
import { WorkoutCategory } from '../shared/workoutCategory';
import { WorkoutViewModel } from '../shared/workoutViewModel';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-workout',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './edit-workout.component.html',
  styleUrl: './edit-workout.component.css'
})
export class EditWorkoutComponent {

  workout: Workout ={
    workout_ID:0,
    workout_Name:'',
    workout_Description:'',
    workout_Category_ID:0,
    sets:0,
    reps:0,
    //workout_Category_Name:''
   //workout_Category_ID:0
  }

  workoutId!:Number;
  categories:WorkoutCategory[] = []
  selectedCategory!: Number;
  errorMessage: string = '';
  registerFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];


  constructor(private categoryService:WorkoutCategoryService,private workoutService: WorkoutService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog, private fb: FormBuilder){
    this.registerFormGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
     sets: [null, Validators.required],
     reps: [null, Validators.required],
     category: [null, Validators.required]
    });
  }

    ngOnInit():void{
      this.route.params.subscribe(params => {
        this.workoutId = params['workout_ID'];
        this.getWorkout(this.workoutId);
       
      });

      this.GetCategories();

      this.helpContent = [
        {
          title: 'Edi Workout Overview',
          content: `
            <p><strong>Overview:</strong> The Edit Workout page allows you to update an existing workout by chnaging  the necessary details.</p>
            <p><strong>Elements and Features:</strong></p>`
        },
        {
          title: '1. Workout Name',
          content: `
            <ul>
              <li><strong>Description:</strong> A text input field for entering the name of the workout which is populated with the current name.</li>
              <li><strong>Functionality:</strong> Required field; the name must be between 2 and 20 characters long. You will receive validation messages if the input is invalid.</li>
            </ul>`
        },
        {
          title: '2. Workout Description',
          content: `
            <ul>
              <li><strong>Description:</strong> A text input field for providing a detailed description of the workout which is populated with the current description.</li>
              <li><strong>Functionality:</strong> Required field; the description must be between 10 and 100 characters long. Validation messages will appear for invalid input.</li>
            </ul>`
        },
        {
          title: '3. Sets',
          content: `
            <ul>
              <li><strong>Description:</strong> A number input field for specifying the number of sets which is populated with the current number of sets.</li>
              <li><strong>Functionality:</strong> This field is required, and validation will indicate if the input is missing.</li>
            </ul>`
        },
        {
          title: '4. Reps',
          content: `
            <ul>
              <li><strong>Description:</strong> A number input field for indicating the number of repetitions which is populated with the current repetition.</li>
              <li><strong>Functionality:</strong> This field is required, and validation will indicate if the input is missing.</li>
            </ul>`
        },
        {
          title: '5. Select Category',
          content: `
            <ul>
              <li><strong>Description:</strong> A dropdown list for selecting the category of the workout which is populated with the current category.</li>
              <li><strong>Functionality:</strong> This field is required, and validation will indicate if a category is not selected.</li>
            </ul>`
        },
        {
          title: '6. Add Button',
          content: `
            <ul>
              <li><strong>Description:</strong> A button to submit the form and save the changes workout.</li>
              <li><strong>Functionality:</strong> The button will be disabled if the form is not valid, ensuring all required fields are filled in correctly.</li>
            </ul>`
        },
        {
          title: '7. Cancel Button',
          content: `
            <ul>
              <li><strong>Description:</strong> A button to cancel the updat process and return to the Workouts page.</li>
              <li><strong>Functionality:</strong> Clicking this button navigates you back to the workouts page without saving changes.</li>
            </ul>`
        },
        {
          title: 'Common Questions:',
          content: `
            <p><strong>Q:</strong> What happens if I submit the form with invalid data?</p>
            <p><strong>A:</strong> The form will not be submitted, and validation messages will indicate which fields need correction.</p>`
        },
        {
          title: 'Troubleshooting:',
          content: `
            <p><strong>Problem:</strong> I can't submit the form.</p>
            <p><strong>Solution:</strong> Ensure all required fields are filled in correctly and meet the specified validation criteria.</p>`
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
    getWorkout(id: Number): void {
      this.workoutService.GetWorkout(id).subscribe(result => {
        this.workout = result;

       console.log('Workout:', this.workout)
        this.selectedCategory = this.workout.workout_Category_ID;
      });
      
     
    }


    
GetCategories()
{
  this.categoryService.GetCategories().subscribe(result => {
    let categoryList:any[] = result;
  
    categoryList.forEach((element) => {
      this.categories.push(element)
    });
    
  })
  
}

updateWorkout() {
  // Open the confirmation dialog first
  const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
    data: { message: 'Are you sure you want to update this Workout?' } 
  });

  // Handle the result of the confirmation dialog
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.workoutService.UpdateWorkout(this.workout, this.workout.workout_Category_ID, this.workout.workout_ID).subscribe((result: Workout) => {
        this.dialog.open(SuccessDialogComponent, { data: { message: 'Workout successfully updated!' } });
        console.log('Workout Updated', result);
        this.router.navigateByUrl('/workout');
      }, (error: HttpErrorResponse) => {
        // Handle error
        this.dialog.open(ErrorDialogComponent, { 
          data: { message: error.error || 'An unexpected error occurred Please try again.' } 
        });
        console.log('Error:', error.error);
      });
    }
  });
}



}
