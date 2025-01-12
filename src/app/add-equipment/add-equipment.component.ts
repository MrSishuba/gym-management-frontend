import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgModel,  } from '@angular/forms';
import { EquipmentService } from '../Services/equipment.service';
import { Equipment } from '../shared/equipment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-equipment.component.html',
  styleUrl: './add-equipment.component.css'
})
export class AddEquipmentComponent implements OnInit {
  equipmentName: String = '';
  equipmentDescription: String = '';
  equipmentSize: String = '';
  addForm!: FormGroup;
  equipmentFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor(private equipemntService:EquipmentService, private router:Router, private dialog:MatDialog,  private fb: FormBuilder,){
    this.equipmentFormGroup = this.fb.group({

      name:['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      size:['', [ Validators.minLength(2), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
      // Initialize help content
this.helpContent = [
  {
    title: 'Create Equipment Page Overview',
    content: `
      <p><strong>Overview:</strong> The Create Equipment page allows users to add new equipment to the system. Users need to fill out the form with the equipment name, description, and size, ensuring all fields meet the required criteria.</p>`
  },
  {
    title: '1. Equipment Name',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter the name of the equipment in the "Equipment Name" field.</li>
        <li><strong>Requirements:</strong> The name must be between 2 and 20 characters long. This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the name is left empty, or does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '2. Equipment Description',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter a brief description of the equipment in the "Equipment Description" field.</li>
        <li><strong>Requirements:</strong> The description must be between 10 and 100 characters long. This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the description is left empty, or does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '3. Equipment Size',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter the size of the equipment in the "Equipment Size" field (e.g., 10KG).</li>
        <li><strong>Requirements:</strong> The size must be between 2 and 10 characters long. This field is optional, but if filled out, it must meet these criteria.</li>
        <li><strong>Error Messages:</strong> If the size does not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '4. Form Submission',
    content: `
      <ul>
        <li><strong>Add Button:</strong> Once all fields are correctly filled out, the "Add" button will become active. Clicking it will submit the form and add the new equipment to the system.</li>
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
      <p><strong>Problem:</strong> The "Add" button is disabled and I can’t submit the form.</p>
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

  addEquipment(equipmentName:String, equipmentDescription:String,equipmentSize:String ){

    const newEquipment: Equipment ={
      equipment_ID:0,
      equipment_Name: equipmentName,
      equipment_Description: equipmentDescription,
      size: equipmentSize
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: { message: 'Are you sure you want to add this Equipment?' }});
    
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.equipemntService.AddEquipment(newEquipment).subscribe({
          next: (result: Equipment) => {
            this.router.navigateByUrl('/equipment');
            console.log('Equipment Added', result);
            this.dialog.open(SuccessDialogComponent, {data: { message: 'Equipment successfully added!' }});
          },
          error: (error: HttpErrorResponse) => {
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
          },
          
        });
      }
    });
    



  }









}
