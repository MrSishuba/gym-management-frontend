import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../Services/userprofile.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FlexLayoutModule, MasterSideNavBarComponent],
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css'
})
export class RegisterEmployeeComponent implements OnInit {
  userTypeID: number | null = null;
  registerForm: FormGroup;
  selectedFile: File | null = null;

  private allowedImageFormats = ['jpg', 'jpeg', 'png'];

  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za'
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      Surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      Email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]],
      Physical_Address: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^(06|07|08)\\d{8}$')]],
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      Id_Number: ['', [Validators.required, Validators.pattern('^\\d{13}$')]],
      Date_of_Birth: ['', [Validators.required, this.validateDateOfBirth]],
      User_Status_ID: [1, Validators.required],
      User_Type_ID: [2, Validators.required],
      Employment_Date: [new Date(), Validators.required],
      Hours_Worked: [0, Validators.required],
      Employee_Type_ID: [1, Validators.required],
      Shift_ID: [null]
    });    
  }

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

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);
  }

  validateDateOfBirth(control: any): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
    const maxDate = new Date(currentDate.getFullYear() - 16, currentDate.getMonth(), currentDate.getDate());
  
    if (selectedDate > currentDate) {
      return { 'futureDate': true };
    }
  
    if (selectedDate < minDate) {
      return { 'olderThan100': true };
    }
  
    if (selectedDate > maxDate) {
      return { 'futureYear': true };
    }
  
    return null;
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedImageFormats.includes(fileExtension || '')) {
        this.snackBar.open('Invalid file type. Only JPG, JPEG, and PNG are allowed.', 'Close', { duration: 3000 });
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
        this.registerForm.patchValue({ Photo: file });
      }
    } else {
      this.selectedFile = null;
    }
  }

  RegisterEmployee() {
    if (this.registerForm.invalid) {
      return;
    }

    if (!this.selectedFile) {
      this.snackBar.open('Photo is required', 'Close', { duration: 3000 });
      return;
    }

    const formValues = this.registerForm.value;
    formValues.Date_of_Birth = new Date(formValues.Date_of_Birth).toISOString();

    this.userService.registerEmployee(this.registerForm.value, this.selectedFile).subscribe({
      next: (response) => {
        console.log('Registration Success:', response);
        this.snackBar.open('Employee registered successfully', 'Close', { duration: 3000 });
        this.registerForm.reset();
        this.selectedFile = null;
        this.router.navigate(['/employee-manager']);
      },
      error: (error) => {
        console.log('Registration Error:', error);
        this.snackBar.open('Failed to register employee', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(){    
    this.router.navigate(['/employee-manager']);
  }
}
