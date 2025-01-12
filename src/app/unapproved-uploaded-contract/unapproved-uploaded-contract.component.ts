import { Component,OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';

@Component({
  selector: 'app-unapproved-uploaded-contract',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,SideNavBarComponent,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './unapproved-uploaded-contract.component.html',
  styleUrl: './unapproved-uploaded-contract.component.css'
})
export class UnapprovedUploadedContractComponent implements OnInit {
  members: any[] = [];
  filteredMembers: any[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;
  showHelpModal: boolean = false;

  // Call this method to open the help modal
  openHelpModal() {
    this.showHelpModal = true;
  }

  // Call this method to close the help modal
  closeHelpModal() {
    this.showHelpModal = false;
  }

  

  constructor(private contractManagerService: ContractManagerService, private router: Router) {}

  ngOnInit() {
    this.contractManagerService.getMembersWithUploadedContractsButNoContractRecord().subscribe((data: any[]) => {
      this.members = data;
      this.filteredMembers = data;
    });

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  filterMembers() {
    this.filteredMembers = this.members.filter(member => 
      member.memberName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.memberSurname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goBack() {
    this.router.navigate(['/upload-contract']);
  }

  
}