import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../Services/survey.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-survey',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SideNavBarComponent,MasterSideNavBarComponent],
  templateUrl: './admin-survey.component.html',
  styleUrls: ['./admin-survey.component.css']
})
export class AdminSurveyComponent implements OnInit {
  responses: any[] = [];
  currentIndex: number = 0;
  currentResponse: any;
  userTypeID: number | null = null;

  constructor(private surveyService: SurveyService,private router: Router) { }

  ngOnInit(): void {
    this.getSurveyResponses();
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  getSurveyResponses(): void {
    this.surveyService.getSurveyResponses().subscribe(data => {
      this.responses = data;
      this.currentResponse = this.responses[this.currentIndex];
    });
  }

  nextResponse(): void {
    if (this.currentIndex < this.responses.length - 1) {
      this.currentIndex++;
      this.currentResponse = this.responses[this.currentIndex];
    }
  }

  prevResponse(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentResponse = this.responses[this.currentIndex];
    }
  }

  exportToExcel(): void {
    this.surveyService.exportSurveyResponses().subscribe((data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SurveyResponses.xlsx';
      a.click();
    });
  }

  goBack() {
    const userTypeId = JSON.parse(localStorage.getItem('User')!).userTypeId;
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    if (userTypeId === 1) {  // Ensure userTypeID is compared as string
      this.router.navigateByUrl(`/OwnerHome/${userId}`);
    } else if (userTypeId === 2) {
      this.router.navigateByUrl(`/EmployeeHome/${userId}`);
    } else if (userTypeId === 3) {
      this.router.navigateByUrl(`/Home/${userId}`);
    }
  }
}
