import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { WorkoutCategory } from '../shared/workoutCategory';
import { WorkoutCategoryService } from '../Services/workout-category.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-workout-category',
  standalone: true,
  imports: [RouterLink, FormsModule,ReactiveFormsModule, CommonModule],
  templateUrl: './add-workout-category.component.html',
  styleUrl: './add-workout-category.component.css'
})
export class AddWorkoutCategoryComponent implements OnInit {
  categoryName: string = '';
  categoryDescription: string = '';
  addForm!: FormGroup;
  registerFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];


  constructor(private categoryService: WorkoutCategoryService, private router: Router, private dialog:MatDialog, private fb: FormBuilder) {
    
    this.registerFormGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      
    });
   }

   ngOnInit(): void {
       // Initialize help content
this.helpContent = [
  {
    title: 'Create Workout Category Overview',
    content: `
      <p><strong>Overview:</strong> The Create Workout Category page allows you to create a new workout category by entering its name and description.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Category Name Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the workout category name.</li>
        <li><strong>Functionality:</strong> This field is required, and it must be between 2 and 20 characters long. Enter a name like "Cardio".</li>
        <li><strong>Error Messages:</strong> If the input is invalid, appropriate error messages will be displayed, indicating if the field is required or if it exceeds the character limits.</li>
      </ul>`
  },
  {
    title: '2. Category Description Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for providing a description of the workout category.</li>
        <li><strong>Functionality:</strong> This field is required, and it must be between 10 and 100 characters long. Enter a description like "Workouts that get the heart rate up".</li>
        <li><strong>Error Messages:</strong> If the input is invalid, appropriate error messages will be displayed, indicating if the field is required or if it exceeds the character limits.</li>
      </ul>`
  },
  {
    title: '3. Add Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to submit the form and create the new workout category.</li>
        <li><strong>Functionality:</strong> This button is disabled until the form is valid (i.e., all required fields are filled in correctly).</li>
      </ul>`
  },
  {
    title: '4. Cancel Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to cancel the action and navigate back to the Workout Categories page.</li>
        <li><strong>Functionality:</strong> Clicking this button takes you back to theworkout categories without saving any changes.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What should I do if I see error messages?</p>
      <p><strong>A:</strong> Ensure that the Category Name and Description fields are filled out correctly according to the character limits.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Add" button is disabled.</p>
      <p><strong>Solution:</strong> Make sure all required fields are filled out correctly before submitting the form.</p>`
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

  addCategory(categoryName:String, categoryDescription:String){
    const newCatgeory: WorkoutCategory = {
      workout_Category_ID: 0,
      workout_Category_Name: categoryName,
      workout_Category_Description: categoryDescription
    };

   
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Are you sure you want to add this Workout Category?' } });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.categoryService.AddCategory(newCatgeory).subscribe((result:WorkoutCategory)=>{
          this.router.navigateByUrl('/workout-category')
          this.dialog.open(SuccessDialogComponent,{data: { message: 'Workout Category successfully added!' }});
        });
        }
     
      console.log('Catgeory Added', result)
     
    } ,(error: HttpErrorResponse) => {
      this.dialog.open(ErrorDialogComponent, { 
        data: { message: error.error || 'An unexpected error occurred Please try again.' } 
      });
      //alert(error.error)
      console.log('Error:', error.error)
  });
  }

  
}
