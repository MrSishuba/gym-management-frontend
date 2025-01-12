import { Component, OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TerminationReasonType } from '../shared/TerminationReasonType';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-signed-contracts',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, MasterSideNavBarComponent,SideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './all-signed-contracts.component.html',
  styleUrls: ['./all-signed-contracts.component.css'],
  providers:[DatePipe]
})
export class AllSignedContractsComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  searchText: string = '';
  terminationReasonTypes: string[] = Object.values(TerminationReasonType);
  ShowContractModal: boolean = false;
  userTypeID: number | null = null;



  contractTypes: any = {
    1: '3 Month Plan',
    2: '6 Month Plan',
    3: '12 Month Plan',
  };

  paymentTypes: any = {

    3: 'Debit Order',
  };

  selectedContract: any;
  showModal: boolean = false;
  showReasonModal: boolean = false;
  terminationReasonType: string = '';
  terminationReason: string = '';
  

  constructor(private contractManagerService: ContractManagerService, private router: Router, private datePipe: DatePipe
    ,private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllSignedContracts();

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

  }


  getAllSignedContracts() {
    this.contractManagerService.getAllSignedContracts().subscribe(response => {
      this.contracts = response;
      this.filteredContracts = this.contracts;
    }, error => {
      console.error('Error retrieving all signed contracts', error);
    });
  }

  filterContracts() {
    this.filteredContracts = this.contracts.filter(contract =>
      contract.contract_ID.toString().includes(this.searchText) ||
      this.getContractTypeName(contract.contract_Type_ID).toLowerCase().includes(this.searchText.toLowerCase()) ||
      contract.subscription_Date.toString().includes(this.searchText) ||
      contract.approval_Status.toString().includes(this.searchText)
    );
  }

  goBack(): void {
    this.router.navigate(['/user-manager']);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(new Date(date), 'dd MMMM yyyy') || '';
  }


  getContractTypeName(contractTypeId: number): string {
    return this.contractTypes[contractTypeId] || 'Unknown';
  }

  getPaymentTypeName(paymentTypeId: number): string {
    return this.paymentTypes[paymentTypeId] || 'Unknown';
  }

  downloadContract(contractId: number) {
    this.contractManagerService.downloadSignedContractForAdmin(contractId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract_${contractId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading contract', error);
      }
    });
  }

  initiateTerminateContract(contract: any): void {
    this.selectedContract = contract;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showReasonModal = false;
    this.selectedContract = null;
    this.terminationReason = '';
    this.terminationReasonType = '';
    this.ShowContractModal = false;
  }


  confirmTerminationPrompt() {
    if (this.selectedContract) {
      this.showModal = false;
      this.showReasonModal = true;  // Open reason modal after confirmation
    }
  }


  confirmTermination() {
    if (this.terminationReasonType && this.terminationReason && this.selectedContract) {
      const terminationData = {
        contract_ID: this.selectedContract.contract_ID,
        member_ID: this.selectedContract.member_ID,
        reason: this.terminationReason,
        termination_Reason_Type: this.mapReasonTypeToEnum(this.terminationReasonType)
      };

      this.contractManagerService.terminateContract(terminationData).subscribe({
        next: () => {
          this.getAllSignedContracts();
          this.snackBar.open('Contract terminated successfully.', 'Close', {
            duration: 3000,
          });
          this.closeModal();
        },
        error: (error) => {
          console.error('Error terminating contract', error);
          this.snackBar.open(`Error terminating contract: ${error.message}`, 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.snackBar.open('Please select a reason type and enter a reason.', 'Close', {
        duration: 3000,
      });
    }
  }
   // Add a method to map the termination reason type to numeric values expected by the backend
mapReasonTypeToEnum(reasonType: string): number {
  switch (reasonType) {
    case 'Banned':
      return 1;
    case 'Upgraded':
      return 2;
    case 'Special Case':
      return 3;
    default:
      return 0; // Default or error value
  }
}

}
