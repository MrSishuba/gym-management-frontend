import { Component } from '@angular/core';
import { RewardTypeViewModel } from '../shared/reward';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RewardService } from '../Services/reward.service';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any; 

@Component({
  selector: 'app-reward-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './reward-type.component.html',
  styleUrl: './reward-type.component.css'
})
export class RewardTypeComponent {

  userTypeID: number | null = null;
  rewardTypes: RewardTypeViewModel[] = [];
  filteredRewardTypes: RewardTypeViewModel[] = [];
  selectedRewardType: any;
  rewardTypeForm: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  rewardCriteriaList: string[] = [
    "Placed a Booking",
    "Completed 10 Bookings in a Month",
    "Made 20 Bookings in Last 3 Months",
    "Made a Payment",
    "Placed First Order",
    "High-Value Order",
    "Large Quantity Order"
  ];

  constructor(private rewardTypeService: RewardService, private fb: FormBuilder, private location: Location, private router: Router, private snackBar: MatSnackBar) {
    this.rewardTypeForm = this.fb.group({
      reward_Type_Name: ['', Validators.required],      
      reward_Criteria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    this.loadRewardTypes();


    // Initialize help content
    this.helpContent = [
      {
        title: 'Reward Type Management Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Reward Type Management page allows administrators to create, view, edit, and delete different reward types that can be associated with various actions or criteria within the system.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Allows you to search for specific reward types by name, criteria, or ID.</li>
            <li><strong>Usage:</strong> Type your search query into the input field. The list of reward types will automatically filter to show matching results.</li>
          </ul>`
      },
      {
        title: '2. Create Reward Type Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal form where you can create a new reward type.</li>
            <li><strong>Usage:</strong> Click the "Create Reward Type" button to open the form. Fill in the required fields and click "Create" to save the new reward type.</li>
          </ul>`
      },
      {
        title: '3. Reward Type Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a list of all reward types with their ID, name, criteria, and available actions.</li>
            <li><strong>Usage:</strong> You can view, edit, or delete a reward type using the buttons in the "Actions" column.</li>
          </ul>`
      },
      {
        title: '4. View, Edit, Delete Buttons',
        content: `
          <ul>
            <li><strong>View:</strong> Opens a modal displaying the details of the selected reward type.</li>
            <li><strong>Edit:</strong> Opens a modal with a form to update the selected reward type's details.</li>
            <li><strong>Delete:</strong> Opens a confirmation modal to delete the selected reward type.</li>
          </ul>`
      },
      {
        title: '5. Modals',
        content: `
          <ul>
            <li><strong>Add Modal:</strong> Create a new reward type.
              <ul>
                <li><strong>Fields:</strong> 
                  <ul>
                    <li><strong>Reward Type Name:</strong> Enter the name of the reward type.</li>
                    <li><strong>Reward Criteria:</strong> Select the criteria for the reward type from the dropdown list.</li>
                  </ul>
                </li>
                <li><strong>Actions:</strong> Click "Create" to add the new reward type.</li>
              </ul>
            </li>
            <li><strong>View Modal:</strong> View the details of an existing reward type.
              <ul>
                <li><strong>Displayed Information:</strong>
                  <ul>
                    <li>Reward Type ID</li>
                    <li>Reward Type Name</li>
                    <li>Reward Criteria</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>Edit Modal:</strong> Update an existing reward type.
              <ul>
                <li><strong>Fields:</strong> 
                  <ul>
                    <li><strong>Reward Type Name:</strong> Edit the name of the reward type.</li>
                    <li><strong>Reward Criteria:</strong> Update the criteria for the reward type from the dropdown list.</li>
                  </ul>
                </li>
                <li><strong>Actions:</strong> Click "Update" to save the changes.</li>
              </ul>
            </li>
            <li><strong>Delete Modal:</strong> Confirm the deletion of a reward type.
              <ul>
                <li><strong>Actions:</strong> Click "Delete" to remove the reward type from the system.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Troubleshooting',
        content: `
          <p><strong>Search Not Working:</strong></p>
          <p><strong>Issue:</strong> The search bar does not return expected results.</p>
          <p><strong>Solution:</strong> Ensure that the search term is correctly spelled and matches the fields of the reward types. Verify that the data you are searching for exists in the system.</p>
          <p><strong>Changes Not Reflecting:</strong></p>
          <p><strong>Issue:</strong> Updates to reward types do not appear immediately.</p>
          <p><strong>Solution:</strong> Try refreshing the page to see if the changes take effect. Check the browser console for any errors that might indicate a problem with the update process.</p>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I create a new reward type?</p>
          <p><strong>A:</strong> Click the "Create Reward Type" button, fill in the required information in the form, and click "Create" to save it.</p>
          <p><strong>Q:</strong> How can I edit an existing reward type?</p>
          <p><strong>A:</strong> Find the reward type in the table, click the "Edit" button, update the necessary fields in the modal form, and click "Update."</p>
          <p><strong>Q:</strong> What should I do if I accidentally delete a reward type?</p>
          <p><strong>A:</strong> Once deleted, a reward type cannot be recovered. Ensure to double-check before confirming the deletion.</p>
          <p><strong>Q:</strong> Can I search for reward types by criteria?</p>
          <p><strong>A:</strong> Yes, you can search by reward criteria, reward type name, or ID using the search bar.</p>`
      }
    ];

    // Initialize filtered content
    this.filteredContent = [...this.helpContent];
  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }

  loadRewardTypes(): void {
    this.rewardTypeService.getAllRewardTypes().subscribe((rewardTypes: RewardTypeViewModel[]) => {
      this.rewardTypes = rewardTypes;
      this.filteredRewardTypes = rewardTypes;
    });
  }

  filterRewardTypes(): void {
    if (!this.searchTerm) {
      this.filteredRewardTypes = this.rewardTypes;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRewardTypes = this.rewardTypes.filter(rewardType =>
        rewardType.reward_Type_Name.toLowerCase().includes(term) ||
        rewardType.reward_Criteria.toLowerCase().includes(term) ||
        rewardType.reward_Type_ID.toString().includes(term)
      );
    }
  }

  openAddModal(): void {
    this.rewardTypeForm.reset();
    $('#addModal').modal('show');
  }

  openViewModal(rewardType: RewardTypeViewModel): void {
    this.selectedRewardType = rewardType;
    $('#viewModal').modal('show');
  }

  openEditModal(rewardType: RewardTypeViewModel): void {
    this.selectedRewardType = rewardType;
    this.rewardTypeForm.patchValue({
      reward_Type_Name: rewardType.reward_Type_Name,
      reward_Criteria: rewardType.reward_Criteria
    });
    $('#editModal').modal('show');
  }

  openDeleteModal(rewardType: RewardTypeViewModel): void {
    this.selectedRewardType = rewardType;
    $('#deleteModal').modal('show');
  }

  

  createRewardType(): void {
    if (this.rewardTypeForm.valid) {
      const newRewardType: RewardTypeViewModel = {
        reward_Type_ID: 0, // ID is auto-generated by the server
        reward_Type_Name: this.rewardTypeForm.value.reward_Type_Name,
        reward_Criteria: this.rewardTypeForm.value.reward_Criteria
      };
      this.rewardTypeService.createRewardType(newRewardType).subscribe({
        next: () => {
          this.loadRewardTypes();
          $('#addModal').modal('hide');
          this.snackBar.open('Reward type added', 'Close', { duration: 3000 });
        },
        error: (error) => {
          if (error.status === 409) {
            this.snackBar.open('Reward type already exists', 'Close');
          } else {
            console.error(error);
            this.snackBar.open('Reward type creation failed', 'Close');
          }
        }
      });
    }
  }

  updateRewardType(): void {
    if (this.rewardTypeForm.valid && this.selectedRewardType) {
      const rewardTypeName = this.rewardTypeForm.value.reward_Type_Name;
      const rewardCriteria = this.rewardTypeForm.value.reward_Criteria;
      this.rewardTypeService.updateRewardType(this.selectedRewardType.reward_Type_ID, rewardTypeName, rewardCriteria).subscribe({
        next: () => {
          this.loadRewardTypes();
          $('#editModal').modal('hide');
          this.snackBar.open('Reward type updated', 'Close', { duration: 3000 });
        },
        error: (error) => {
          if (error.status === 409) {
            this.snackBar.open('Reward type already exists', 'Close');
          } else {
            console.error(error);
            this.snackBar.open('Reward type update failed', 'Close');
          }
        }
      });
    }
  }  

  deleteRewardType(): void {
    if (this.selectedRewardType) {
      this.rewardTypeService.deleteRewardType(this.selectedRewardType.reward_Type_ID).subscribe(() => {
        this.loadRewardTypes();
        $('#deleteModal').modal('hide');
        this.snackBar.open('Reward type deleted', 'Close', { duration: 3000 });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
