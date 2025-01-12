import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurveyService } from '../Services/survey.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  surveyForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private surveyService: SurveyService,
    private snackBar: MatSnackBar,  // Inject MatSnackBar
    private router: Router           // Inject Router
  ) { }


  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      membershipStatus: ['', Validators.required],
      ageGroup: ['', Validators.required],
      bookingSatisfaction: ['', Validators.required],
      bookingIssues: [''],  // Default value as empty, will be converted to boolean
      bookingIssueDetails: [''],
      purchaseFrequency: ['', Validators.required],
      productSatisfaction: ['', Validators.required],
      newProductInterest: [''],  // Default value as empty, will be converted to boolean
      newProductDetails: [''],
      recommendGym: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      suggestions: [''],
      contactConsent: [false]  // Checkbox (boolean)
    });
  
    // Set validators based on bookingIssues and newProductInterest
    this.surveyForm.get('bookingIssues')?.valueChanges.subscribe(value => {
      if (value === 'Yes') {
        this.surveyForm.get('bookingIssueDetails')?.setValidators(Validators.required);
      } else {
        this.surveyForm.get('bookingIssueDetails')?.clearValidators();
      }
      this.surveyForm.get('bookingIssueDetails')?.updateValueAndValidity();
    });
  
    this.surveyForm.get('newProductInterest')?.valueChanges.subscribe(value => {
      if (value === 'Yes') {
        this.surveyForm.get('newProductDetails')?.setValidators(Validators.required);
      } else {
        this.surveyForm.get('newProductDetails')?.clearValidators();
      }
      this.surveyForm.get('newProductDetails')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.surveyForm.valid) {
      // Get form values
      const formValue = this.surveyForm.value;
  
      // Convert 'Yes'/'No' strings to booleans for backend compatibility
      formValue.bookingIssues = formValue.bookingIssues === 'Yes';
      formValue.newProductInterest = formValue.newProductInterest === 'Yes';
  
      console.log('Submitted Form Data:', formValue);
  
      // Submit the form data to the backend
      this.surveyService.submitSurvey(formValue).subscribe(
        response => {
          console.log('Survey submitted successfully!', response);

          // Show Snackbar for success
          this.snackBar.open('Thank You, your response has been recorded.', 'Close', {
            duration: 3000,  // Display for 3 seconds
          });

          // Redirect to landing page after the snackbar closes
          setTimeout(() => {
            this.router.navigate(['/landing-page']);
          }, 3000);  // 3 seconds delay before redirecting
        },
        error => {
          console.error('Error submitting survey', error);
        }
      );
    }
  }
}
