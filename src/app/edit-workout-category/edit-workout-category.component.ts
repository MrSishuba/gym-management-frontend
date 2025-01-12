import { Component, OnInit } from '@angular/core';
import { WorkoutCategory } from '../shared/workoutCategory';
import { WorkoutCategoryService } from '../Services/workout-category.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, NgForm  } from '@angular/forms';
import { NgFor } from '@angular/common';
import {HttpErrorResponse } from '@angular/common/http';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-workout-category',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-workout-category.component.html',
  styleUrl: './edit-workout-category.component.css'
})
export class EditWorkoutCategoryComponent implements OnInit{

  category: WorkoutCategory = {
    workout_Category_ID: 0,
    workout_Category_Name: '',
    workout_Category_Description: ''
  };
 categoryID!:Number;
 registerFormGroup: FormGroup;
 searchTerm: string = '';
 helpContent: any[] = [];
filteredContent: any[] = [];


constructor(private categoryService: WorkoutCategoryService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog, private fb: FormBuilder) { 
  this.registerFormGroup = this.fb.group({
    name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    
  });
}

    ngOnInit():void{
      
      this.route.params.subscribe(params => {
        this.categoryID = params['workout_Category_ID'];
        this.getCategory(this.categoryID);
      });

             // Initialize help content
this.helpContent = [
  {
    title: 'Edit Workout Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Workout Category page allows you to update an existing workout category by chnaging its name and description.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Category Name Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for entering the changed workout category name.</li>
        <li><strong>Functionality:</strong> This field is required, and it must be between 2 and 20 characters long. Enter a name like "Cardio".</li>
        <li><strong>Error Messages:</strong> If the input is invalid, appropriate error messages will be displayed, indicating if the field is required or if it exceeds the character limits.</li>
      </ul>`
  },
  {
    title: '2. Category Description Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for providing a new description of the workout category.</li>
        <li><strong>Functionality:</strong> This field is required, and it must be between 10 and 100 characters long. Enter a description like "Workouts that get the heart rate up".</li>
        <li><strong>Error Messages:</strong> If the input is invalid, appropriate error messages will be displayed, indicating if the field is required or if it exceeds the character limits.</li>
      </ul>`
  },
  {
    title: '3. Add Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to submit the form and update the workout category details.</li>
        <li><strong>Functionality:</strong> This button will be disabled if the form is invalid (i.e., all required fields are not filled in correctly).</li>
      </ul>`
  },
  {
    title: '4. Cancel Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to cancel the action and navigate back to the Workout Categories page.</li>
        <li><strong>Functionality:</strong> Clicking this button takes you back to the workout categories page without saving any changes.</li>
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
      <p><strong>Problem:</strong> The "Save" button is disabled.</p>
      <p><strong>Solution:</strong> Make sure all required fields are filled out correctly before submitting the form.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];
    }
  
    getCategory(id: Number): void {
      this.categoryService.GetCategory(id).subscribe(result => {
        this.category = result;
        console.log('Category', this.category)
      });
    }

    filterHelpContent(): void {
      const term = this.searchTerm.toLowerCase();
      this.filteredContent = this.helpContent.filter(item =>
        item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
      );
    }

    updateCategory(id: Number) {
      // Open the confirmation dialog first
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
        data: { message: 'Are you sure you want to update this Workout Category?' } 
      });
    
      // Handle the result of the confirmation dialog
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoryService.UpdateCategory(this.category, id).subscribe((result: WorkoutCategory) => {
            this.dialog.open(SuccessDialogComponent, { data: { message: 'Workout Category successfully updated!' } });
            console.log('Category Updated', result);
            this.router.navigateByUrl('/workout-category');
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
