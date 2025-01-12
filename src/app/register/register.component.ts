import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../Services/userprofile.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FlexLayoutModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  submitted = false;
  registerFormGroup: FormGroup;
  selectedFile: File | null = null;

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za', '@tuks.co.za'
  ];

  private allowedImageFormats = ['jpg', 'jpeg', 'png'];

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.registerFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      PhoneNumber: ['', [
        Validators.required, 
        Validators.pattern('^(06|07|08)\\d{8}$') // Updated pattern
      ]],
      Date_of_Birth: ['', [Validators.required, this.validateDateOfBirth]],
      Id_Number: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      Physical_Address: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      Photo: [null, Validators.required],
      User_Status_ID: [2, Validators.required],
      User_Type_ID: [3, Validators.required], // Defaulting to Member (ID = 1)
      Membership_Status_ID: [2, Validators.required] // Adding Membership_Status_ID field
    });
  }

  ngOnInit() { }

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
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedImageFormats.includes(fileExtension || '')) {
        this.registerFormGroup.controls['Photo'].setErrors({ 'invalidFileType': true });
        this.openSnackbar('Invalid file type. Only JPG, JPEG, and PNG are allowed.', 'danger');
        this.selectedFile = null;
        // Reset the file input
        (event.target as HTMLInputElement).value = ''; 
      } else {
        this.selectedFile = file;
        this.registerFormGroup.patchValue({ Photo: file });
      }
    } else {
      this.selectedFile = null;
    }
  }
  

  RegisterMember() {
    this.submitted = true;
  
    if (this.registerFormGroup.valid && this.selectedFile) {
      console.log('Form is valid');
      console.log('Selected file:', this.selectedFile);
  
      const emailLowerCase = this.registerFormGroup.value.email.toLowerCase();
      this.registerFormGroup.patchValue({ email: emailLowerCase });
  
      const formData: FormData = new FormData();
      formData.append('name', this.registerFormGroup.value.name);
      formData.append('surname', this.registerFormGroup.value.surname);
      formData.append('email', this.registerFormGroup.value.email);
      formData.append('password', this.registerFormGroup.value.password);
      formData.append('PhoneNumber', this.registerFormGroup.value.PhoneNumber);
      formData.append('Date_of_Birth', this.registerFormGroup.value.Date_of_Birth);
      formData.append('Id_Number', this.registerFormGroup.value.Id_Number);
      formData.append('Physical_Address', this.registerFormGroup.value.Physical_Address);
      formData.append('Photo', this.selectedFile, this.selectedFile.name);
      formData.append('User_Status_ID', this.registerFormGroup.value.User_Status_ID);
      formData.append('User_Type_ID', this.registerFormGroup.value.User_Type_ID);
      formData.append('Membership_Status_ID', this.registerFormGroup.value.Membership_Status_ID);
  
      this.userService.RegisterMember(formData).subscribe({
        next: (response) => {
          console.log('Registration Success:', response);
          this.registerFormGroup.reset();
          this.openSnackbar('Your member profile has been created', 'success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Registration Error:', error);
          let errorMessage = 'Registration failed: ';
  
          if (error.error === 'DuplicateEmail') {
            errorMessage += 'This email address is already registered.';
          } else if (error.error === 'DuplicatePhoneNumber') {
            errorMessage += 'This phone number is already registered.';
          } else if (error.error === 'DuplicateDateOfBirth') {
            errorMessage += 'This date of birth is already registered.';
          } else if (error.error === 'DuplicateIdNumber') {
            errorMessage += 'This ID number is already registered.';
          } else if (error.error === 'DuplicatePhoto') {
            errorMessage += 'This photo is already associated with another user.';
          } else {
            errorMessage += 'Unknown error. Please try again later.';
          }
  
          this.openSnackbar(errorMessage, 'danger');
        }
      });
    } else {
      console.log('Form is not valid or file is not selected');
      console.log(this.registerFormGroup.errors);
      console.log(this.registerFormGroup.controls);
  
      // Specific validation error messages
      for (const control in this.registerFormGroup.controls) {
        if (this.registerFormGroup.controls[control].invalid) {
          let fieldName = '';
  
          switch (control) {
            case 'name': fieldName = 'Name'; break;
            case 'surname': fieldName = 'Surname'; break;
            case 'email': fieldName = 'Email'; break;
            case 'password': fieldName = 'Password'; break;
            case 'PhoneNumber': fieldName = 'Phone Number'; break;
            case 'Date_of_Birth': fieldName = 'Date of Birth'; break;
            case 'Id_Number': fieldName = 'ID Number'; break;
            case 'Physical_Address': fieldName = 'Physical Address'; break;
            case 'Photo': fieldName = 'Photo'; break;
            default: fieldName = control;
          }
  
          this.openSnackbar(`Form field ${fieldName} is not filled in correctly. Please provide a valid input.`, 'danger');
          break;  // Only show one error at a time
        }
      }
  
      if (!this.selectedFile) {
        this.openSnackbar('Please select a valid photo.', 'danger');
      }
    }
  }
  
  

  openSnackbar(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-danger'
    });
  }

  get f() {
    return this.registerFormGroup.controls;
  }

  resetForm() {
    this.registerFormGroup.reset({
      User_Status_ID: 2,  // Reset User_Status_ID to default value of 1 (Active)
      Membership_Status_ID: 2,
      User_Type_ID: 3
        // Reset Membership_Status_ID if needed
    });
    this.router.navigate(['/login']);
  }
}
