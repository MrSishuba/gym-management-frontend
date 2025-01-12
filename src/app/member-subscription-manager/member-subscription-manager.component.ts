import { Component } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';

@Component({
  selector: 'app-member-subscription-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink,MemberSideNavBarComponent],
  templateUrl: './member-subscription-manager.component.html',
  styleUrls: ['./member-subscription-manager.component.css']
})
export class MemberSubscriptionManagerComponent {
  userTypeID: number | null = null;

  constructor(private contractManagerService: ContractManagerService, private router: Router) {}

  ngOnInit() {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

  }

  downloadContract() {
    this.contractManagerService.downloadMemberContract().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading contract', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/ProfilePage/:id']);
  }
}
