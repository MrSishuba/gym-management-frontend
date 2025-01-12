import { Component, OnInit, ViewChild } from '@angular/core';
import { RewardSetViewModel, RewardViewModel } from '../shared/reward';
import { RewardService } from '../Services/reward.service';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RewardTypeViewModel } from '../shared/reward';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
declare var $: any; 

@Component({
  selector: 'app-reward',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MasterSideNavBarComponent, SideNavBarComponent, MatPaginatorModule, MatTableModule,],
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.css'
})
export class RewardComponent implements OnInit {

  userTypeID: number | null = null;
  unlistedRewards = new MatTableDataSource<RewardViewModel>([]);
  listedRewards = new MatTableDataSource<RewardViewModel>([]);
  rewardTypes: RewardTypeViewModel[] = [];
  rewardForm: FormGroup;
  selectedReward: RewardViewModel | null = null;
  helpContent: any[] = [];
  filteredContent: any[] = [];
  searchTerm: string = '';

  @ViewChild('unlistedPaginator') unlistedPaginator!: MatPaginator;
  @ViewChild('listedPaginator') listedPaginator!: MatPaginator;

  constructor(
    private rewardService: RewardService,
    private location: Location,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.rewardForm = this.formBuilder.group({
      reward_Type_ID: ['', Validators.required],
      reward_Issue_Date: [new Date(), Validators.required],  // Set current date
      isPosted: [false, Validators.required]
    });
  }
  
  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadUnlistedRewards();
    this.loadListedRewards();

