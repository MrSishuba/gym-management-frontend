import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Validator to check if the date is today
export function todayDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return control.value === today ? null : { 'notToday': { value: control.value } };
  };
}

// Validator to ensure a date is the current date
export function currentDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return control.value === today ? null : { 'notCurrentDate': { value: control.value } };
  };
}

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, SideNavBarComponent, MasterSideNavBarComponent, ContractDropdownNavComponent],
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css']
})
export class CreateContractComponent {
  showRetrieveContractModal = false;
  contractForm: FormGroup;
  userTypeID: number | null = null;
  modalMemberId: string = '';  // Holds the Member ID entered in the modal
  retrievedFilePath: string = ''; // Holds the retrieved file path
  showHelpModal: boolean = false;
  members: any[] = [];
  filteredMembers: any[] = [];
  selectedMemberId: string = ''; // Holds the selected Member ID from the dropdown

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private contractManagerService: ContractManagerService,
    private http: HttpClient
  ) {
    this.contractForm = this.fb.group({
      Subscription_Date: ['', [Validators.required, todayDateValidator()]],
      Expiry_Date: ['', Validators.required],
      Approval_Date: ['', [Validators.required, currentDateValidator()]],
      Approval_By: ['', Validators.required],
      Filepath: ['', Validators.required], // File input field initialized with null
      Contract_Type_ID: ['', Validators.required],
      Payment_Type_ID: [3],
      Member_ID: ['', Validators.required],
      Employee_ID: ['', Validators.required],
      Owner_ID: ['1'], // Default value if not provided
      Terms_Of_Agreement: [false], // Default value set to true
      Approval_Status: [false] // Default value set to true
    });
  }
  ngOnInit(): void {
    this.setMinMaxDates(); // Set the min and max dates to today
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.contractManagerService.getMembersWithUploadedContractsButNoContractRecord().subscribe((data: any[]) => {
      this.members = data;
      this.filteredMembers = data;
    });

    // Disable the File and Member_ID fields
    this.contractForm.get('Filepath')!.disable();
    this.contractForm.get('Member_ID')!.disable();

    // Listen for changes in Contract_Type_ID and Subscription_Date
    this.contractForm.get('Contract_Type_ID')?.valueChanges.subscribe(() => this.updateExpiryDate());
    this.contractForm.get('Subscription_Date')?.valueChanges.subscribe(() => this.updateExpiryDate());

    // Populate employee details on initialization
    this.populateEmployeeDetails();

  }

  setMinMaxDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.querySelector('input[formControlName="Subscription_Date"]') as HTMLInputElement;
    
    if (dateInput) {
      dateInput.min = today; // Set the minimum date to today
      dateInput.max = today; // Set the maximum date to today
    }
  }

  // Method to update Expiry_Date based on Subscription_Date and Contract_Type_ID
  updateExpiryDate(): void {
    const subscriptionDate = this.contractForm.get('Subscription_Date')?.value;
    const contractTypeId = this.contractForm.get('Contract_Type_ID')?.value;

    if (subscriptionDate && contractTypeId) {
      const date = new Date(subscriptionDate);
      switch (contractTypeId) {
        case '1': // 3-Month contract
          date.setMonth(date.getMonth() + 3);
          break;
        case '2': // 6-Month contract
          date.setMonth(date.getMonth() + 6);
          break;
        case '3': // 12-Month contract
          date.setMonth(date.getMonth() + 12);
          break;
      }
      const expiryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      this.contractForm.get('Expiry_Date')?.setValue(expiryDate);

      // Automatically update the Approval_Date to match the Subscription_Date
      this.contractForm.get('Approval_Date')?.setValue(subscriptionDate);
    }
  }

  // Populate Approval_By and Employee_ID fields based on the logged-in user
  populateEmployeeDetails(): void {
    // Retrieve and parse user data from local storage
    const userData = JSON.parse(localStorage.getItem('User') || '{}');
    const userId = userData.userId;

    console.log('Retrieved userId:', userId); // Debugging line

    if (userId) {
      this.http.get<any>(`https://localhost:7185/api/User/GetEmployeeFullNameAndId?userId=${userId}`).subscribe(
        (result) => {
          console.log('API Response:', result); // Debugging line
          this.contractForm.patchValue({
            Approval_By: result.fullName,
            Employee_ID: result.employee_ID
          });
        },
        (error) => {
          this.snackBar.open('Failed to load employee details', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      console.warn('UserId is null or undefined'); // Warning if userId is missing
    }
  }


  getSignedContract(): void {
    this.openRetrieveContractModal();
  }

  openRetrieveContractModal(): void {
    this.showRetrieveContractModal = true;
    // Clear the Member_ID field if necessary
    this.contractForm.get('Member_ID')?.setValue('');
  }

  openHelpModal() {
  this.showHelpModal = true;
}

closeHelpModal() {
  this.showHelpModal = false;
} 

  closeRetrieveContractModal(): void {
    this.showRetrieveContractModal = false;
  }

  retrieveSignedContract() {
  const memberId = parseInt(this.selectedMemberId, 10); // Convert modalMemberId to a number

  if (!isNaN(memberId)) {  // Check if memberId is a valid number
    this.contractManagerService.retrieveSignedContract(memberId).subscribe(
      response => {
        // Store the retrieved file path
        this.retrievedFilePath = response.filePath;

        // Patch the retrieved file path to the form
        this.contractForm.patchValue({ Filepath: this.retrievedFilePath });

        // Set the Member ID in the form
        this.contractForm.patchValue({
          Member_ID: memberId
        });

        this.showRetrieveContractModal = false;  // Close the modal after retrieving the contract
        
        // Show success snackbar
        this.snackBar.open('Member contract successfully retrieved.', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error retrieving signed contract:', error);
        this.snackBar.open('Failed to retrieve signed contract.', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('Please select a valid Member ID.', 'Close', { duration: 3000 });
  }
}


  createContract() {
    if (this.contractForm.invalid) {
      console.error('Form is invalid.');
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    // Log each field value
    console.log('Subscription_Date:', this.contractForm.get('Subscription_Date')!.value);
    console.log('Expiry_Date:', this.contractForm.get('Expiry_Date')!.value);
    console.log('Approval_Date:', this.contractForm.get('Approval_Date')!.value);
    console.log('Approval_By:', this.contractForm.get('Approval_By')!.value);
    console.log('Contract_Type_ID:', this.contractForm.get('Contract_Type_ID')!.value);
    console.log('Payment_Type_ID:', this.contractForm.get('Payment_Type_ID')!.value);
    console.log('Member_ID:', this.contractForm.get('Member_ID')!.value);
    console.log('Employee_ID:', this.contractForm.get('Employee_ID')!.value);
    console.log('Owner_ID:', this.contractForm.get('Owner_ID')!.value);
    console.log('Filepath:', this.contractForm.get('Filepath')!.value);

    const formData = new FormData();
    formData.append('Subscription_Date', this.contractForm.get('Subscription_Date')!.value);
    formData.append('Expiry_Date', this.contractForm.get('Expiry_Date')!.value);
    formData.append('Approval_Date', this.contractForm.get('Approval_Date')!.value);
    formData.append('Approval_By', this.contractForm.get('Approval_By')!.value);
    formData.append('Contract_Type_ID', this.contractForm.get('Contract_Type_ID')!.value);
    formData.append('Payment_Type_ID', this.contractForm.get('Payment_Type_ID')!.value);
    formData.append('Member_ID', this.contractForm.get('Member_ID')!.value);
    formData.append('Employee_ID', this.contractForm.get('Employee_ID')!.value);
    formData.append('Owner_ID', this.contractForm.get('Owner_ID')!.value);
    formData.append('Terms_Of_Agreement', this.contractForm.get('Terms_Of_Agreement')!.value);
    formData.append('Approval_Status', this.contractForm.get('Approval_Status')!.value);
    formData.append('Filepath', this.contractForm.get('Filepath')!.value);

    // Log FormData entries
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.contractManagerService.createContract(formData).subscribe(
      response => {
        console.log('Contract created successfully:', response);
        this.snackBar.open('Contract created & activated successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/all-signed-contracts']);
      },
      error => {
        console.error('Error creating contract:', error);
        this.snackBar.open('Failed to create contract.', 'Close', { duration: 3000 });
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/all-signed-contracts']);
  }
}
