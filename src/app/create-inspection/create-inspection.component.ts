import { Component, OnInit } from '@angular/core';
import { NgModel, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inspection } from '../shared/inspection';
import { InspectionService } from '../Services/inspection.service';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { InspectionTypeAndStatusService } from '../Services/inspection-type-and-status.service';
import { InspectionStatus } from '../shared/ispectionStatus';
import { InspectionType } from '../shared/inspectionType';
import { Equipment } from '../shared/equipment';
import { EquipmentService } from '../Services/equipment.service';
import { InventoryService } from '../Services/inventory.service';
import { InventoryViewModel } from '../shared/inventoryViewModel';
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-inspection',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './create-inspection.component.html',
  styleUrl: './create-inspection.component.css'
})
export class CreateInspectionComponent {

  inspection_ID!:0;
  inspection_Date!:Date;
  inspection_Notes!:"";
  equipment_ID!:0;
  inventory_ID!:0;
  inspection_Type_ID!:0;
  inspection_Status_ID!:0;
  addForm!: FormGroup;

  statuses:InspectionStatus [] = []
  types: InspectionType [] =[]
  equipments:Equipment [] = []
  inventories: InventoryViewModel[]=[]
  filter!:string;
  registerFormGroup: FormGroup;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];
  minDate!: string;
  dialogRef: any;


  constructor(private inspectionService:InspectionService, private insepctionTypeAndStatusService:InspectionTypeAndStatusService, private equipmentService:EquipmentService, private router:Router, private dialog:MatDialog, private inventoryService:InventoryService, private route: ActivatedRoute, private fb: FormBuilder){
    

    this.registerFormGroup = this.fb.group({

      
      date:[null, Validators.required],
      notes:['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      type: [null, Validators.required],
      status: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params['Inventory']) {
        this.filter = params['Inventory'];
      } else if (params['Equipment']) {
        this.filter = params['Equipment'];
      } 
      this.getData(this.filter)
     
    });

    console.log('Statuses:', this.statuses);
    console.log('Types:', this.types);
    console.log('Equpiments:', this.equipments);

    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Initialize help content
this.helpContent = [
  {
    title: 'Create Inspection Page Overview',
    content: `
      <p><strong>Overview:</strong> The Create Inspection page allows users to log inspections for equipment or inventory items. Users need to fill out the form with the inspection date, notes, type, status, and either equipment or inventory item, depending on the filter selection.</p>`
  },
  {
    title: '1. Inspection Date',
    content: `
      <ul>
        <li><strong>Field:</strong> Select the date of the inspection in the "Inspection Date" field.</li>
        <li><strong>Requirements:</strong> This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the date is left empty, an error message will be displayed, indicating that the date is required.</li>
      </ul>`
  },
  {
    title: '2. Inspection Notes',
    content: `
      <ul>
        <li><strong>Field:</strong> Enter notes about the inspection in the "Notes" field.</li>
        <li><strong>Requirements:</strong> The notes must be between 2 and 20 characters long. This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the notes are left empty, or do not meet the length requirements, error messages will be displayed, indicating the problem.</li>
      </ul>`
  },
  {
    title: '3. Inspection Type',
    content: `
      <ul>
        <li><strong>Field:</strong> Select the type of inspection from the "Inspection Type" dropdown menu.</li>
        <li><strong>Requirements:</strong> This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the type is not selected, an error message will be displayed, indicating that the type is required.</li>
      </ul>`
  },
  {
    title: '4. Inspection Status',
    content: `
      <ul>
        <li><strong>Field:</strong> Select the status of the inspection from the "Inspection Status" dropdown menu.</li>
        <li><strong>Requirements:</strong> This field is mandatory.</li>
        <li><strong>Error Messages:</strong> If the status is not selected, an error message will be displayed, indicating that the status is required.</li>
      </ul>`
  },
  {
    title: '5. Equipment or Inventory Selection',
    content: `
      <ul>
        <li><strong>Field:</strong> Depending on the inspection you're performing, choose the appropriate item from the dropdown menu.</li>
        <li><strong>Requirements:</strong> Either an equipment or an inventory item must be selected. This field is mandatory based on the filter.</li>
        <li><strong>Error Messages:</strong> If the appropriate item is not selected, an error message will be displayed, indicating that the selection is required.</li>
      </ul>`
  },
  {
    title: '6. Form Submission',
    content: `
      <ul>
        <li><strong>Add Button:</strong> Once all fields are correctly filled out, the "Add" button will become active. Clicking it will submit the form and add the inspection record to the system.</li>
        <li><strong>Cancel Button:</strong> Depending on the selected filter, the "Cancel" button will either redirect to the equipment list or the inventory list without saving any changes.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What if I make a mistake while filling out the form?</p>
      <p><strong>A:</strong> You will need to contact an administrator or someone with the correct permissions to make chnages to the inspection details.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Add" button is disabled and I can’t submit the form.</p>
      <p><strong>Solution:</strong> Ensure all mandatory fields (Date, Notes, Type, Status, and the appropriate selection based on the filter) are filled out correctly. The form will only allow submission when all conditions are met.</p>`
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

  getData(filter:string){
    this.insepctionTypeAndStatusService.GetTypes().subscribe(result => {
      let typesList:any[] = result;
    
      typesList.forEach((element) => {
        this.types.push(element)
      });
      
    })

    this.insepctionTypeAndStatusService.GetStatuses().subscribe(result => {
      let statusList:any[] = result;
    
      statusList.forEach((element) => {
        this.statuses.push(element)
      });
      
    })

    if(filter == "Inventory"){

      this.inventoryService.GetItems().subscribe(result => {
        let inventoryList:any[] = result.value;
      
        inventoryList.forEach((element) => {
          this.inventories.push(element)
        });
        
      })

    } else if(filter == "Equipment"){
      this.equipmentService.GetEquipments().subscribe(result => {
        let equipmentList:any[] = result;
      
        equipmentList.forEach((element) => {
          this.equipments.push(element)
        });
        
      })
    }

    
  }
  
  addInspection(inspeactionDate: Date, notes: String, equipmentID: Number, inspectionTypeID: Number, inspectionStatus_ID: Number, inventory_ID: Number) {
  
    if(equipmentID == null){
      equipmentID == null
    }else if (inventory_ID == null){
      inventory_ID == null;
    }
    // Prepare the new inspection object
    const newInspection: Inspection = {
      inspection_ID: 0,
      inspection_Date: inspeactionDate,
      inspection_Status_ID: inspectionStatus_ID,
      equipment_ID: equipmentID,
      inventory_ID: inventory_ID ,
      inspection_Notes: notes,
      inspection_Type_ID: inspectionTypeID,
    };
  
    console.log('New Inspection', newInspection);
    
   


    if(this.filter == "Equipment"){
       this.dialogRef = this.dialog.open(ConfirmDialogComponent, { 
        data: { message: 'Are you sure you want to create this inspection?' } 
      });
    }else{
       this.dialogRef = this.dialog.open(ConfirmDialogComponent, { 
        data: { message: 'Are you sure you want to create this inventory take?' } 
      });
    
    }
    // Open the confirmation dialog
   
    // Handle the result of the confirmation dialog
    this.dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // If the user confirms, proceed with adding the inspection
        this.inspectionService.AddInspection(newInspection).subscribe(
          (result: Inspection) => {
            // Navigate and show a success message after successful creation
            if (this.filter == "Inventory") {
              this.router.navigateByUrl('/inventory');
              this.dialog.open(SuccessDialogComponent, { data: { message: 'Inventory Take successfully created!' } });
            //console.log('Inspection Added', result);
            } else {
              this.router.navigateByUrl('/equipment');
              this.dialog.open(SuccessDialogComponent, { data: { message: 'Inspection successfully created!' } });
            }
           
            //console.log('Inspection Added', result);
          },
          (error: HttpErrorResponse) => {
            this.dialog.open(ErrorDialogComponent, { 
              data: { message: error.error || 'An unexpected error occurred Please try again.' } 
            });
           // alert(error.error);
            console.log('Error:', error.error);
          }
        );
      }
    });
  }
  
}




