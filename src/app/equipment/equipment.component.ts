import { Component, OnInit } from '@angular/core';
import { Equipment } from '../shared/equipment';
import { EquipmentService } from '../Services/equipment.service';
import { NgFor, NgIf } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css'
})
export class EquipmentComponent implements OnInit {

  equipments:Equipment[]=[];
  showModal: boolean = false;
  equipment: Equipment={
    equipment_ID:0,
    equipment_Name:'',
    equipment_Description:'',
    size:''
  }
  filteredequipment: Equipment[] = [];
  searchTerm: string = '';
  userTypeID: number | null = null;
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private equipmentService:EquipmentService, private elementRef:ElementRef, private dialog:MatDialog) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.GetEquipments();
    console.log('Equpiments:',this.equipments);

    // Initialize help content
this.helpContent = [
  {
    title: 'Equipment Page Overview',
    content: `
      <p><strong>Overview:</strong> The Equipment page allows users to manage the details of equipment in the system. Users can search, view, edit, or delete equipment and also create new equipment or inspections.</p>`
  },
  {
    title: '1. Search and Filter Equipment',
    content: `
      <ul>
        <li><strong>Search Bar:</strong> Use the search bar to filter equipment by name. As you type, the list of equipment will update automatically to show matching results.</li>
      </ul>`
  },
  {
    title: '2. Create New Entries',
    content: `
      <ul>
        <li><strong>Create Equipment:</strong> Click the "Create Equipment" button to add new equipment to the system. This will navigate you to the equipment creation form.</li>
        <li><strong>Create Inspection:</strong> Use the "Create Inspection" button to initiate a new inspection for a selected piece of equipment.</li>
      </ul>`
  },
  {
    title: '3. Equipment Table Actions',
    content: `
      <ul>
        <li><strong>View Equipment:</strong> Click the "View" button in the Actions column to open a detailed view of the selected equipment, including its description and size.</li>
        <li><strong>Edit Equipment:</strong> Use the "Edit" button to modify the details of an existing piece of equipment. This will navigate you to the equipment edit form.</li>
        <li><strong>Delete Equipment:</strong> Click the "Delete" button to remove a piece of equipment from the system. You will be prompted to confirm this action.</li>
      </ul>`
  },
  {
    title: '4. Equipment Details Modal',
    content: `
      <p><strong>Modal Window:</strong> When viewing equipment details, a modal window will appear, showing the equipment name, description, and size. The modal can be closed by clicking the "Close" button.</p>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I edit an existing equipment entry?</p>
      <p><strong>A:</strong> Find the equipment in the table, then click the "Edit" button in the Actions column. This will open the edit form where you can make changes and save them.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The equipment list is not updating when I search.</p>
      <p><strong>Solution:</strong> Ensure the search term is spelled correctly and that there are matching entries in the equipment list.</p>`
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

  viewEquipment(id:Number){
    this.equipmentService.GetEquipment(id).subscribe(result => {
     
      this.equipment = result;
      
      
     this.open();
      console.log('Equipment',this.equipment)
     })
  }


  filterEquipment(): void {
    if (!this.searchTerm) {
      this.filteredequipment = [...this.equipments];
    } else {
      console.log('Search Term', this.searchTerm)
      const term = this.searchTerm.toLowerCase();
      this.filteredequipment = this.filteredequipment.filter(equipment =>
        equipment.equipment_Name.includes(term) ||
        equipment.equipment_ID.toString().includes(term) 
      );
    }
  }
  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.equi-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.equi-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;
  }

  GetEquipments()
  {
    this.equipmentService.GetEquipments().subscribe(result => {
      let equipmentList:any[] = result;
    
      equipmentList.forEach((element) => {
        this.equipments.push(element);
        this.filteredequipment = [...this.equipments];
        
      });
      
    })

    
  }


  deleteEquipment(id: Number) {
    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to delete this Equipment?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.equipmentService.DeleteEquipment(id).subscribe((result: Equipment) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Equipment successfully deleted!' } });
          setTimeout(() => {
            location.reload();
        }, 1000)
          console.log('Equipment deleted!', result);
        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
          console.log('Error:', error.error);
        });
      }
    });
  }
  


}
