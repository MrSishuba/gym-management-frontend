import { Component } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-signed-contracts',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule,SideNavBarComponent,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './signed-contracts.component.html',
  styleUrls: ['./signed-contracts.component.css']
})
export class SignedContractsComponent {
  memberId: number | null = null;
  contract: any = null; // Initialize as null
  userTypeID: number | null = null;
  isHelpModalOpen = false;


  constructor(
    private contractManagerService: ContractManagerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }

  getSignedContract() {
    if (!this.memberId) {
      this.showError('Please enter a valid Member ID.');
      return;
    }

    this.contractManagerService.getSignedContract(this.memberId).subscribe(response => {
      if (response) {
        this.contract = response;
      } else {
        this.contract = null;
        this.showError('Member ID does not exist.');
      }
    }, error => {
      console.error('Error retrieving signed contract', error);
      this.showError('Error retrieving signed contract.');
      this.contract = null;
    });
  }

  onMemberIdChange() {
    if (!this.memberId) {
      this.contract = null;
    }
  }

  openHelpModal() {
    this.isHelpModalOpen = true;
  }

  closeHelpModal() {
    this.isHelpModalOpen = false;
  }

  goBack(): void {
    this.router.navigate(['/all-signed-contracts']);
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  downloadConsentForm() {
    if (!this.contract || !this.contract.memberID) {
      this.showError('No contract found for this member.');
      return;
    }

    const memberId = this.contract.memberID;

    this.contractManagerService.downloadConsentFormForAdmin(memberId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consent_form_${memberId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading consent form', error);
        this.showError('Error downloading consent form.');
      }
    });
  }
}
