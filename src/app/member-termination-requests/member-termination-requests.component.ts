import { Component, OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-termination-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SideNavBarComponent, MasterSideNavBarComponent],
  templateUrl: './member-termination-requests.component.html',
  styleUrls: ['./member-termination-requests.component.css']
})
export class MemberTerminationRequestsComponent implements OnInit {
  terminationRequests: any[] = [];
  selectedCustomReason: string | null = null;
  showModal: boolean = false; // Added for controlling modal visibility
  userTypeID: number | null = null;
  terminationReasons: { value: number, label: string }[] = [];
  showHelpModal: boolean = false;

  constructor(
    private contractManagerService: ContractManagerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTerminationRequests();
    this.loadTerminationReasons(); // Load termination reasons
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  loadTerminationRequests(): void {
    this.contractManagerService.getTerminationRequests().subscribe({
      next: (data: any[]) => {
        this.terminationRequests = data; // Ensure data is received and assigned correctly
        console.log('Termination Requests:', this.terminationRequests); // Add this to check if data is received
      },
      error: (error) => {
        console.error('Failed to load termination requests', error);
      }
    });
  }

  loadTerminationReasons(): void {
    this.terminationReasons = [
      { value: 0, label: 'FeesTooExpensive' },
      { value: 1, label: 'DifferentChallengeAtAnotherGym' },
      { value: 2, label: 'UnhappyAtAVSFitness' },
      { value: 3, label: 'Relocating' },
      { value: 4, label: 'HealthIssues' },
      { value: 5, label: 'PersonalOrFinancialCircumstances' },
      { value: 6, label: 'LackOfTime' },
      { value: 7, label: 'UnsatisfactoryCustomerService' },
      { value: 8, label: 'Custom' }
    ];
  }
  
  approveRequest(request: any): void {
    // Find the termination reason object from the array
    const terminationReason = this.terminationReasons.find(reason => reason.label === request.requestedTerminationReasonType);
  
    // Throw an error if the termination reason is not found
    if (!terminationReason) {
      this.snackBar.open('Invalid termination reason type.', 'Close', { duration: 3000 });
      console.error('Error: Invalid termination reason type.');
      return;
    }
  
    // Create approvalData with the correct enum value
    const approvalData = {
      Contract_ID: request.contract_ID,
      Member_ID: request.member_ID,
      CustomReason: request.customReason,
      Requested_Termination_Reason_Type: terminationReason.value
    };
  
    this.contractManagerService.approveRequestedTermination(approvalData).subscribe({
      next: (response) => {
        this.snackBar.open('Termination request approved successfully.', 'Close', { duration: 3000 });
        this.loadTerminationRequests(); // Refresh the list of requests
      },
      error: (error) => {
        this.snackBar.open('Failed to approve termination request.', 'Close', { duration: 3000 });
        console.error('Error approving termination request:', error);
      }
    });
  }
  

  viewDetails(request: any): void {
    this.selectedCustomReason = request.customReason;
    this.showModal = true; // Show modal
  }

  closeModal(): void {
    this.showModal = false; // Hide modal
  }

  
    // Method to show the help modal
    showHelpModalFunction(): void {
      this.showHelpModal = true;
    }
  
    // Method to close the help modal
    closeHelpModal(): void {
      this.showHelpModal = false;
    }
  

  





  goBack(): void {
    this.router.navigate(['/member-manager-navigation']);
  }
}
