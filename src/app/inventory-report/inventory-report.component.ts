import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { bookingReportViewModel } from '../shared/bookingReportViewModel';
import { BookingService } from '../Services/booking.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SalesReportService } from '../Services/sales-report.service';
import { InventoryService } from '../Services/inventory.service';
import { InventoryReport } from '../shared/inventoryReport';
import Chart from 'chart.js/auto';
import { DatePipe } from '@angular/common';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.css'
})
export class InventoryReportComponent implements OnInit{

  @ViewChild('content', { static: false }) content!: ElementRef;
  myTempRef!: ElementRef;
  dateGenerated: any;
  pdfGenerating = false;
  renderer: any;
  totalBookingsNumber!: number;
  filter!:string;
  reportData: any;
  barChart1!: Chart;
  barChart2!: Chart;
  graphFilter!: string;
  today = new Date();
  ammendedFilter!:string;
  year!:number;
  userName!:string;
  data: InventoryReport[] = [];
 reportTitle:any;
  displayedColumns: string[] = ['name', 'description', 'unitPrice', 'quantityInStock', 'totalStockValue', 'quantityWrittenOff', 'totalWriteOffValue', 'quantityOrdered', 'totalValue'];

  totals: any = {};
  constructor(private bookingService : BookingService,  private route: ActivatedRoute, private router:Router, private salesReportService:SalesReportService, private inventoryService:InventoryService) {}

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

         let datePipe: DatePipe = new DatePipe('en-US');

       let formattedUtcDate = new Date(new Date().toUTCString()); 
      this.dateGenerated = datePipe.transform(formattedUtcDate, "MMMM dd, yyyy 'at' hh:mm a");
      this.reportTitle = datePipe.transform(formattedUtcDate, "MMMM-yyyy");
         this.year = this.today.getFullYear();
      console.log('Parameter', this.filter)
      
     });

     this.generateReport(this.filter);
     
  }

  generateReport(filter: string) {
    this.loadData(filter).then(() => {
      setTimeout(() => {
        this.generatePDF().then(() => {
          // Optionally navigate or handle after PDF generation
           this.router.navigateByUrl('/dashboard');
        });
      }, 500);
    });
  }

  async loadData(filter: string) {
    await Promise.all([
      this.getData(),
     // this.loadTotalBookings(filter),
      this.loadUser()
    ]);
  }


 getData() {
    this.inventoryService.GetReportData().subscribe(response => {
      if (response) {
        this.data = response ;
        this.calculateTotals();
      } else {
        console.error('Response is undefined or null');
      }
    }, error => {
      console.error('API Error:', error);
    });
    return this.data;
  }


  calculateTotals() {
    this.totals = {
      totalQuantityInStock: this.data.reduce((sum, item: InventoryReport) => sum + item.quantityInStock, 0),
      totalStockValue: this.data.reduce((sum, item: InventoryReport) => sum + item.totalStockValue, 0),
      totalQuantityWrittenOff: this.data.reduce((sum, item: InventoryReport) => sum + item.quantityWrittenOff, 0),
      totalWriteOffValue: this.data.reduce((sum, item: InventoryReport) => sum + item.totalWriteOffValue, 0),
      totalQuantityOrdered: this.data.reduce((sum, item: InventoryReport) => sum + item.quantityOrdered, 0),
      totalValue: this.data.reduce((sum, item: InventoryReport) => sum + item.totalValue, 0)
    };
  }

  
  loadUser(): void{
    // Retrieve the JSON object from local storage
 const userJson = localStorage.getItem('User');

 console.log('Raw User JSON from local storage:', userJson);

 if (userJson) {
   try {
     // Parse the JSON string into an object
     const userObject = JSON.parse(userJson);

     // Extract the userId from the parsed object
     const userId = userObject.userId;

     console.log('Parsed userID:', userId);

     if (!isNaN(userId)) {
       // Call the service method with the userId
       this.salesReportService.GetGeneratorName(userId).subscribe(
         (response) => {
           console.log('User Name:', response);
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
  pdf.save(`inventory-report-${this.reportTitle}.pdf`);

}


}
