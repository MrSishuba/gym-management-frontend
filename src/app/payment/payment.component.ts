import { Component } from '@angular/core';
import { PaymentService } from '../Services/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
declare var $: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  userTypeID: number | null = null;
  payments: any[] = [];
  selectedPayment: any | null = null;
  filterPayment: any[] = [];
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private paymentService: PaymentService, private router: Router, private location: Location, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.loadPayments();


    // Initialize help content
    this.helpContent = [
      {
        title: 'Payment Manager Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Payment Manager page allows you to view and manage payment records, including searching for specific payments, viewing detailed payment information, and exporting payment data to Excel.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Allows you to search for specific payments by ID, member name, amount, date, or payment type.</li>
            <li><strong>Usage:</strong> Enter your search term into the input field. The list of payments will automatically filter to show matching results based on your search criteria.</li>
          </ul>`
      },
      {
        title: '2. Payment Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a list of all payments with their ID, member name, amount, payment date, payment type, and action buttons.</li>
            <li><strong>Usage:</strong> View details of each payment by clicking the "View" button. The table will update based on the search term entered in the search bar.</li>
          </ul>`
      },
      {
        title: '3. Export to Excel Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Exports the currently displayed payment data to an Excel file.</li>
            <li><strong>Usage:</strong> Click the "Export to Excel" button to generate and download an Excel file containing the filtered payment data.</li>
          </ul>`
      },
      {
        title: '4. Modal for Payment Details',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Provides detailed information about a selected payment.</li>
            <li><strong>Usage:</strong> Click the "View" button next to a payment in the table to open the modal. The modal will display detailed information including Payment ID, Member Name, Amount, Payment Date, and Payment Type. Click "Close" to dismiss the modal.</li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I search for payments?</p>
          <p><strong>A:</strong> Use the search bar at the top of the page. Enter terms such as payment ID, member name, amount, date, or payment type to filter the payments shown in the table.</p>
          <p><strong>Q:</strong> How can I view details of a payment?</p>
          <p><strong>A:</strong> Click the "View" button next to the payment in the table. This will open a modal with detailed information about the selected payment.</p>
          <p><strong>Q:</strong> How do I export payment data to Excel?</p>
          <p><strong>A:</strong> Click the "Export to Excel" button. An Excel file with the filtered payment data will be generated and downloaded to your computer.</p>
          <p><strong>Q:</strong> Why isn't the search working?</p>
          <p><strong>A:</strong> Ensure that you are entering the search terms correctly and that there are payments that match your criteria. Check for any typos or mismatches in the search terms.</p>
          <p><strong>Q:</strong> What should I do if the export to Excel fails?</p>
          <p><strong>A:</strong> Ensure that your browser supports Excel file downloads and that no errors occur during the generation of the file. Verify that the Excel library (XLSX) is correctly integrated and functioning.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The search bar is not filtering results.</p>
          <p><strong>Solution:</strong> Ensure that the search terms are correctly entered and that there are matching payments. Verify that the search functionality is correctly implemented and check for any console errors.</p>
          <p><strong>Problem:</strong> The export to Excel button is not working.</p>
          <p><strong>Solution:</strong> Ensure that the Excel export library (XLSX) is properly integrated and that there are no issues with file generation. Check for network or console errors that might indicate the problem.</p>`
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

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filterPayment = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
      }
    });
  }  

  filteredPayments(): void {
    if (!this.searchTerm) {
      this.filterPayment = this.payments;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filterPayment = this.payments.filter(payment =>
        payment.payment_ID.toString().includes(term) ||
        payment.memberName.toLowerCase().includes(term) ||
        payment.amount.toString().includes(term) ||
        payment.payment_Date.toString().includes(term) ||
        payment.paymentTypeName.toLowerCase().includes(term)
      );
    }
  }
 
  openModal(payment: any): void {
    this.selectedPayment = payment;
    $('#userModal').modal('show');
  }
 
  closeModal(): void {
    $('#userModal').modal('hide');
  }
 
  goBack(): void {
    this.location.back();
  }

  exportToExcel(): void {
    const customHeaders = [
      { header: 'Payment ID', key: 'payment_ID' },
      { header: 'Member Name', key: 'memberName' },
      { header: 'Amount', key: 'amount' },
      { header: 'Payment Date', key: 'payment_Date' },
      { header: 'Payment Type', key: 'paymentTypeName' }
    ];

    const worksheetData = this.filterPayment.map(payment => ({
      payment_ID: payment.payment_ID,
      memberName: payment.memberName,
      amount: payment.amount,
      payment_Date: this.formatDate(payment.payment_Date), // Format the date
      paymentTypeName: payment.paymentTypeName
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: customHeaders.map(h => h.key) });
    const workbook = { Sheets: { 'Payments': worksheet }, SheetNames: ['Payments'] };

    // Modify column headers
    customHeaders.forEach((header, index) => {
      const col = XLSX.utils.encode_col(index); // Convert 0 -> 'A', 1 -> 'B', etc.
      worksheet[`${col}1`] = { t: 's', v: header.header };
    });

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'payments');
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
