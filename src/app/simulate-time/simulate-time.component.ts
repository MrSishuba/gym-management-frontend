import { Component } from '@angular/core';
import { SubscriptionService } from '../Services/subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulate-time',
  standalone:true,
  imports:[CommonModule,FormsModule,SideNavBarComponent,MasterSideNavBarComponent],
  templateUrl: './simulate-time.component.html',
  styleUrls: ['./simulate-time.component.css']
})
export class SimulateTimeComponent {
  monthsToAdvance: number = 1;
  userTypeID: number | null = null;

  constructor(private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,private router:Router) { }

    ngOnInit(): void {      
      const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
      this.userTypeID = userTypeId;
    }



    simulateTime(): void {
      if (this.monthsToAdvance > 0) {
        this.subscriptionService.simulateTime(this.monthsToAdvance)
          .subscribe({
            next: () => {
              this.snackBar.open(`Successfully advanced time by ${this.monthsToAdvance} month(s).`, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success']
              });
            },
            error: (error) => {
              console.error('Error simulating time:', error);
              this.snackBar.open('Failed to simulate time.', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
            }
          });
      } else {
        this.snackBar.open('Please enter a valid number of months.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning']
        });
      }
    }

    goBack(): void {
      this.router.navigate(['/contract-settings']);
    }


  }

