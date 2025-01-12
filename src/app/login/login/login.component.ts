import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Services/userprofile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    HttpClientModule,
    FlexLayoutModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormGroup: FormGroup;
  isLoading: boolean = false;


  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { 
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],  // Password validatio
    });
  }

    // Allowed email domains
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

  
  goBack(): void {
    this.router.navigate(['/landing-page']);
  }

  ngOnInit() {}

  
  async LoginUser() {
    if (this.loginFormGroup.valid) {
      this.isLoading = true;
  
      this.userService.LoginUser(this.loginFormGroup.value).subscribe({
        next: (result: any) => {
          if (result && result.token) {
            localStorage.setItem('User', JSON.stringify(result));
            localStorage.setItem('token', result.token);
  
            // Decode the JWT token to extract user information
            const decodedToken: any = jwtDecode(result.token);
            console.log('Decoded Token:', decodedToken);
  
            const userId = decodedToken.userId;
            const userTypeID = decodedToken.User_Type_ID;
            console.log('User Type ID:', userTypeID);
  
            this.loginFormGroup.reset();
  
            // Navigate based on user type
            if (userTypeID === "1") {
              this.router.navigateByUrl(`/OwnerHome/${userId}`);
            } else if (userTypeID === "2") {
              this.router.navigateByUrl(`/EmployeeHome/${userId}`);
            } else if (userTypeID === "3") {
              this.router.navigateByUrl(`/Home/${userId}`);
            } else {
              this.snackBar.open('Error: Invalid user type. Please register as an authorized user.', 'Close', { duration: 5000 });
            }
          } else {
            this.snackBar.open('Login failed. Please enter a valid Username and Password.', 'Close', { duration: 5000 });
          }
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Login failed. Please enter a valid Username and Password.', 'Close', { duration: 5000 });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Check for individual validation errors
      const emailErrors = this.loginFormGroup.get('email')?.errors;
      const passwordErrors = this.loginFormGroup.get('password')?.errors;
  
      if (emailErrors && passwordErrors) {
        this.snackBar.open('Please enter Username and Password.', 'Close', { duration: 5000 });
      } else if (emailErrors) {
        if (emailErrors['required']) {
          this.snackBar.open('Please enter Username.', 'Close', { duration: 5000 });
        } else if (emailErrors['email'] || emailErrors['invalidDomain']) {
          this.snackBar.open('Login failed. Please enter a valid Username.', 'Close', { duration: 5000 });
        }
      } else if (passwordErrors) {
        if (passwordErrors['required']) {
          this.snackBar.open('Please enter Password.', 'Close', { duration: 5000 });
        }
      }
    }
  }
}