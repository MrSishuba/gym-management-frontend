import { Component, OnInit } from '@angular/core';
import { ContractService } from '../Services/contract.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [CommonModule, FormsModule,CommonModule,RouterLink,SideNavBarComponent,MasterSideNavBarComponent],
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  email: string = '';
  selectedContract: string = '';
  isLoading: boolean = false;
  isHovered: boolean = false;
  userTypeID: number | null = null; 

  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za', '@tuks.co.za'
  ];

 

  constructor(private contractService: ContractService, private router: Router, private snackBar: MatSnackBar) {}

   ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }


    validateEmail(): void {
      const email = this.email.trim().toLowerCase();
      
      if (!email) {
        this.snackBar.open('Email is required.', 'Close', { duration: 5000 });
        return;
      }
  
      if (!email.includes('@') || !this.isEmailValid(email)) {
        this.snackBar.open('Invalid email address.', 'Close', { duration: 5000 });
        return;
      }
  
      if (!this.isDomainValid(email)) {
        this.snackBar.open('Email domain is not valid.', 'Close', { duration: 5000 });
        return;
      }
    }


    private isEmailValid(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    private isDomainValid(email: string): boolean {
      const domain = email.substring(email.lastIndexOf('@'));
      return this.allowedEmailDomains.includes(domain);
    }
  
    sendContract() {
      if (!this.email || !this.isEmailValid(this.email) || !this.isDomainValid(this.email)) {
        this.validateEmail();
        return;
      }
  
      switch (this.selectedContract) {
        case '3-month':
          this.send3MonthContract();
          break;
        case '6-month':
          this.send6MonthContract();
          break;
        case '12-month':
          this.send12MonthContract();
          break;
        default:
          this.snackBar.open('Please select a contract', 'Close', { duration: 5000 });
      }
    }
  
    send3MonthContract() {
      this.isLoading = true;
      this.contractService.send3MonthContract(this.email).subscribe({
        next: (response: string) => {
          this.isLoading = false;
          this.snackBar.open('3-month contract sent to ' + this.email, 'Close', { duration: 5000 });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open('Could not send 3-month contract to ' + this.email, 'Close', { duration: 5000 });
        }
      });
    }
  
    send6MonthContract() {
      this.isLoading = true;
      this.contractService.send6MonthContract(this.email).subscribe({
        next: (response: string) => {
          this.isLoading = false;
          this.snackBar.open('6-month contract sent to ' + this.email, 'Close', { duration: 5000 });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open('Could not send 6-month contract to ' + this.email, 'Close', { duration: 5000 });
        }
      });
    }
  
    send12MonthContract() {
      this.isLoading = true;
      this.contractService.send12MonthContract(this.email).subscribe({
        next: (response: string) => {
          this.isLoading = false;
          this.snackBar.open('12-month contract sent to ' + this.email, 'Close', { duration: 5000 });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open('Could not send 12-month contract to ' + this.email, 'Close', { duration: 5000 });
        }
      });
    }
  

  getContractImage() {
    switch (this.selectedContract) {
      case '3-month':
        return 'assets/images/bronze.jpg';
      case '6-month':
        return 'assets/images/silver2.jpg';
      case '12-month':
        return 'assets/images/Gold.jpg';
      default:
        return 'assets/images/all3.jpg';
    }
  }

  goBack(): void {
    this.router.navigate(['/landing-page']);
  }

  onMouseOver() {
    this.isHovered = true;
  }

  onMouseOut() {
    this.isHovered = false;
  }
}
