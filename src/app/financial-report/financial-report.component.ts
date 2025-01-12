import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FinancialReportService } from '../Services/financial-report.service';
import { FinancialReportViewModel } from '../shared/financialReportViewModl';
import { BookingService } from '../Services/booking.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { SalesReportService } from '../Services/sales-report.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import { ChangeDetectorRef } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.css'
})
export class FinancialReportComponent implements OnInit {
  @ViewChild('content', { static: false }) content!: ElementRef;

  filter!: string;
  groupedPaymentsData: { [key: string]: FinancialReportViewModel[] } = {};
  totalReceived!: number;
  totalOutstanding!: number;
  paymentsByTypeData: any[] = [];
  categorySalesData: { [key: string]: number } = {};
  totalRevenue: number = 0;
  today = new Date();
  dateGenerated: any;
  ammendedFilter!:string;
  year!:number;
  userName!:string;
 
  constructor( private route: ActivatedRoute, private router:Router, private financialService: FinancialReportService, private cd: ChangeDetectorRef, private salesReportService:SalesReportService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
         if (params['One Month']) {
           this.filter = params['One Month'];
         } else if (params['Three Months']) {
           this.filter = params['Three Months'];
         } else if(params['Six Months']){
          this.filter = params['Six Months'];
         } else if(params['Year']){
          this.filter = params['Year'];
         }

         
         if(this.filter == 'Year'){
          this.ammendedFilter = 'Yearly'
         } else if(this.filter == 'One Month'){
            this.ammendedFilter = 'One Month'
         }else if(this.filter == 'Three Months'){
          this.ammendedFilter = 'Three Month'
         }else if (this.filter == 'Six Months'){
          this.ammendedFilter = 'Six Month'
         }

         this.generateReport();
         let datePipe: DatePipe = new DatePipe('en-US');

         let formattedUtcDate = new Date(new Date().toUTCString()); 
         this.dateGenerated = datePipe.transform(formattedUtcDate, "MMMM dd, yyyy 'at' hh:mm a");
         this.year = this.today.getFullYear();
      console.log('Parameter', this.filter)
      
     });
 }

 generateReport() {
  this.loadData().then(() => {
    // Wait for Angular to update the view
    setTimeout(() => {
      this.generatePDF().then(() => {
        // Optionally navigate or handle after PDF generation
         this.router.navigateByUrl('/dashboard');
      });
    }, 500);
  });
}


  loadData(): Promise<void> {
    return Promise.all([
      this.fetchData(),
      this.loadUser()
    ]).then(() => {});
  }

 
 fetchData(): void {

  this.financialService.TotalReceived(this.filter).subscribe(data => {
    this.totalReceived = data;
  });

  this.financialService.TotalOutstanding(this.filter).subscribe(data => {
    this.totalOutstanding = data;
  });

  this.financialService.PaymentsByType(this.filter).subscribe(data => {
   // 
    this.paymentsByTypeData = data;
    //this.groupPaymentsData(data);
    console.log(data)
  });
}

groupPaymentsData(payments: FinancialReportViewModel[]): void {
  try {
    this.groupedPaymentsData = payments.reduce((acc, curr) => {
      // Validate data
      if (!curr || !curr.payment_Type_Name) {
        console.warn('Skipping invalid payment record:', curr);
        return acc;
      }
      
      const paymentTypeName = curr.payment_Type_Name.trim() || 'Unknown';
      if (!acc[paymentTypeName]) {
        acc[paymentTypeName] = [];
      }
      acc[paymentTypeName].push(curr);
      return acc;
    }, {} as { [key: string]: FinancialReportViewModel[] });

    console.log('Grouped Payments Data:', this.groupedPaymentsData);
  } catch (error) {
    console.error('Error grouping payments data:', error);
  }
}




getPaymentTypeTotals(): { paymentType: string, subTotal: number }[] {
  return Object.keys(this.groupedPaymentsData).map(key => {
    const payments = this.groupedPaymentsData[key];
    const subTotal = payments.reduce((sum, payment) => sum + payment.total_Received, 0);
    return {
      paymentType: key,
      subTotal: subTotal
    };
  });
}




loadUser(): void{
  // Retrieve the JSON object from local storage
const userJson = localStorage.getItem('User');

if (userJson) {
 try {
   // Parse the JSON string into an object
   const userObject = JSON.parse(userJson);

   // Extract the userId from the parsed object
   const userId = userObject.userId;

   if (!isNaN(userId)) {
     // Call the service method with the userId
     this.salesReportService.GetGeneratorName(userId).subscribe(
       (response) => {
         this.userName = response.value
         // Handle the response (e.g., display the user's name in the UI)
       },
       (error) => {
         console.error('Error fetching user name:', error);
       }
     );
   } else {
     console.error('Invalid userId:', userId);
   }
 } catch (error) {
   console.error('Error parsing user JSON:', error);
 }
} else {
 console.error('No User data found in local storage');
}
}



async generatePDF() {
  //this.cd.detectChanges();
  const content = this.content.nativeElement;

    await new Promise(resolve => setTimeout(resolve, 800));

  const canvas = await html2canvas(content);
  const imgData = canvas.toDataURL('image/png');
  const pdf   = new jsPDF('p', 'mm');
  var position = 0;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pdfHeight = canvas.height * pageWidth / canvas.width
  var heightLeft = pdfHeight;

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
  heightLeft -= pageHeight;

  //this ensures that a new age is generated should all the data on the canvas not fit on a single A4 page
  //while there is content we add pages to ensure all of the data is displayed.
  while (heightLeft >= 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save('financial-report.pdf');
 

}



}
