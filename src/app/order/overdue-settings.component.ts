import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../Services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { OverdueSettings } from '../shared/order';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-overdue-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './overdue-settings.component.html',
  styleUrl: './overdue-settings.component.css'
})
export class OverdueSettingsComponent implements OnInit {

  userTypeID: number | null = null;
  overdueSettings: OverdueSettings | undefined;
  overdueSettingsForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {
    this.overdueSettingsForm  = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadOverdueSettings();
  }

  loadOverdueSettings(): void {
    this.orderService.getOverdueSettings().subscribe({
      next: (settings) => {
        this.overdueSettings = settings;
        this.overdueSettingsForm.patchValue({
          value: settings.overdueTimeValue,
          unit: settings.overdueTimeUnit
        });
      },
      error: (error) => {
        console.error('Error fetching deletion settings', error);
      }
    });
  }

  openEditModal(): void {
    $('#editModal').modal('show');
  }

  saveDeletionSettings(): void {
    if (this.overdueSettingsForm.valid) {
      const settings: OverdueSettings = {
        overdueTimeValue: this.overdueSettingsForm.value.value,
        overdueTimeUnit: this.overdueSettingsForm.value.unit
      };

      this.orderService.updateOverdueSettings(settings).subscribe({
        next: (response) => {
          console.log("Overdue Time", response )
          this.snackBar.open('Overdue time updated successfully', 'Close', { duration: 5000 });
          this.loadOverdueSettings();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.error('Error updating overdue time', error);
          this.snackBar.open('Failed to update overdue time. Please try again', 'Close', { duration: 5000 });
          this.loadOverdueSettings();
          $('#editModal').modal('hide');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
