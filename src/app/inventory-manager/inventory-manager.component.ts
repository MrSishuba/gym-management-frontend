import { Component, ViewChild } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RouterLink, Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { InventoryComponent } from '../inventory/inventory.component';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';
import { InventoryService } from '../Services/inventory.service';
import { IonicModule } from '@ionic/angular';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-inventory-manager',
  standalone: true,
  imports: [CommonModule, SideNavBarComponent, MasterSideNavBarComponent, MatCard, MatCardModule, RouterLink, IonicModule, FormsModule],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.css'
})
export class InventoryManagerComponent {
  userTypeID: number | null = null;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
 
  constructor (private router:Router){}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    // Initialize help content
this.helpContent = [
  {
    title: 'Menu Overview',
    content: `
      <p><strong>Overview:</strong> The menu provides quick access to different sections of the application, including Suppliers, Inventories, Products, and Inspections. Each menu item is designed to navigate the user to the relevant management page.</p>`
  },
  {
    title: '1. Suppliers',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "Suppliers" tab to access the supplier hub, where you can manage supplier information and accept or reject orders.</li>
      </ul>`
  },
  {
    title: '2. Inventories',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "Inventories" item to view and manage inventory items.</li>
      </ul>`
  },
  {
    title: '3. Products',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "Products" item to access the product manager for overseeing product details and managing products.</li>
      </ul>`
  },
  {
    title: '4. Inventory Takes',
    content: `
      <ul>
        <li><strong>Navigation:</strong> Click on the "Inventory Takes" item to manage inventory takes related to inventory items.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> How do I navigate to a different section of the manager?</p>
      <p><strong>A:</strong> Click on any menu item to navigate directly to the corresponding management page.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The menu items are not responsive or clickable.</p>
      <p><strong>Solution:</strong> Ensure that your browser is updated and that there are no overlay issues with other components. Refreshing the page might also resolve the issue.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

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

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }

}
