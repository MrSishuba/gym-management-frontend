import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Discount } from '../shared/payment';
import { PaymentService } from '../Services/payment.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
declare var $: any; 

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css'
})
export class DiscountComponent implements OnInit{
  userTypeID: number | null = null;
  discount: Discount | undefined;
  discountForm: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private discountService: PaymentService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private location: Location) {
    this.discountForm = this.fb.group({
      discount_Percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadDiscount();

    // Initialize help content
    this.helpContent = [
      {
        title: 'Discount Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Manage Discount page allows you to view and update the discount code and percentage applied in your system. You can manage the discount details, including the discount percentage and its validity period, through the provided interface.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Current Discount Code',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays the current discount code being applied.</li>
            <li><strong>Usage:</strong> This field shows the current discount code. It is a unique identifier for the discount applied to transactions.</li>
          </ul>`
      },
      {
        title: '2. Current Discount Percentage',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Shows the percentage of discount currently applied.</li>
            <li><strong>Usage:</strong> This field displays the discount percentage as a numerical value (e.g., 15 for a 15% discount).</li>
          </ul>`
      },
      {
        title: '3. Start Date',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Indicates the start date when the current discount became effective.</li>
            <li><strong>Usage:</strong> This field shows the date when the discount was first applied.</li>
          </ul>`
      },
      {
        title: '4. End Date',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Indicates the end date when the current discount will no longer be applicable.</li>
            <li><strong>Usage:</strong> This field shows the date when the discount will expire.</li>
          </ul>`
      },
      {
        title: '5. Update Discount Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal to allow you to update the discount settings.</li>
            <li><strong>Usage:</strong> Click the "Update Discount" button to open the modal where you can change the discount percentage and update the settings.</li>
          </ul>`
      },
      {
        title: 'Edit Modal',
        content: `
          <ul>
            <li><strong>Discount Percentage Input:</strong>
              <ul>
                <li><strong>Purpose:</strong> Allows you to enter a new discount percentage.</li>
                <li><strong>Usage:</strong> Input the new discount percentage value. It must be between 0 and 100. Ensure the value is correct as it directly affects discount calculations.</li>
              </ul>
            </li>
            <li><strong>Update Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Saves the updated discount percentage and applies the changes.</li>
                <li><strong>Usage:</strong> Click the "Update" button to save the new discount percentage. This action updates the discount settings in the system.</li>
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
          <p><strong>Q:</strong> How do I update the discount percentage?</p>
          <p><strong>A:</strong> Click the "Update Discount" button to open the modal. Enter the new discount percentage and click "Update" to save the changes.</p>
          <p><strong>Q:</strong> What if the discount percentage input is invalid?</p>
          <p><strong>A:</strong> The form validation ensures that the discount percentage is between 0 and 100. If the input is invalid, error messages will be displayed indicating the specific validation issue (e.g., "Discount Percentage cannot be less than 0" or "Discount Percentage cannot be more than 100").</p>
          <p><strong>Q:</strong> How will I know if the discount update was successful?</p>
          <p><strong>A:</strong> After a successful update, a snackbar message will appear confirming the discount update. The updated discount details will be reflected immediately on the page.</p>
          <p><strong>Q:</strong> What happens if the update fails?</p>
          <p><strong>A:</strong> If the update fails, an error message will be displayed. Ensure your network connection is stable and the server is operational. Check the console for specific error details.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The discount percentage is not updating.</p>
          <p><strong>Solution:</strong> Ensure that the Update method in the discount service is functioning correctly and that the modal form is properly submitted. Check network requests for errors and verify the backend response.</p>
          <p><strong>Problem:</strong> The discount details are not reflecting correctly on the page.</p>
          <p><strong>Solution:</strong> Verify that the discount data is correctly fetched and updated in the component. Ensure that the page is properly reloaded or refreshed after the update.</p>`
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

  loadDiscount(): void {
    this.discountService.getDiscount().subscribe((discount: Discount) => {
      this.discount = discount;
      console.log("LoadedDiscount:", discount)
      this.discountForm.patchValue({
        discount_Percentage: discount.discount_Percentage,
        discount_Date: discount.discount_Date
      });
    });
  }

  openEditModal(): void {
    $('#editModal').modal('show');
  }

  updateDiscount(): void {
    if (this.discountForm.valid && this.discount) {
      const updatedDiscount: Discount = {
        discount_ID: this.discount.discount_ID,
        discount_Code: this.discount.discount_Code,
        discount_Percentage: this.discountForm.value.discount_Percentage,
        discount_Date: new Date(),
        end_Date: new Date(new Date().setDate(new Date().getDate() + 30))
      };
      this.discountService.updateDiscount(this.discount.discount_ID, updatedDiscount).subscribe({
        next: (response) => {
          console.log("UpdatedDiscount", response );
          this.snackBar.open('Discount updated successfully', 'Close', { duration: 5000 });
          this.loadDiscount();
          $('#editModal').modal('hide');
        },
        error: (error) => {
          console.error('UpdateFailed', error);
          this.snackBar.open('Failed to update Discount. Please try again', 'Close', { duration: 5000 });
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
