import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractSettingsService } from '../Services/contractSettings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-contract-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MasterSideNavBarComponent,RouterLink],
  templateUrl: './contract-settings.component.html',
  styleUrls: ['./contract-settings.component.css']
})
export class ContractSettingsComponent implements OnInit {
  contractSettings: any | undefined;
  contractSettingsForm: FormGroup;


  constructor(
    private contractSettingsService: ContractSettingsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.contractSettingsForm = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContractSettings();
  }

  loadContractSettings(): void {
    this.contractSettingsService.getContractSettings().subscribe({
      next: (settings) => {
        this.contractSettings = settings;
        this.contractSettingsForm.patchValue({
          value: settings.deletionTimeValue,
          unit: settings.deletionTimeUnit
        });
        console.log('Settings loaded:', this.contractSettings);
      },
      error: (error) => {
        console.error('Error fetching contract settings', error);
      }
    });
  }

  openEditModal(): void {
    $('#editModal').modal('show');
  }

  saveContractDeletionTime(): void {
    if (this.contractSettingsForm.valid) {
      // Optimistically update the UI
      this.contractSettings.deletionTimeValue = this.contractSettingsForm.value.value;
      this.contractSettings.deletionTimeUnit = this.contractSettingsForm.value.unit;

      console.log('Saving settings:', this.contractSettings);

      this.ngZone.run(() => {
        this.cdr.detectChanges();  // Force change detection
      });

      const settings: any = {
        deletionTimeValue: this.contractSettingsForm.value.value,
        deletionTimeUnit: this.contractSettingsForm.value.unit
      };

      this.contractSettingsService.updateContractDeletionTime(settings).subscribe({
        next: (response) => {
          this.snackBar.open('Contract deletion time updated successfully', 'Close', { duration: 5000 });
          this.loadContractSettings();  // Optional: Refetch settings to ensure consistency
          this.ngZone.run(() => {
            this.cdr.detectChanges();  // Force change detection again
          });
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.error('Error updating contract deletion time', error);
          this.snackBar.open('Failed to update contract deletion time. Please try again', 'Close', { duration: 5000 });
          // Revert the optimistic update if the request fails
          this.loadContractSettings();
          this.ngZone.run(() => {
            this.cdr.detectChanges();  // Force change detection again
          });
          $('#editModal').modal('hide');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
 
}
