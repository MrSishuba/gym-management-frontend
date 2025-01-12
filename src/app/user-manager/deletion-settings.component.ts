import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../Services/userprofile.service';
import { DeletionSettings } from '../shared/deletionsettings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
declare var $: any; 

@Component({
  selector: 'app-deletion-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './deletion-settings.component.html',
  styleUrl: './deletion-settings.component.css'
})
export class DeletionSettingsComponent implements OnInit {

  userTypeID: number | null = null;
  deletionSettings: DeletionSettings | undefined;
  deletionSettingsForm: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {
    this.deletionSettingsForm  = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadDeletionSettings();


    // Initialize help content
    this.helpContent = [
      {
        title: 'Deletion Settings Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Deletion Settings page allows you to view and update the time settings for data deletion. You can see the current deletion time settings and modify them through an edit modal.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Current Deletion Settings',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays the current deletion time and unit of time (e.g., Minutes, Hours, Days).</li>
            <li><strong>Usage:</strong> View the existing settings. Click the "Update Settings" button to open the edit modal if you need to make changes.</li>
          </ul>`
      },
      {
        title: '2. Update Settings Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal to allow you to update the deletion time settings.</li>
            <li><strong>Usage:</strong> Click the "Update Settings" button to open the modal where you can enter new values for deletion time.</li>
          </ul>`
      },
      {
        title: '3. Edit Modal',
        content: `
          <ul>
            <li><strong>Deletion Time Input:</strong>
              <ul>
                <li><strong>Purpose:</strong> Allows you to enter a new value for deletion time.</li>
                <li><strong>Usage:</strong> Enter the new deletion time value (e.g., 30 for 30 minutes). Ensure the value is positive and valid.</li>
              </ul>
            </li>
            <li><strong>Time Unit Dropdown:</strong>
              <ul>
                <li><strong>Purpose:</strong> Select the appropriate time unit for the deletion time.</li>
                <li><strong>Usage:</strong> Choose from options like Minutes, Hours, Days, Weeks, Months, Years to specify the unit of time.</li>
              </ul>
            </li>
            <li><strong>Update Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Saves the new deletion time settings and applies the changes.</li>
                <li><strong>Usage:</strong> Click the "Update" button to save the changes. This action updates the deletion settings in the system.</li>
              </ul>
            </li>
            <li><strong>Cancel Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Closes the modal without saving changes.</li>
                <li><strong>Usage:</strong> Click the "Cancel" button to discard any changes made and close the modal.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I update the deletion time settings?</p>
          <p><strong>A:</strong> Click the "Update Settings" button to open the edit modal. Enter the new deletion time value and select the appropriate unit. Click "Update" to save the changes.</p>
          <p><strong>Q:</strong> What happens if I don't enter a valid value?</p>
          <p><strong>A:</strong> The form validation ensures that the deletion time value is a positive number and that a time unit is selected. If the values are not valid, you will not be able to save the changes and will receive validation error messages.</p>
          <p><strong>Q:</strong> How can I cancel the changes if I change my mind?</p>
          <p><strong>A:</strong> Click the "Cancel" button in the modal to discard any changes and close the modal.</p>
          <p><strong>Q:</strong> Why is the modal not showing or hiding properly?</p>
          <p><strong>A:</strong> Ensure that jQuery and Bootstrap libraries are properly included in your project. If you encounter issues, check for JavaScript errors in the console.</p>
          <p><strong>Q:</strong> How can I verify that the settings were updated successfully?</p>
          <p><strong>A:</strong> After saving, a success message will appear confirming the update. The updated settings will be loaded automatically, and you can see the new values reflected on the page.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The deletion time settings are not updating.</p>
          <p><strong>Solution:</strong> Ensure that the Update method in the Deletion Settings service is functioning correctly and that the modal form is properly submitted. Check network requests for errors and verify the backend response.</p>
          <p><strong>Problem:</strong> The modal is not displaying or closing correctly.</p>
          <p><strong>Solution:</strong> Verify that jQuery and Bootstrap are correctly included and initialized in your project. Check for any JavaScript errors in the browser console that might affect modal behavior.</p>`
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

  loadDeletionSettings(): void {
    this.userService.getDeletionSettings().subscribe({
      next: (settings) => {
        this.deletionSettings = settings;
        this.deletionSettingsForm.patchValue({
          value: settings.deletionTimeValue,
          unit: settings.deletionTimeUnit
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

  saveDeletionTime(): void {
    if (this.deletionSettingsForm.valid) {
      const settings: DeletionSettings = {
        deletionTimeValue: this.deletionSettingsForm.value.value,
        deletionTimeUnit: this.deletionSettingsForm.value.unit
      };

      this.userService.updateDeletionTime(settings).subscribe({
        next: (response) => {
          console.log("Deletion time", response )
          this.snackBar.open('Deletion time updated successfully', 'Close', { duration: 5000 });
          this.loadDeletionSettings();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.error('Error updating deletion time', error);
          this.snackBar.open('Failed to update deletion time. Please try again', 'Close', { duration: 5000 });
          this.loadDeletionSettings();
          $('#editModal').modal('hide');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
