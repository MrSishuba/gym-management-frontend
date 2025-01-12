import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-hub',
  standalone: true,
  imports: [RouterLink, SideNavBarComponent, MasterSideNavBarComponent, FormsModule, CommonModule],
  templateUrl: './supplier-hub.component.html',
  styleUrl: './supplier-hub.component.css'
})
export class SupplierHubComponent implements OnInit{
  userTypeID: number | null = null;
  
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    // Initialize help content
this.helpContent = [
  {
    title: 'Supplier Hub Overview',
    content: `
      <p><strong>Overview:</strong> The Supplier Hub is your central location for managing suppliers and their supplies. This interface allows you to view and handle all supplier-related tasks efficiently.</p>`
  },
  {
    title: '1. Return to Inventory Manager',
    content: `
      <ul>
        <li><strong>Back Navigation:</strong> Click on the back arrow icon (<i class="bi bi-arrow-left-circle"></i>) to return to the Inventory Manager page.</li>
      </ul>`
  },
  {
    title: '2. Supplier Management',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "AVS Fitness Suppliers" item (represented by a people icon) to access the list of all suppliers associated with AVS Fitness.</li>
        <li><strong>Icon:</strong> The people icon indicates the suppliers section.</li>
      </ul>`
  },
  {
    title: '3. Incoming Supplies Ordered',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "Incoming Supplies Ordered" item (represented by a box icon) to view and manage the supplies that have been ordered from suppliers.</li>
        <li><strong>Icon:</strong> The box icon symbolizes the supplies section.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I manage my suppliers effectively?</p>
      <p><strong>A:</strong> Use the options in the Supplier Hub to view suppliers and manage incoming supplies efficiently.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> I can't access the supplier information.</p>
      <p><strong>Solution:</strong> Ensure that you have the necessary permissions to view supplier data. If issues persist, check your internet connection or refresh the page.</p>`
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

  goBack() {
    this.location.back();
  }

}
