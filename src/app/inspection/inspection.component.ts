import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Workout } from '../shared/workout';
import { ElementRef } from '@angular/core'
import { InspectionViewModel } from '../shared/inspectionViewModel';
import { InspectionService } from '../Services/inspection.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { ɵSafeHtml } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Time } from "@angular/common";
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';



@Component({
  selector: 'app-inspection',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, MatDatepicker,FormsModule,CommonModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './inspection.component.html',
  styleUrl: './inspection.component.css'
})
export class InspectionComponent implements OnInit {
inspections: InspectionViewModel[] = []

inspection: InspectionViewModel ={
  //inspection_Date: Date.UTC(2),
  inspection_notes: '',
  equipment_name: '',
  inspection_status: '',
  inspection_type_name: '',
  inspection_ID: 0,
  inspection_Date: new Date(),
  equipment_id: 0,
  inventory_id: 0,
  inspection_Type_id: 0,
  inpection_status_id: 0,
  inventory_name: '',
  inventory_category: ''
}

inspectionType!: string;
filteredInspections: InspectionViewModel[] = [];
searchTerm: string = '';
filter!:string;
userTypeID!:number;
helpContent: any[] = [];
filteredContent: any[] = [];
showModal: boolean = false;

  constructor (private inspectionService:InspectionService, private elementRef: ElementRef, private route: ActivatedRoute){}


  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    this.route.params.subscribe(params => {
     // this.inspectionType = params['booking_ID'];
      
        if (params['Inventory']) {
          this.filter = params['Inventory'];
        } else if (params['Equipment']) {
          this.filter = params['Equipment'];
        } 
    
    });
    this.getInspection();
    console.log('Inspections',this.inspections);

    // Initialize help content
this.helpContent = [
  {
    title: 'Inspections Page Overview',
    content: `
      <p><strong>Overview:</strong> The Inspections page allows users to view and manage inspection records for equipment or inventory items. Users can search for inspections, view details, and access actions for each inspection based on the selected filter.</p>`
  },
  {
    title: '1. Search Inspection',
    content: `
      <ul>
        <li><strong>Field:</strong> Use the "Search Inspection" input field to filter inspections by ID or name.</li>
        <li><strong>Requirements:</strong> The search is case-insensitive and will display results dynamically as you type.</li>
      </ul>`
  },
  {
    title: '2. Inspection Table',
    content: `
      <ul>
        <li><strong>Columns:</strong> The table displays the following columns: ID, Date, Equipment/Item Name, Inspection Type, Inspection Status, and Actions.</li>
        <li><strong>Visibility:</strong> The "Equipment Name" or "Item Name" column is displayed based on the selected filter (Equipment or Inventory).</li>
        <li><strong>Actions:</strong> Each inspection has a "View" button, which opens a modal with detailed information.</li>
      </ul>`
  },
  {
    title: '3. Viewing Inspection Details',
    content: `
      <ul>
        <li><strong>Modal Display:</strong> Clicking the "View" button opens a modal that shows inspection details including date, notes, type, and status.</li>
        <li><strong>Conditional Content:</strong> The modal displays specific details based on whether the selected filter is Equipment or Inventory.</li>
        <li><strong>Close Button:</strong> Click the "Close" button to exit the modal and return to the inspections table.</li>
      </ul>`
  },
  {
    title: '4. Filtering Inspections',
    content: `
      <ul>
        <li><strong>Filter Selection:</strong> The inspections displayed are determined by the selected filter (Equipment or Inventory) from the header.</li>
        <li><strong>Dynamic Updates:</strong> The table updates automatically based on the selected filter, showing relevant inspections.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How can I quickly find a specific inspection?</p>
      <p><strong>A:</strong> Use the "Search Inspection" field to type in keywords, which will filter the results in real-time.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> I cannot find an inspection I know exists.</p>
      <p><strong>Solution:</strong> Ensure you are view the correct inspection page. Inspections related to "Equipemnt" can be found in the "Equipment Manager" in the "Inspections" tab. Inspections related to "Inventory" can be found in the "Inventory Manager" in the "Inspections" tab.</p>`
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
  getInspection() {
    this.inspectionService.GetInspections().subscribe(
      result => {
        let inspetionList:any[] = result;
    
        inspetionList.forEach((element) => {
          this.inspections.push(element);
          this.filteredInspections.push(element);
        });
  });
  }

  viewInspection(id:Number){
    this.inspectionService.GetInspection(id).subscribe(result => {
     
      this.inspection = result.value[0];
     
      
     this.open();
      console.log('Inspection',this.inspection)
     })
  }

  filterInspection(): void {
    if (!this.searchTerm) {
      this.filteredInspections = this.inspections;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredInspections = this.filteredInspections.filter(inspect =>
        inspect.equipment_name.includes(term) || inspect.inspection_ID.toString().includes(term)
        //inspect.inspection_ID.toString().includes(term) ||  inspect.equipment_id.toString().includes(term)
      );
    }
  }


  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.insp-modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.insp-modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }

}
