import { Component, OnInit } from '@angular/core';
import { Equipment } from '../shared/equipment';
import { EquipmentService } from '../Services/equipment.service';
import { ActivatedRoute, InitialNavigation } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';
import {HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-edit-equipment',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-equipment.component.html',
  styleUrl: './edit-equipment.component.css'
})
export class EditEquipmentComponent implements OnInit {

  equipment:Equipment ={
    equipment_ID:0,
    equipment_Name:'',
    equipment_Description:'',
    size:''
  };
  equipmentID!:Number;
  registerFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor(private equipmentService: EquipmentService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog,  private fb: FormBuilder) { 
    this.registerFormGroup = this.fb.group({
     
   
      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      size:['', [Validators.minLength(2), Validators.maxLength(10)]],
    });
  }

  ngOnInit():void{
      
    this.route.params.subscribe(params => {
      this.equipmentID = params['equipment_ID'];
      this.getEquipement(this.equipmentID);
    });

      // Initialize help content
this.helpContent = [
  {
    title: 'Edit Equipment Page Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Equipment page allows users to update existing equipment to the system. Users need can fill out the form with the equipment name, description, and size, ensuring all fields meet the required criteria.</p>`
  },
  {
    title: '1. Equipment Name',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter the updated name of the equipment in the "Equipment Name" field.</li>
        <li><strong>Requirements:</strong> The name must be between 2 and 20 characters long. This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the name is left empty, or does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '2. Equipment Description',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter an updated brief description of the equipment in the "Equipment Description" field.</li>
        <li><strong>Requirements:</strong> The description must be between 10 and 100 characters long. This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the description is left empty, or does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '3. Equipment Size',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter the new or updated size of the equipment in the "Equipment Size" field (e.g., 10KG).</li>
        <li><strong>Requirements:</strong> The size must be between 2 and 10 characters long. This field is optional, but if filled out, it must meet these criteria.</li>
        <li><strong>Error Messages:</strong> If the size does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '4. Form Submission',
    content: `
      <ul>
        <li><strong>Save Button:</strong> The "Save" button stays active unless the necessary inputs are removed or aren't input. Clicking it will submit the form and save the changes to the equipment to the system.</li>
        <li><strong>Cancel Button:</strong> If you wish to cancel the creation process, click the "Cancel" button to return to the equipment list without saving any changes.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What if I don’t know the exact size of the equipment?</p>
      <p><strong>A:</strong> The "Equipment Size" field is optional, so you can leave it blank if you are unsure. You can always update the size later by editing the equipment entry.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Save" button is disabled and I can’t submit the form.</p>
      <p><strong>Solution:</strong> Ensure all mandatory fields (Equipment Name and Description) are filled out correctly and meet the required length criteria. The form will only allow submission when all conditions are met.</p>`
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
  getEquipement(id: Number): void {
    this.equipmentService.GetEquipment(id).subscribe(result => {
      this.equipment = result;
      console.log('Equipment', this.equipment)
    });
  }


  updateEquipment(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Equipment?' } 
    });

    console.log(this.equipment);
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Proceed with updating the equipment if confirmed
        this.equipmentService.UpdateEquipment(id, this.equipment).subscribe(
          (result: Equipment) => {
            // Show success message after successful update
            this.dialog.open(SuccessDialogComponent, { data: { message: 'Equipment successfully updated!' } });
            console.log('Equipment Updated', result);
            this.router.navigateByUrl('/equipment');
          },
          (error: HttpErrorResponse) => {
            // Handle error
            alert(error.error);
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  
}
