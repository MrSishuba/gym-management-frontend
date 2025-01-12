import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-activate-free-trial',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SideNavBarComponent,MasterSideNavBarComponent],
  templateUrl: './activate-free-trial.component.html',
  styleUrls: ['./activate-free-trial.component.css']
})
export class ActivateFreeTrialComponent {
  freeTrialForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  userTypeID: number | null = null;
  showTrialModal = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private snackBar: MatSnackBar, 
    private router: Router
  ) {
    this.freeTrialForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      iD_Number: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      trialCode: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]]
    });
  }

  ngOnInit() {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  // Navigation for the back arrow
  navigateBack() {
    this.router.navigate(['/guest-manager']);
  }

  // Toggle the modal visibility
  toggleTrialModal() {
    this.showTrialModal = !this.showTrialModal;
  }

  openSnackBar(message: string, action: string, duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'bottom',  // Bottom
      horizontalPosition: 'center', // Center
    });
  }

  onSubmit() {
    if (this.freeTrialForm.invalid) {
      this.checkInvalidFields(); // Show invalid fields
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    // Convert ID_Number to a string before sending
    const guestSignUp = {
      ...this.freeTrialForm.value,
      iD_Number: this.freeTrialForm.value.iD_Number.toString()
    };
  
    this.http.post('https://localhost:7185/api/FreeTrial/ActivateGuestFreeTrial', guestSignUp)
      .pipe(
        catchError((error) => {
          this.isSubmitting = false; // Stop submitting
  
          // Check if the error object has a specific error message
          if (error && error.error && error.error.error) {
            // Show the specific error from the server
            this.openSnackBar(error.error.error, 'Close');
          } else {
            // Fallback to a generic error message
            this.openSnackBar('An error occurred. Please try again later.', 'Close');
          }
  
          return throwError(error); // Rethrow the error for further handling if needed
        })
      )
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false; // Stop submitting
          this.successMessage = 'Free trial activated successfully.';
  
          // Show success message in snackbar
          this.openSnackBar(this.successMessage, 'Close');
  
          // Redirect after success
          this.router.navigate(['/issued-free-trials']);
        }
      });
  }
  

  checkInvalidFields() {
    if (this.freeTrialForm.controls['name'].invalid) {
      this.openSnackBar('Provide a valid input for Name', 'Close');
    }
    if (this.freeTrialForm.controls['surname'].invalid) {
      this.openSnackBar('Provide a valid input for Surname', 'Close');
    }
    if (this.freeTrialForm.controls['email'].invalid) {
      this.openSnackBar('Provide a valid email address', 'Close');
    }
    if (this.freeTrialForm.controls['iD_Number'].invalid) {
      this.openSnackBar('Provide a valid 13-digit ID Number', 'Close');
    }
    if (this.freeTrialForm.controls['trialCode'].invalid) {
      if (this.freeTrialForm.controls['trialCode'].hasError('minlength') || this.freeTrialForm.controls['trialCode'].hasError('maxlength')) {
        this.openSnackBar('Trial code must be exactly 12 characters long', 'Close');
      } else {
        this.openSnackBar('Trial code is required', 'Close');
      }
    }
  }
}