    // Initialize help content
    this.helpContent = [
      {
        title: 'Reward Management Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Reward Management page allows you to manage rewards within the system. You can view, create, and post rewards for members. The page is divided into two sections:</p>
          <ul>
            <li><strong>Unlisted Rewards:</strong> Rewards that have been created but not yet posted.</li>
            <li><strong>Listed Rewards:</strong> Rewards that have already been posted.</li>
          </ul>`
      },
      {
        title: '1. Back Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Click the back arrow icon to return to the previous page.</li>
          </ul>`
      },
      {
        title: '2. Unlisted Rewards Section',
        content: `
          <ul>
            <li><strong>Header:</strong> Displays "Unlisted Rewards".</li>
            <li><strong>Set New Reward Button:</strong> Opens a modal to set a new reward.</li>
            <li><strong>Unlisted Rewards Table:</strong> Lists rewards that are not yet posted. Columns include:
              <ul>
                <li>Reward ID</li>
                <li>Issue Date</li>
                <li>Reward Name</li>
                <li>Posted Status</li>
                <li>Actions (e.g., Post Reward)</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Listed Rewards Section',
        content: `
          <ul>
            <li><strong>Header:</strong> Displays "Listed Rewards".</li>
            <li><strong>Listed Rewards Table:</strong> Lists rewards that have been posted. Columns include:
              <ul>
                <li>Reward ID</li>
                <li>Issue Date</li>
                <li>Reward Name</li>
                <li>Posted Status</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. Set Reward Modal',
        content: `
          <ul>
            <li><strong>Purpose:</strong> A form for adding a new reward.</li>
            <li><strong>Fields:</strong>
              <ul>
                <li><strong>Reward Type:</strong> Select from available reward types.</li>
                <li><strong>Issue Date:</strong> Choose the issue date for the reward.</li>
                <li><strong>Is Posted:</strong> Indicate whether the reward should be posted immediately.</li>
              </ul>
            </li>
            <li><strong>Actions:</strong> Click "Add Reward" to submit the form and create the reward.</li>
          </ul>`
      },
      {
        title: '5. Post Reward Modal',
        content: `
          <ul>
            <li><strong>Purpose:</strong> A confirmation modal that asks if you want to post a specific reward.</li>
            <li><strong>Actions:</strong> Confirm the action in the Post Reward modal.</li>
          </ul>`
      },
      {
        title: 'Actions',
        content: `
          <ul>
            <li><strong>Set New Reward:</strong> Click the "Set New Reward" button, fill out the form in the modal, and click "Add Reward" to create the reward.</li>
            <li><strong>Post Reward:</strong> In the "Unlisted Rewards" table, click the "Post Reward" button next to the reward you want to post. Confirm the action in the Post Reward modal.</li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I create a new reward?</p>
          <p><strong>A:</strong> Click the "Set New Reward" button, fill out the form in the modal, and click "Add Reward" to create it.</p>
          <p><strong>Q:</strong> What does the "Is Posted" checkbox do?</p>
          <p><strong>A:</strong> The "Is Posted" checkbox indicates whether the reward should be immediately available to members. If checked, the reward will appear in the "Listed Rewards" section after being created.</p>
          <p><strong>Q:</strong> How do I post a reward that I previously created?</p>
          <p><strong>A:</strong> Find the reward in the "Unlisted Rewards" table, click "Post Reward", and confirm the action in the modal.</p>
          <p><strong>Q:</strong> Can I edit a reward after it’s been posted?</p>
          <p><strong>A:</strong> No, currently, rewards cannot be edited after they have been posted. You would need to create a new reward if changes are necessary.</p>
          <p><strong>Q:</strong> What happens if a reward fails to post?</p>
          <p><strong>A:</strong> You will see an error message with details about the issue. You can try posting again or contact support if the problem persists.</p>
          <p><strong>Q:</strong> Where can I find the list of reward types?</p>
          <p><strong>A:</strong> The list of available reward types is loaded into the "Reward Type" dropdown in the "Set Reward" modal. You can view all types when setting a new reward.</p>`
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

  ngAfterViewInit() {
    this.unlistedRewards.paginator = this.unlistedPaginator;
    this.listedRewards.paginator = this.listedPaginator;
  }

  loadUnlistedRewards(): void {
    this.rewardService.getAllRewards().subscribe(rewards => {
      this.unlistedRewards.data = rewards.filter(reward => !reward.isPosted);
      this.loadRewardTypes();
      console.log('Unlisted Rewards:', this.unlistedRewards);
    });
  }

  openPostRewardModal(reward: RewardViewModel): void {
    this.selectedReward = reward;
    $('#postRewardModal').modal('show');
  }

  confirmPostReward(): void {
    if (this.selectedReward) {
      const request = { RewardId: this.selectedReward.reward_ID };
      this.rewardService.postReward(request).subscribe({
        next: () => {
          this.loadUnlistedRewards();
          this.loadListedRewards();
          this.loadRewardTypes();
          $('#postRewardModal').modal('hide');
          this.snackBar.open('Reward posted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error posting reward:', error);
          this.snackBar.open(`Failed to post reward: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        }
      });
    }
  }

  openSetRewardModal(): void {
    this.rewardForm.patchValue({
      reward_Issue_Date: new Date(),  // Set today's date
      isPosted: false  // Ensure isPosted is set to true
    });
    $('#addRewardModal').modal('show');
  }
  

  loadRewardTypes(): void {
    this.rewardService.getAllRewardTypes().subscribe(types => {
      // Filter reward types by checking if they exist in the list of posted rewards
      this.rewardTypes = types.filter(type => 
        !this.listedRewards.data.some(reward => reward.reward_Type_Name === type.reward_Type_Name)
      );
      console.log('Filtered Reward Types (Unposted):', this.rewardTypes); // Debug line to check the filtered types
    });
  }
  

  createReward(): void {
    console.log('Form Valid:', this.rewardForm.valid);  // Check form validity
    console.log('Form Value:', this.rewardForm.value);  // Log form data
    
    if (this.rewardForm.valid) {
      const newReward: RewardSetViewModel = {
        reward_Issue_Date: this.rewardForm.value.reward_Issue_Date,
        reward_Type_ID: this.rewardForm.value.reward_Type_ID,
        isPosted: this.rewardForm.value.isPosted
      };
      this.rewardService.setReward(newReward).subscribe({
        next: () => {
          this.loadUnlistedRewards();
          this.loadListedRewards();
          $('#addRewardModal').modal('hide');
          this.snackBar.open('Reward set successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error setting reward:', error);
          this.snackBar.open(`Failed to set reward: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  

  loadListedRewards(): void {
    this.rewardService.getAllRewards().subscribe(rewards => {
      this.listedRewards.data = rewards.filter(reward => reward.isPosted);
      this.loadRewardTypes();
      console.log('Listed Rewards:', this.listedRewards);
    });
  }

  goBack(): void {
  this.location.back();
  }
} 
