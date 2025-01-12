import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-upload-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, SideNavBarComponent, MasterSideNavBarComponent, ContractDropdownNavComponent],
  templateUrl: './upload-contract.component.html',
  styleUrls: ['./upload-contract.component.css']
})
export class UploadContractComponent {
  uploadForm: FormGroup;
  selectedSignedContract: File | null = null;
  selectedConsentForm: File | null = null;
  showHelpModal = false; // Controls modal visibility
  userTypeID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private contractManagerService: ContractManagerService
  ) {
    this.uploadForm = this.fb.group({
      memberName: ['', Validators.required],
      signedContract: [null, Validators.required],
      consentForm: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  goBack() {
    this.router.navigate(['/all-signed-contracts']);
  }

  openHelpModal() {
    this.showHelpModal = true;
  }

  closeHelpModal() {
    this.showHelpModal = false;
  }

  onSignedContractSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (file && file.name.endsWith('.pdf')) {
      this.selectedSignedContract = file;
      this.uploadForm.patchValue({ signedContract: file });
      console.log('Selected signed contract for upload:', file);
    } else {
      this.selectedSignedContract = null;
      this.uploadForm.patchValue({ signedContract: null });
      this.snackBar.open('Only PDF files are allowed. Please select a valid PDF document.', 'Close', {
        duration: 3000
      });
      
      // Reset the file input field
      fileInput.value = '';
    }
  }

  onConsentFormSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (file && file.name.endsWith('.pdf')) {
      this.selectedConsentForm = file;
      this.uploadForm.patchValue({ consentForm: file });
      console.log('Selected consent form for upload:', file);
    } else {
      this.selectedConsentForm = null;
      this.uploadForm.patchValue({ consentForm: null });
      this.snackBar.open('Only PDF files are allowed. Please select a valid PDF document.', 'Close', {
        duration: 3000
      });
      
      // Reset the file input field
      fileInput.value = '';
    }
  }

  uploadContract() {
    if (this.uploadForm.invalid) {
        console.log('Form is invalid:', this.uploadForm.errors);
        return;
    }

    const formData = new FormData();
    formData.append('Member_Name', this.uploadForm.get('memberName')?.value);
    
    if (this.selectedSignedContract) {
        formData.append('File', this.selectedSignedContract); // Matches the expected key on the backend
    } else {
        console.log('No signed contract selected');
    }

    if (this.selectedConsentForm) {
        formData.append('ConsentFormFile', this.selectedConsentForm); // Matches the expected key on the backend
    } else {
        console.log('No consent form selected');
    }

    console.log('Form data to be submitted:', {
        memberName: this.uploadForm.get('memberName')?.value,
        signedContract: this.selectedSignedContract,
        consentForm: this.selectedConsentForm
    });

    this.contractManagerService.uploadSignedContract(formData).subscribe(
        response => {
            console.log('Upload successful:', response);
            this.snackBar.open('Signed contract and consent form uploaded successfully.', 'Close', {
                duration: 3000
            });
            this.uploadForm.reset();
            this.selectedSignedContract = null;
            this.selectedConsentForm = null;
            this.router.navigate(['/create-contract']); // Navigate to create-contract route
        },
        error => {
            console.error('Error uploading files:', error);
            this.snackBar.open('Failed to upload signed contract and consent form. Please ensure all fields are filled correctly.', 'Close', {
                duration: 3000
            });
        }
    );
}

  
}
