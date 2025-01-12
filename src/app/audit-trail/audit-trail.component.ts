import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { Location } from '@angular/common';
import { AuditTrailService } from '../Services/audit-trail.service';
import { AuditTrail } from '../shared/audit-trail';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MasterSideNavBarComponent, SideNavBarComponent, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './audit-trail.component.html',
  styleUrl: './audit-trail.component.css'
})
export class AuditTrailComponent implements OnInit{
  
  userTypeID: number | null = null;
  displayedColumns: string[] = ['audit_Trail_ID', 'transaction_Type', 'timestamp', 'changed_By', 'critical_Data', 'table_Name'];
  dataSource = new MatTableDataSource<AuditTrail>();
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private auditTrailService: AuditTrailService, private location: Location) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.dataSource.filterPredicate = (data: AuditTrail, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return data.audit_Trail_ID.toString().includes(transformedFilter) ||
             data.transaction_Type.toLowerCase().includes(transformedFilter) ||
             data.changed_By.toLowerCase().includes(transformedFilter) ||
             data.critical_Data?.toLowerCase().includes(transformedFilter) ||
             data.table_Name.toLowerCase().includes(transformedFilter);
    };

    this.auditTrailService.getAuditTrails().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;

    });

    // Initialize help content
    this.helpContent = [
      {
        title: 'Audit Trail Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Audit Trail page provides a detailed record of all changes and transactions within the system. It helps track modifications, view transaction types, and understand who made specific changes.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Allows users to search for specific entries in the audit trail.</li>
            <li><strong>Usage:</strong> Enter search terms related to audit trail entries. The search will filter results based on the ID, transaction type, date, changed by, critical data, and table name.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific terms to refine your search results.</li>
                <li>Ensure that search terms are correctly spelled and formatted.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Audit Trail Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a tabular view of audit trail entries.</li>
            <li><strong>Usage:</strong> The table includes several columns, each providing specific details about the audit entries.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Review entries carefully to understand the context of changes and transactions.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Table Columns',
        content: `
          <ul>
            <li><strong>ID Column:</strong> Shows the unique identifier for each audit trail entry. This ID is used to reference specific audit entries.</li>
            <li><strong>Transaction Type Column:</strong> Displays the type of transaction or change recorded. This field provides context on what kind of action was taken (e.g., update, delete).</li>
            <li><strong>Date Column:</strong> Shows the timestamp when the transaction or change occurred. This field provides the exact date and time of the audit entry.</li>
            <li><strong>Changed By Column:</strong> Indicates who made the change or performed the transaction. Displays the username or identifier of the person responsible for the audit entry.</li>
            <li><strong>Critical Data Column:</strong> Contains data that was modified or is relevant to the audit trail entry. This field shows specific details or values that were altered.</li>
            <li><strong>Table Name Column:</strong> Identifies the database table where the change or transaction took place. Shows which table in the database was affected by the audit entry.</li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I filter the audit trail entries?</p>
          <p><strong>A:</strong> Use the search bar to enter search terms related to the audit trail. The table will update to display entries that match your search criteria.</p>
          <p><strong>Q:</strong> What if I cannot find a specific audit trail entry?</p>
          <p><strong>A:</strong> Ensure that your search terms are accurate and check for any typos. The search is case-insensitive and will filter based on ID, transaction type, changed by, critical data, and table name.</p>
          <p><strong>Q:</strong> How do I navigate through the audit trail records?</p>
          <p><strong>A:</strong> Use the pagination controls at the bottom of the table to navigate through pages of audit trail entries. You can select the number of entries per page (5, 10, or 20) and use the navigation buttons to move between pages.</p>
          <p><strong>Q:</strong> What if the data in the table is not loading?</p>
          <p><strong>A:</strong> Ensure that the getAuditTrails method in AuditTrailService is functioning correctly and that your API is accessible. Check for any network or server errors and ensure that data is correctly passed to the table.</p>
          <p><strong>Q:</strong> How do I go back to the previous page?</p>
          <p><strong>A:</strong> Click the back arrow icon in the header search container to navigate to the previous page.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The audit trail table is not displaying data correctly.</p>
          <p><strong>Solution:</strong> Verify that the getAuditTrails method is retrieving and passing data correctly. Check network requests for errors and ensure the API is functioning.</p>
          <p><strong>Problem:</strong> Search results are not matching expected entries.</p>
          <p><strong>Solution:</strong> Double-check search terms and ensure the search functionality is filtering based on all relevant fields (ID, transaction type, date, changed by, critical data, and table name).</p>`
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

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  goBack(): void {
    this.location.back();
  }

}
