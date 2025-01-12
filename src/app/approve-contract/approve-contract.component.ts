import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-approve-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SideNavBarComponent,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './approve-contract.component.html',
  styleUrls: ['./approve-contract.component.css']
})
export class ApproveContractComponent implements OnInit{
  approveForm: FormGroup;
  userTypeID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private contractManagerService: ContractManagerService
  ) {
    this.approveForm = this.fb.group({
      Member_ID: ['', Validators.required],
      Contract_ID: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }

  



  goBack() {
    this.router.navigate(['/all-signed-contracts']);
  }

  openHelpModal(section: string) {
    const modal = document.getElementById('helpModalApprove');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeHelpModal() {
    const modal = document.getElementById('helpModalApprove');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  approveContract() {
    if (this.approveForm.invalid) {
      console.log("Form is invalid", this.approveForm.status, this.approveForm.value);
      return;
    }
  
    const approveData = {
      Member_ID: this.approveForm.get('Member_ID')?.value,
      Contract_ID: this.approveForm.get('Contract_ID')?.value
    };
  
    this.contractManagerService.approveContract(approveData).subscribe(
      response => {
        console.log('Response:', response);
        this.snackBar.open('Contract approved successfully.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/all-signed-contracts']);
      },
      err => {
        console.log('Error:', err);
        if (err.status === 200) {
          // If the status is 200 but the parsing failed, handle the success manually
          this.snackBar.open('Contract approved successfully.', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/all-signed-contracts']);
        } else {
          this.snackBar.open('Failed to approve contract.', 'Close', {
            duration: 3000
          });
        }
      }
    );
  }
}

