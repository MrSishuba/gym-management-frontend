import { Component, OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-contract-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SideNavBarComponent, MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './contract-history.component.html',
  styleUrls: ['./contract-history.component.css']
})
export class ContractHistoryComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  selectedContract: any;
  terminationReasonType: string = '';
  terminationReasonDescription: string = '';
  reasonTypes: string[] = ['Special Case', 'Banned', 'Upgraded'];
  userTypeID: number | null = null;
  showModal: boolean = false;
  ShowHistoryModal: boolean = false; // New flag for the Help Information modal


  constructor(private contractManagerService: ContractManagerService, private router: Router) { }

  ngOnInit(): void {
    this.loadContracts();

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

  }

  contractTypes: any = {
    1: '3 Month Plan',
    2: '6 Month Plan',
    3: '12 Month Plan',
  };

  loadContracts(): void {
    this.contractManagerService.getAllContractHistory().subscribe((contracts: any[]) => {
      this.contracts = contracts;
      this.filteredContracts = contracts;
    });
  }
  

  downloadContract(contractId: number): void {
    this.contractManagerService.downloadSignedContractForAdmin(contractId).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contract.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  viewReason(contract: any): void {
    this.selectedContract = contract;
    this.terminationReasonType = contract.termination_Reason_Type;
    this.terminationReasonDescription = contract.termination_Reason;
    this.showModal = true;
  }

    // Method to toggle the Help Information modal
    openHelpModal() {
      this.ShowHistoryModal = true;
    }

   // Toggle function for Help Information Modal
   toggleHelpModal() {
    this.ShowHistoryModal = !this.ShowHistoryModal;
  }


  closeModal(): void {
    this.showModal = false;
  }


  getContractTypeName(contractTypeId: number): string {
    return this.contractTypes[contractTypeId] || 'Unknown';
    return '';
  }

  getPaymentTypeName(paymentTypeId: number): string {
    // Implement logic to get payment type name by ID
    return '';
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  goBack() {
    this.router.navigate(['/all-signed-contracts']);
  }
}
