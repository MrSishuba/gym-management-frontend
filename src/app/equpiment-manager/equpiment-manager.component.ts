import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RouterLink, Router } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equpiment-manager',
  standalone: true,
  imports: [CommonModule, MasterSideNavBarComponent, SideNavBarComponent,MatCard, MatCardModule, RouterLink,FormsModule],
  templateUrl: './equpiment-manager.component.html',
  styleUrl: './equpiment-manager.component.css'
})
export class EqupimentManagerComponent {
  
  userTypeID: number | null = null;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

  constructor(private router:Router){}
  
  ngOnInit() {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    // Initialize help content
this.helpContent = [
  {
    title: 'Equipment Manager Overview',
    content: `
      <p><strong>Overview:</strong> The Equipment Manager page allows users to manage equipment and inspections within the system. From this page, users can navigate to view and manage equipment or perform inspections.</p>`
  },
  {
    title: '1. Navigation Options',
    content: `
      <ul>
        <li><strong>Equipment:</strong>
          <ul>
            <li>Click the "Equipment" menu item to view and manage all equipment available in the system.</li>
            <li>The icon next to the Equipment label represents tools, making it easy to identify.</li>
          </ul>
        </li>
        <li><strong>Inspections:</strong>
          <ul>
            <li>Select the "Inspections" menu item to navigate to the inspection management section.</li>
            <li>This option includes an icon of a clipboard with a checkmark, signifying inspection tasks.</li>
          </ul>
        </li>
      </ul>`
  },
  {
    title: '2. Header and Search Functionality',
    content: `
      <ul>
        <li><strong>Go Back:</strong> The back arrow icon in the header allows you to navigate back to the previous page.</li>
        <li><strong>Header Title:</strong> The header title "Equipment Manager" clearly indicates the current page's function.</li>
      </ul>`
  },
  {
    title: '3. User Interface',
    content: `
      <ul>
        <li><strong>Menu Container:</strong> The menu container presents the two main options for managing equipment and inspections, structured in a clear and easy-to-use layout.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I add new equipment?</p>
      <p><strong>A:</strong> Navigate to the "Equipment" section by clicking on the Equipment menu item. From there, you can view and manage equipment, including adding new items.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The Inspections section is not loading properly.</p>
      <p><strong>Solution:</strong> Ensure that there have been equipment isnpections. If the issue persists please contact an administrator.</p>`
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
    const userTypeId = JSON.parse(localStorage.getItem('User')!).userTypeId;
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    if (userTypeId === 1) {  // Ensure userTypeID is compared as string
      this.router.navigateByUrl(`/OwnerHome/${userId}`);
    } else if (userTypeId === 2) {
      this.router.navigateByUrl(`/EmployeeHome/${userId}`);
    } else if (userTypeId === 3) {
      this.router.navigateByUrl(`/Home/${userId}`);
    }
  }
}
