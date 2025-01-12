import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-issued-free-trials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SideNavBarComponent,MasterSideNavBarComponent],
  templateUrl: './issued-free-trials.component.html',
  styleUrls: ['./issued-free-trials.component.css']
})
export class IssuedFreeTrialsComponent implements OnInit {
  freeTrials: any[] = [];
  filteredFreeTrials: any[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;
  showHelpModal: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('https://localhost:7185/api/FreeTrial/GetFreeTrialSignUps').subscribe((data) => {
      this.freeTrials = data;
      this.filteredFreeTrials = data;
    });

    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  filterFreeTrials() {
    this.filteredFreeTrials = this.freeTrials.filter(trial => 
      `${trial.name} ${trial.surname}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      trial.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goBack() {
    this.router.navigate(['/guest-manager']);
  }

  openHelpModal() {
    this.showHelpModal = true;
  }

  closeHelpModal() {
    this.showHelpModal = false;
  }
}
