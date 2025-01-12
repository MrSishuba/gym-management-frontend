import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractManagerService } from '../Services/contractManager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';

@Component({
  selector: 'app-request-contract-termination',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MemberSideNavBarComponent],
  templateUrl: './request-contract-termination.component.html',
  styleUrls: ['./request-contract-termination.component.css']
})
export class RequestContractTerminationComponent implements OnInit {
  terminationForm!: FormGroup;
  idNumberForm!: FormGroup;
  showCustomReason = false;
  confirmChecked = false;
  terminationReasons: { value: number; label: string }[] = [];
  showTerminationModal = false;
  showConfirmModal = false;
  idNumber: string = '';
  response: any; // Store response after validating ID number
  userTypeID: number | null = null;

  memberId: number | null = null;
  contractId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contractManagerService: ContractManagerService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idNumberForm = this.fb.group({
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]]
    });

    this.terminationForm = this.fb.group({
      terminationReasonType: [null, Validators.required],
      customReason: ['']
    });

    this.loadTerminationReasons();

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  loadTerminationReasons(): void {
    this.terminationReasons = [
      { value: 0, label: 'Fees are too expensive' },
      { value: 1, label: 'I want a different challenge at a different gym' },
      { value: 2, label: 'I\'m unhappy at AVS Fitness' },
      { value: 3, label: 'Relocating to a different city or country' },
      { value: 4, label: 'Health issues or injury preventing regular attendance' },
      { value: 5, label: 'Personal or financial circumstances' },
      { value: 6, label: 'Lack of time due to increased work or family commitments' },
      { value: 7, label: 'Unsatisfactory customer service or support experience' },
      { value: 8, label: 'Custom' }
    ];
  }

  onReasonChange(reason: number): void {
    const customReasonControl = this.terminationForm.get('customReason');
    if (customReasonControl) {
      if (reason === 8) {
        this.showCustomReason = true;
        customReasonControl.setValidators([Validators.required]);
      } else {
        this.showCustomReason = false;
        customReasonControl.clearValidators();
        customReasonControl.reset();
      }
      customReasonControl.updateValueAndValidity();
      this.cdr.detectChanges();
    }
  }

  onSubmit(): void {
    if (this.idNumberForm.valid) {
      this.idNumber = this.idNumberForm.value.idNumber;
      console.log('Sending ID Number:', this.idNumber);
  
      this.contractManagerService.getMemberAndContractIdsByIdNumber(this.idNumber)
        .subscribe({
          next: (response) => {
            console.log('Full API Response:', response);
            if (response && response.member_ID !== undefined && response.contract_ID !== undefined) {
              this.memberId = response.member_ID;
              this.contractId = response.contract_ID;
              this.snackBar.open('ID Number validated successfully.', 'Close', { duration: 3000 });
              this.showTerminationModal = true;
              this.updateStep(2);
            } else {
              this.snackBar.open('Invalid ID Number or data not found.', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Error during ID validation', error);
            this.snackBar.open('Failed to validate ID Number. Please try again later.', 'Close', { duration: 3000 });
          },
          complete: () => {
            console.log('Request completed');
          }
        });
    } else {
      this.snackBar.open('Please enter a valid 13-digit ID Number.', 'Close', { duration: 3000 });
    }
  }
  
  

  onContinue(): void {
    if (this.terminationForm.valid) {
      this.showTerminationModal = false;
      this.showConfirmModal = true;
      this.cdr.detectChanges();
      this.updateStep(3); // Added to transition to the final step
    } else {
      this.snackBar.open('Form is invalid or missing required data.', 'Close', { duration: 3000 });
    }
  }

  async onConfirmTermination(): Promise<void> {
    if (this.confirmChecked && this.terminationForm.valid && this.memberId !== null && this.contractId !== null) {
      const formValue = this.terminationForm.value;
      console.log('Form Values:', formValue);
      console.log('Contract ID:', this.contractId);
      console.log('Member ID:', this.memberId);
  
      try {
        // Convert the Observable to a Promise using firstValueFrom
        const terminateResponse = await firstValueFrom(
          this.contractManagerService.terminateContractRequest(
            this.contractId,
            this.memberId,
            formValue.terminationReasonType,
            formValue.customReason
          )
        );
  
        console.log('Termination Response:', terminateResponse);
  
        if (terminateResponse && terminateResponse.contract_ID === this.contractId && terminateResponse.member_ID === this.memberId) {
          // Clear the form and ID numbers
          this.terminationForm.reset();
          this.memberId = null;
          this.contractId = null;
  
          // Clear the confirmation modal
          this.showConfirmModal = false;
          this.updateStep(1);
  
          // Show success message
          this.snackBar.open('Termination request successful.', 'Close', { duration: 3000 });
  
          // Route back to profile page
          this.router.navigate(['/ProfilePage/:id']); // Adjust the route as needed
        } else {
          throw new Error('Termination request failed');
        }
      } catch (error) {
        console.error('Error during termination request', error);
        this.snackBar.open('Failed to submit termination request. Please try again later.', 'Close', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Please acknowledge the termination terms to proceed.', 'Close', { duration: 3000 });
    }
  }
  

  onCancelConfirmModal(): void {
    this.showConfirmModal = false;
    this.showTerminationModal = true;
    this.confirmChecked = false;
    this.updateStep(2); // Reset to Step 1
    this.cdr.detectChanges();
  }

  onCloseTerminationModal(): void {
    this.showTerminationModal = false;
    this.confirmChecked = false;
    this.updateStep(1); // Reset to Step 1
  }

  updateStep(step: number) {
    const stepTitle = document.getElementById('stepTitle');
    const stepInstructions = document.getElementById('stepInstructions');
  
    if (stepTitle && stepInstructions) {
      if (step === 1) {
        stepTitle.innerText = 'Step 1 of 3';
        stepInstructions.innerText = 'Please provide your ID number to begin the contract termination process.';
      } else if (step === 2) {
        stepTitle.innerText = 'Step 2 of 3';
        stepInstructions.innerText = 'Please fill in your termination reason.';
      } else if (step === 3) {
        stepTitle.innerText = 'Step 3 of 3';
        stepInstructions.innerText = 'Please confirm the termination of your contract.';
      }
    }
  }

  goBack(): void {
    this.router.navigate(['member-subscription-manager']);
  }
}
