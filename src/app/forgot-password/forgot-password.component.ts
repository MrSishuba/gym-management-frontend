import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // Assuming you still want to use this for notifications
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../Services/userprofile.service';

declare var $: any; // Ensure jQuery is declared

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {     
    // Bind custom email validator along with the built-in Validators.email
  this.forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]]
  });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za', '@tuks.co.za'
  ];
  
  validateEmail(control: any): { [key: string]: any } | null {
    const email = control.value ? control.value.toLowerCase() : '';
    
    if (!email || !email.includes('@')) {
      return { 'invalidEmail': true };
    }
  
    const domain = email.substring(email.lastIndexOf('@'));
    if (!this.allowedEmailDomains.includes(domain)) {
      return { 'invalidDomain': true };
    }
  
    return null;
  }
  


   // Add the method here
   navigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() { }

  onSubmit() {
    const emailControl = this.forgotPasswordForm.get('email');
    
    // Check if the email field is empty
    if (emailControl?.hasError('required')) {
      this.openSnackbar('Please enter an email address', 'danger');
      return; // Exit the method if email is missing
    }
  
    // Check if the email is invalid (either due to format or domain)
    if (emailControl?.invalid) {
      this.openSnackbar('Invalid email, please enter a valid input', 'danger');
      return; // Exit the method if email is invalid
    }
  
    // If the form is valid, proceed with the API call
    this.userService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (response) => {
        console.log("Forgot password success: ", response);
        this.openSnackbar('Password reset email sent.', 'success');
      },
      error: (error) => {
        console.log("Forgot password fail: ", error);
        this.openSnackbar('Failed to send password reset email. Please try again.', 'danger');
      }
    });
  }
  
  
  // Snackbar method for displaying messages
  openSnackbar(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-danger'
    });
  }
}
