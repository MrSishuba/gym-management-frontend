import { Component, OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-unapproved-contract-record',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SideNavBarComponent, MasterSideNavBarComponent, ContractDropdownNavComponent],
  templateUrl: './unapproved-contract-record.component.html',
  styleUrl: './unapproved-contract-record.component.css'
})
export class UnapprovedContractRecordComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  searchTerm: string = '';
  selectedContract: any = null;
  showModalFlag: boolean = false;
  userTypeID: number | null = null;
  showHelpModal: boolean = false;

  constructor(private contractManagerService: ContractManagerService, private router: Router) {}

    // Call this method to open the help modal
    openHelpModal() {
      this.showHelpModal = true;
    }
  
    // Call this method to close the help modal
    closeHelpModal() {
      this.showHelpModal = false;
    }

  ngOnInit() {
    this.contractManagerService.getUnapprovedContracts().subscribe((data: any[]) => {
      this.contracts = data;
      this.filteredContracts = data;
    });

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  filterContracts() {
    this.filteredContracts = this.contracts.filter(contract => 
      contract.memberName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      contract.memberSurname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  showModal(contract: any) {
    console.log('Show Modal Triggered:', contract); // Debugging
    this.selectedContract = contract;
    this.showModalFlag = true;
  }

  closeModal() {
    this.showModalFlag = false;
  }

  discardContract() {
    if (this.selectedContract) {
      console.log('Discard Contract Triggered:', this.selectedContract); // Debugging
      this.contractManagerService.discardUnapprovedContract(this.selectedContract).subscribe(
        response => {
          console.log('Contract discarded:', response); // Debugging
          this.contracts = this.contracts.filter(c => c !== this.selectedContract);
          this.filteredContracts = this.contracts;
          this.closeModal();
        },
        error => {
          console.error('Error discarding contract:', error); // Debugging
        }
      );
    } else {
      console.error('No contract selected for discard.'); // Debugging
    }
  }

  goBack() {
    this.router.navigate(['/create-contract']);
  }
}
