import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../Services/userprofile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  email: string = '';
  showModal: boolean = false;

  toggleModal() {
    this.showModal = !this.showModal;
  }

     // Add the method here
     navigateToLogin() {
      this.router.navigate(['/ForgotPasswordPage']);
    }
  



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const resetPasswordData = {
        email: this.email,
        token: encodeURIComponent(this.token),  // URL encode the token
        password: this.resetPasswordForm.get('password')!.value
      };

      console.log('Reset Password Data:', resetPasswordData);

      this.userService.resetPassword(resetPasswordData).subscribe({
        next: (response) => {
          console.log("Password reset success: ", response)
          this.openSnackbar('Password has been reset successfully.', 'success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log("Password reset fail: ", error)
          this.openSnackbar('Failed to reset password. Please try again.', 'danger');
        }
      });
    }
  }

  openSnackbar(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-danger'
    });
  }
}
