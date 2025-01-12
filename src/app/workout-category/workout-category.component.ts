import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkoutCategoryService} from '../Services/workout-category.service';
import { WorkoutCategory } from '../shared/workoutCategory';
import { NgFor, NgIf } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-workout-category',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './workout-category.component.html',
  styleUrl: './workout-category.component.css'
})
export class WorkoutCategoryComponent implements OnInit{

  categories:WorkoutCategory[]=[];
  showModal: boolean = false;
  category: WorkoutCategory={
    workout_Category_ID:0,
    workout_Category_Name:'',
    workout_Category_Description:''
  }
  filteredCategories: WorkoutCategory[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor (private categoryService:WorkoutCategoryService, private elementRef: ElementRef, private dialog:MatDialog){}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.GetCategories();
    console.log(this.categories);

    // Initialize help content
this.helpContent = [
  {
    title: 'Workout Categories Overview',
    content: `
      <p><strong>Overview:</strong> The Workout Categories page allows you to view, search, and manage workout categories.</p>
      <p><strong>Elements and Features:</strong></p>`
  },
  {
    title: '1. Header Search Container',
    content: `
      <ul>
        <li><strong>Description:</strong> Contains the back button and the title of the page.</li>
        <li><strong>Functionality:</strong> The back button navigates you to the previous page (Workout page), while the title indicates that you are on the Workout Categories page.</li>
      </ul>`
  },
  {
    title: '2. Search Input',
    content: `
      <ul>
        <li><strong>Description:</strong> A text input field for searching workout categories.</li>
        <li><strong>Functionality:</strong> Entering a search term filters the displayed workout categories based on the input.</li>
      </ul>`
  },
  {
    title: '3. Create Workout Category Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button that redirects you to the page for creating a new workout category.</li>
        <li><strong>Functionality:</strong> Clicking this button navigates you to the 'Add Workout Category' page to create a new category.</li>
      </ul>`
  },
  {
    title: '4. Workout Categories Table',
    content: `
      <ul>
        <li><strong>Description:</strong> Displays a list of workout categories with their names, descriptions, and action buttons.</li>
        <li><strong>Functionality:</strong> Each row contains options to view, edit, or delete the category.</li>
      </ul>`
  },
  {
    title: '5. View Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button that allows you to view detailed information about a specific workout category.</li>
        <li><strong>Functionality:</strong> Clicking this button opens a modal displaying the category's name and description.</li>
      </ul>`
  },
  {
    title: '6. Edit Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to edit the selected workout category.</li>
        <li><strong>Functionality:</strong> Clicking this button navigates you to the 'Edit Workout Category' page.</li>
      </ul>`
  },
  {
    title: '7. Delete Button',
    content: `
      <ul>
        <li><strong>Description:</strong> A button to delete a workout category.</li>
        <li><strong>Functionality:</strong> Clicking this button prompts a deletion confirmation and, upon confirmation, removes the category.</li>
      </ul>`
  },
  {
    title: '8. Modal Container',
    content: `
      <ul>
        <li><strong>Description:</strong> A modal that displays detailed information about the selected workout category.</li>
        <li><strong>Functionality:</strong> The modal shows the category name and description, and includes a close button to dismiss it.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I add a new workout category?</p>
      <p><strong>A:</strong> Click on the "Create Workout Category" button to navigate to the form for adding a new category.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> I can't see the workout categories.</p>
      <p><strong>Solution:</strong> Ensure that there are workout categories available. If not, create a new category first.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }


  viewWorkoutCategory(id:Number){
    this.categoryService.GetCategory(id).subscribe(result => {
     
      this.category = result;
      
     this.open();
      console.log('Category',this.category)
     })
  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }

  filterWorkout(): void {
    if (!this.searchTerm) {
      this.filteredCategories = this.categories;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCategories = this.filteredCategories.filter(category =>
        category.workout_Category_Name.toLowerCase().includes(term) ||
        category.workout_Category_ID.toString().includes(term) 
      );
    }
  }
  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.workcat-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.workcat-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }
  GetCategories()
  {
    this.categoryService.GetCategories().subscribe(result => {
      let categoryList:any[] = result;
    
      categoryList.forEach((element) => {
        this.categories.push(element);
        this.filteredCategories.push(element);
      });
      
    })

    
  }

  deleteWorkoutCategory(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Workout Category?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.categoryService.DeleteCategory(id).subscribe((result: WorkoutCategory) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Workout Category successfully deleted!' } });
          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Category deleted!', result);

        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
         // alert(error.error);
        });
      }
    });
  }
  

}
