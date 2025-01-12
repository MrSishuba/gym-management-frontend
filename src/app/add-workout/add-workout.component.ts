import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Workout } from '../shared/workout';
import { WorkoutService } from '../Services/workout.service';
import { WorkoutCategoryService } from '../Services/workout-category.service';
import { WorkoutCategory } from '../shared/workoutCategory';
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [RouterLink,FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './add-workout.component.html',
  styleUrl: './add-workout.component.css'
})
export class AddWorkoutComponent implements OnInit {
  Workout_ID!: 0
  Workout_Name!: ''
  Workout_Description!: ''
  Sets!: 0;
  Reps!: 0;
  Workout_Category_ID!: 0;
  Workout_Category!:''
categories:WorkoutCategory[] = []
errorMessage: string = '';
registerFormGroup: FormGroup;
searchTerm: string = '';
helpContent: any[] = [];
filteredContent: any[] = [];


constructor(private workoutService: WorkoutService, private router: Router, private categoryService: WorkoutCategoryService, private dialog:MatDialog, private fb: FormBuilder) { 
  this.registerFormGroup = this.fb.group({
    name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
   sets: [null, Validators.required],
   reps: [null, Validators.required],
   category: [null, Validators.required]
  });
}

ngOnInit(): void {
  this.GetCategories();
  console.log(this.categories);

  // Initialize help content
this.helpContent = [
  {
    title: 'Create Workout Overview',
    content: `
      <p><strong>Overview:</strong> The Create Workout page allows you to add new workouts by filling out the necessary details.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Workout Name',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the name of the workout.</li>
        <li><strong>Functionality:</strong> Required field; the name must be between 2 and 20 characters long. You will receive validation messages if the input is invalid.</li>
      </ul>`
  },
  {
    title: '2. Workout Description',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for providing a detailed description of the workout.</li>
        <li><strong>Functionality:</strong> Required field; the description must be between 10 and 100 characters long. Validation messages will appear for invalid input.</li>
      </ul>`
  },
  {
    title: '3. Sets',
    content: `
      <ul>
        <li><strong>Description:</strong> A number input field for specifying the number of sets.</li>
        <li><strong>Functionality:</strong> This field is required, and validation will indicate if the input is missing.</li>
      </ul>`
  },
  {
    title: '4. Reps',
    content: `
      <ul>
        <li><strong>Description:</strong> A number input field for indicating the number of repetitions.</li>
        <li><strong>Functionality:</strong> This field is required, and validation will indicate if the input is missing.</li>
      </ul>`
  },
  {
    title: '5. Select Category',
    content: `
      <ul>
        <li><strong>Description:</strong> A dropdown list for selecting the category of the workout.</li>
        <li><strong>Functionality:</strong> This field is required, and validation will indicate if a category is not selected.</li>
      </ul>`
  },
  {
    title: '6. Add Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to submit the form and add the workout.</li>
        <li><strong>Functionality:</strong> The button is disabled until the form is valid, ensuring all required fields are filled in correctly.</li>
      </ul>`
  },
  {
    title: '7. Cancel Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to cancel the creation process and return to the Workouts page.</li>
        <li><strong>Functionality:</strong> Clicking this button navigates you back to the previous page without saving changes.</li>
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

GetCategories()
{
  this.categoryService.GetCategories().subscribe(result => {
    let categoryList:any[] = result;
  
    categoryList.forEach((element) => {
      this.categories.push(element)
    });
    
  })

  
}

addWorkout(workout_name:String, workout_description:String, sets:Number, reps:Number, workout_Category_ID:Number){

  const newWorkout:Workout ={
    workout_ID: 0,
    workout_Name: workout_name,
    workout_Description:workout_description,
    sets: sets,
    reps: reps,
    workout_Category_ID: 1,
   // Workout_Category: ''
  };

  console.log('New Workout',newWorkout)

  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Are you sure you want to add this Workout?' } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.workoutService.AddWorkout(newWorkout).subscribe((result:Workout)=>{
        this.router.navigateByUrl('/workout');
        this.dialog.open(SuccessDialogComponent, {data:{message:'Workout Successfully added!'}});
      });
      }
   
    console.log('Workout Added', result)
   
  },(error: HttpErrorResponse) => {
    // Handle error
    this.dialog.open(ErrorDialogComponent, { 
      data: { message: error.error || 'An unexpected error occurred Please try again.' } 
    });
    console.log('Error:', error.error)
   
  });

}

}
