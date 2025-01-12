import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VAT } from '../shared/payment';
import { PaymentService } from '../Services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
declare var $: any; 

@Component({
  selector: 'app-vat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './vat.component.html',
  styleUrl: './vat.component.css'
})
export class VATComponent implements OnInit{
  userTypeID: number | null = null;
  vat: VAT | undefined;
  vatForm: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private vatService: PaymentService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private location: Location) {
    this.vatForm = this.fb.group({
      vaT_Percentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadVAT();

    // Initialize help content
    this.helpContent = [
      {
        title: 'VAT Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Manage VAT page allows you to view and update the VAT (Value Added Tax) percentage applied in your system. It displays the current VAT percentage and the last updated date. You can update the VAT settings through an edit modal.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Current VAT Percentage',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays the current VAT percentage and the last update date.</li>
            <li><strong>Usage:</strong> This section shows the current VAT settings. The VAT percentage is displayed as a percentage, and the date of the last update is shown.</li>
          </ul>`
      },
      {
        title: '2. Update VAT Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal to allow you to update the VAT percentage.</li>
            <li><strong>Usage:</strong> Click the "Update VAT" button to open the modal where you can enter a new VAT percentage value.</li>
          </ul>`
      },
      {
        title: '3. Edit Modal',
        content: `
          <ul>
            <li><strong>VAT Percentage Input:</strong>
              <ul>
                <li><strong>Purpose:</strong> Allows you to input a new VAT percentage.</li>
                <li><strong>Usage:</strong> Enter the new VAT percentage (e.g., 15 for 15%). Ensure the value is correct as it directly affects tax calculations.</li>
              </ul>
            </li>
            <li><strong>Update Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Saves the new VAT percentage and applies the changes.</li>
                <li><strong>Usage:</strong> Click the "Update" button to save the new VAT percentage. This action updates the VAT settings in the system.</li>
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
          <p><strong>Q:</strong> How do I update the VAT percentage?</p>
          <p><strong>A:</strong> Click the "Update VAT" button to open the edit modal. Enter the new VAT percentage value and click "Update" to save the changes.</p>
          <p><strong>Q:</strong> What if the VAT percentage input is invalid?</p>
          <p><strong>A:</strong> The form validation ensures that the VAT percentage is a number between 1 and 100. If the input is invalid, error messages will be displayed indicating the specific validation issue (e.g., "VAT Percentage is required" or "VAT Percentage must be at least 1").</p>
          <p><strong>Q:</strong> How can I cancel the update?</p>
          <p><strong>A:</strong> Click the "Cancel" button in the modal to discard any changes and close the modal without updating the VAT percentage.</p>
          <p><strong>Q:</strong> How will I know if the VAT update was successful?</p>
          <p><strong>A:</strong> After a successful update, a snackbar message will appear confirming the VAT update. The updated VAT percentage will be reflected immediately on the page.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The VAT percentage is not updating.</p>
          <p><strong>Solution:</strong> Ensure that the Update method in the VAT service is functioning correctly and that the modal form is properly submitted. Check network requests for errors and verify the backend response.</p>
          <p><strong>Problem:</strong> The VAT percentage is not reflecting correctly on the page.</p>
          <p><strong>Solution:</strong> Verify that the VAT data is correctly fetched and updated in the component. Ensure that the page is properly reloaded or refreshed after the update.</p>`
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

  loadVAT(): void {
    this.vatService.getVAT().subscribe((vat: VAT) => {
      this.vat = vat;
      console.log("LoadedVAT:", vat)
      this.vatForm.patchValue({
        vaT_Percentage: vat.vaT_Percentage,
        vaT_Date: vat.vaT_Date
      });
    });
  }

  openEditModal(): void {
    $('#editModal').modal('show');
  }

  updateVAT(): void {
    if (this.vatForm.valid && this.vat) {
      const updatedVAT: VAT = {
        vaT_ID: this.vat.vaT_ID,
        vaT_Percentage: this.vatForm.value.vaT_Percentage,
        vaT_Date: new Date()
      };
      this.vatService.updateVAT(this.vat.vaT_ID, updatedVAT).subscribe({
        next: (response) => {
          console.log("UpdatedVAT", response );
          this.snackBar.open('VAT updated successfully', 'Close', { duration: 5000 });
          this.loadVAT();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          this.snackBar.open(error, 'Close', { duration: 5000 });
          console.error('UpdateFailed', error);
          this.snackBar.open('Failed to update VAT. Please try again', 'Close', { duration: 5000 });
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
