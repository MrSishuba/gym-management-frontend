import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-contract-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule,SideNavBarComponent,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './contract-manager.component.html',
  styleUrls: ['./contract-manager.component.css']
})
export class ContractManagerComponent implements OnInit {
  uploadForm: FormGroup;
  contractForm: FormGroup;
  approveForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileForContract: File | null = null;
  userTypeID: number | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private contractManagerService: ContractManagerService
  ) {
    this.uploadForm = this.fb.group({
      memberName: ['', Validators.required],
      file: ['', Validators.required]
    });

    this.contractForm = this.fb.group({
      Subscription_Date: ['', Validators.required],
      Expiry_Date: ['', Validators.required],
      Approval_Date: ['', Validators.required],
      Approval_By: ['', Validators.required],
      File: ['', Validators.required],
      Contract_Type_ID: ['', Validators.required],
      Payment_Type_ID: ['', Validators.required],
      Member_ID: ['', Validators.required],
      Employee_ID: ['', Validators.required],
      Owner_ID: ['1'] // Default value set here, but not visible
    });

    this.approveForm = this.fb.group({
      memberId: ['', Validators.required],
      contractId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }



  goBack() {
    this.router.navigate(['/']);
  }

  openHelpModal(section: string) {
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file });
    }
  }

  onFileSelectedForContract(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileForContract = file;
      // Directly setting the form control value might not be necessary here, as FormData handles files directly
    }
  }

  uploadContract() {
    if (this.uploadForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('Member_Name', this.uploadForm.get('memberName')?.value);
    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    }

    this.contractManagerService.uploadSignedContract(formData).subscribe(
      response => {
        this.snackBar.open('Signed contract uploaded successfully.', 'Close', {
          duration: 3000
        });
        this.uploadForm.reset();
        this.selectedFile = null;
      },
      error => {
        this.snackBar.open('Failed to upload signed contract.', 'Close', {
          duration: 3000
        });
      }
    );
  }

  createContract() {
    if (this.contractForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('Subscription_Date', this.contractForm.get('Subscription_Date')?.value);
    formData.append('Expiry_Date', this.contractForm.get('Expiry_Date')?.value);
    formData.append('Approval_Date', this.contractForm.get('Approval_Date')?.value);
    formData.append('Approval_By', this.contractForm.get('Approval_By')?.value);
    formData.append('Contract_Type_ID', this.contractForm.get('Contract_Type_ID')?.value);
    formData.append('Payment_Type_ID', this.contractForm.get('Payment_Type_ID')?.value);
    formData.append('Member_ID', this.contractForm.get('Member_ID')?.value);
    formData.append('Employee_ID', this.contractForm.get('Employee_ID')?.value);
    formData.append('Owner_ID', this.contractForm.get('Owner_ID')?.value); // Correctly capturing Owner_ID
  
    if (this.selectedFileForContract) {
      formData.append('File', this.selectedFileForContract);
    }
  
    this.contractManagerService.createContract(formData).subscribe(
      response => {
        this.snackBar.open('Contract created successfully.', 'Close', {
          duration: 3000
        });
        this.contractForm.reset();
        this.selectedFileForContract = null;
      },
      error => {
        console.error('Error creating contract:', error); // Logging the error for debugging
        this.snackBar.open('Failed to create contract.', 'Close', {
          duration: 3000
        });
      }
    );
  }

  approveContract() {
    if (this.approveForm.invalid) {
      return;
    }

  //   const approveData = {
  //     memberId: this.approveForm.get('memberId')?.value,
  //     contractId: this.approveForm.get('contractId')?.value
  //   };

  //   this.contractManagerService.approveContract(approveData).subscribe(
  //     response => {
  //       this.snackBar.open('Contract approved successfully.', 'Close', {
  //         duration: 3000
  //       });
  //       this.approveForm.reset();
  //     },
  //     error => {
  //       this.snackBar.open('Failed to approve contract.', 'Close', {
  //         duration: 3000
  //       });
  //     }
  //   );
  // }
}
}
