import { Component, OnInit } from '@angular/core';
import { ContractManagerService } from '../Services/contractManager.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';
import { MemberExportService } from '../Services/member-export.service';

@Component({
  selector: 'app-contract-statistics',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,SideNavBarComponent,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './contract-statistics.component.html',
  styleUrls: ['./contract-statistics.component.css']
})
export class ContractStatisticsComponent implements OnInit {
  showStatistics = false;
  showStatsModal: boolean = false;
  statistics: any[] = [];
    userTypeID: number | null = null;

  constructor(private contractManagerService: ContractManagerService,private memberExportService: MemberExportService ,private router:Router) {}

  ngOnInit(): void {
    this.loadStatistics();

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

  }

  toggleStatistics(): void {
    this.showStatistics = !this.showStatistics;
  }

  loadStatistics(): void {
    this.contractManagerService.getMembersCountPerContractType().subscribe(data => {
      this.statistics = data;
    });
  }

  toggleInfoModal() {
    this.showStatsModal = !this.showStatsModal;
  }

  getContractTypeName(contractTypeId: number): string {
    switch (contractTypeId) {
      case 1:
        return '3-Month Membership';
      case 2:
        return '6-Month Membership';
      case 3:
        return '12-Month Membership';
      default:
        return 'Unknown Membership';
    }
  }

  goBack() {
    this.router.navigate(['/all-signed-contracts']);
  }

  exportMembers(): void {
    this.memberExportService.exportMembersToJson().subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MembersExport.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
