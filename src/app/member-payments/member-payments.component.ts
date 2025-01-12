import { Component, OnInit } from '@angular/core';
import { SubscriptionService, SubscriptionStatus } from '../Services/subscription.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-payments',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule,SideNavBarComponent,MasterSideNavBarComponent,FormsModule,ReactiveFormsModule], // Add MatSnackBarModule here
  templateUrl: './member-payments.component.html',
  styleUrls: ['./member-payments.component.css']
})
export class MemberPaymentsComponent implements OnInit {
  subscriptions: SubscriptionStatus[] = [];
  filteredSubscriptions: SubscriptionStatus[] = [];
  loading = true;
  showBlockModal = false;
  showReactivateModal = false;
  currentMemberId: number | null = null;
  userTypeID: number | null = null;
  searchQuery: string = '';
    showModal = false;
  searchTerm: string = '';



  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar, private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();

    
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;


  }

  loadSubscriptions(): void {
    this.subscriptionService.getSubscriptions().subscribe(data => {
      this.subscriptions = data;
      this.filteredSubscriptions = data;
      this.loading = false;
    });
  }

  filterTable(): void {
    this.filteredSubscriptions = this.subscriptions.filter(subscription => {
      const fullName = `${subscription.name} ${subscription.surname}`.toLowerCase();
      return fullName.includes(this.searchQuery.toLowerCase());
    });
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.filteredSubscriptions = this.subscriptions;
    } else {
      this.filteredSubscriptions = this.subscriptions.filter(subscription => 
        subscription.membership_Status_Description === status
      );
    }
  }

  openBlockModal(memberId: number): void {
    this.currentMemberId = memberId;
    this.showBlockModal = true;
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
    this.currentMemberId = null;
  }

  confirmBlock(): void {
    if (this.currentMemberId !== null) {
      this.subscriptionService.blockMember(this.currentMemberId).subscribe({
        next: response => {
          this.snackBar.open('Member blocked successfully', 'Close', { duration: 3000 });
          this.loadSubscriptions(); // Refresh the table
          this.closeBlockModal();
        },
        error: err => {
          this.snackBar.open('Failed to block member', 'Close', { duration: 3000 });
          console.error('Error:', err.error || 'Unknown error occurred.');
        }
      });
    }
  }

  openReactivateModal(memberId: number): void {
    this.currentMemberId = memberId;
    this.showReactivateModal = true;
  }

  closeReactivateModal(): void {
    this.showReactivateModal = false;
    this.currentMemberId = null;
  }

  confirmReactivate(): void {
    if (this.currentMemberId !== null) {
      this.subscriptionService.reactivateMember(this.currentMemberId).subscribe({
        next: response => {
          this.snackBar.open('Member reactivated successfully', 'Close', { duration: 3000 });
          this.loadSubscriptions(); // Refresh the table
          this.closeReactivateModal();
        },
        error: err => {
          this.snackBar.open('Failed to reactivate member', 'Close', { duration: 3000 });
          console.error('Error:', err.error || 'Unknown error occurred.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/member-manager-navigation']);
  }

  sections = [
    {
      title: 'Welcome to Membership Management System',
      points: [
        'The purpose of this system is to manage all debit orders we receive for memberships.',
        'This system ensures proper tracking and management of memberships.'
      ]
    },
    {
      title: 'When to Block',
      points: [
        'If a member has an outstanding payment, click "Block".',
        'A confirmation will appear, and upon confirmation, the member status will change to blocked.',
        'The member will receive an email notification about their outstanding balance and will be blocked from logging in until they email proof of payment.'
      ]
    },
    {
      title: 'When to Reactivate',
      points: [
        'To allow members to log in again and use the system, use this button once a valid proof of payment for the outstanding amount has been received.',
        'The member will have their outstanding amount amended.',
        'Blocked members cannot be re-blocked, and reactivated members cannot be reactivated again.',
        'Premature blocking and reactivating irresponsibly is considered an employee offense and may result in consequences.'
      ]
    }
  ];

  get filteredSections() {
    return this.sections.filter(section =>
      section.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      section.points.some(point => point.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }






}
