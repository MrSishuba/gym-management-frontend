import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthenticationService } from '../Services/authentication.service';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';

declare var $: any; // Declare jQuery

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MasterSideNavBarComponent, SideNavBarComponent, MemberSideNavBarComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  
  userTypeID: number | null = null;
  changePasswordForm: FormGroup;
  userId: number | null;
  helpContent: any[] = [];
  filteredContent: any[] = [];
  searchTerm: string = '';

  constructor( private router: Router, private fb: FormBuilder, private location: Location, private authService: AuthenticationService, private snackBar: MatSnackBar) 
  {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]]
    }, 
    { validators: this.passwordsMatchValidator });

    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    if (this.userId === null) {
      this.router.navigate(['/login']);
    }


   // Initialize help content
   this.helpContent = [
    {
      title: 'Change Password Screen Context-Sensitive Help',
      content: `
        <p><strong>Overview:</strong> The Change Password screen allows users to securely update their password. This screen includes fields for the current password, new password, and confirmation of the new password.</p>
        <p><strong>Elements and Features:</strong></p>`
    },
    {
      title: '1. Back Button',
      content: `
        <ul>
          <li><strong>Description:</strong> An arrow icon located in the header that allows you to return to the previous page.</li>
          <li><strong>Functionality:</strong> Clicking the back button navigates to the previous page you visited.</li>
          <li><strong>Helpful Tips:</strong>
            <ul>
              <li>Use the back button if you want to return to your previous page without losing your current context.</li>
            </ul>
          </li>
        </ul>`
    },
    {
      title: '2. Header Title',
      content: `
        <ul>
          <li><strong>Description:</strong> Displays the title "Change Password" to indicate the purpose of the screen.</li>
          <li><strong>Functionality:</strong> Provides a clear indication of the current screen's functionality.</li>
        </ul>`
    },
    {
      title: '3. Current Password Field',
      content: `
        <ul>
          <li><strong>Description:</strong> A field to enter your current password.</li>
          <li><strong>Functionality:</strong> Ensures that only the authenticated user can change the password.</li>
          <li><strong>Helpful Tips:</strong>
            <ul>
              <li>Make sure you enter your current password correctly before proceeding to change the password.</li>
            </ul>
          </li>
        </ul>`
    },
    {
      title: '4. New Password Field',
      content: `
        <ul>
          <li><strong>Description:</strong> A field to enter your new password.</li>
          <li><strong>Functionality:</strong> Allows you to set a new password following the specified criteria (e.g., minimum length, maximum length).</li>
          <li><strong>Helpful Tips:</strong>
            <ul>
              <li>Choose a strong password that you have not used before.</li>
            </ul>
          </li>
        </ul>`
    },
    {
      title: '5. Confirm New Password Field',
      content: `
        <ul>
          <li><strong>Description:</strong> A field to confirm your new password by entering it again.</li>
          <li><strong>Functionality:</strong> Ensures that the new password is entered correctly by requiring you to type it twice.</li>
          <li><strong>Helpful Tips:</strong>
            <ul>
              <li>Make sure both passwords match before submitting the form.</li>
            </ul>
          </li>
        </ul>`
    },
    {
      title: '6. Submit Button',
      content: `
        <ul>
          <li><strong>Description:</strong> A button to submit the form and change your password.</li>
          <li><strong>Functionality:</strong> Validates the form and sends a request to change your password.</li>
          <li><strong>Helpful Tips:</strong>
            <ul>
              <li>Review all fields carefully before submitting the form.</li>
            </ul>
          </li>
        </ul>`
    },
    {
      title: 'Technical Details:',
      content: `
        <ul>
          <li>Form Validation: The form uses Angular's reactive forms and validators to ensure all fields are filled out correctly.</li>
          <li>Security: The password change request is sent securely to the backend for processing.</li>
          <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
        </ul>`
    },
    {
      title: 'Common Questions:',
      content: `
        <p><strong>Q:</strong> How do I change my password?</p>
        <p><strong>A:</strong> Enter your current password, then enter and confirm your new password, and click the submit button.</p>
        <p><strong>Q:</strong> What should I do if I forgot my current password?</p>
        <p><strong>A:</strong> Use the "Forgot Password" feature to reset your password via email.</p>
        <p><strong>Q:</strong> What should I do if I encounter an error?</p>
        <p><strong>A:</strong> Refresh the page or contact support for assistance.</p>`
    },
    {
      title: 'Troubleshooting:',
      content: `
        <p><strong>Problem:</strong> The form is not submitting.</p>
        <p><strong>Solution:</strong> Ensure all required fields are filled out correctly and that the new password and confirm password fields match.</p>
        <p><strong>Problem:</strong> Unable to change password.</p>
        <p><strong>Solution:</strong> Check your internet connection and ensure you entered the correct current password. If the issue continues, contact support.</p>`
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

  passwordsMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.showErrorModalChangePassword();
      return;
    }
  
    const changePasswordData = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword
    };
  
    // Ensure userId is not null before proceeding
    if (this.userId !== null) {
      this.authService.changePassword(this.userId, changePasswordData).subscribe({
        next: () => {
          console.log('Successfully updated password');
          this.snackBar.open('Successfully updated password.', 'Close', { duration: 3000 });
          this.router.navigateByUrl(`/ProfilePage/${this.userId}`);
        },
        error: () => {
          console.error('Error changing password');
          this.snackBar.open('Error changing password.', 'Close', { duration: 3000 });
          this.showErrorModalChangePassword();
        }
      });
    } else {
      console.error('User ID is null.');
    }
  }
  

  onCancel() {
    this.router.navigateByUrl(`/ProfilePage/${this.userId}`);
  }
  
  goBack(): void {
    this.location.back();
  }

  showErrorModalChangePassword() {
    $('#errorModal').modal('show');
  }

  dismissErrorModalChangePassword() {
    $('#errorModal').modal('hide');
  }
}

