import { Component, ViewChild } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, IonIcon } from '@ionic/angular';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ElementRef } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';
import { InventoryService } from '../Services/inventory.service';
import { SalesReportService } from '../Services/sales-report.service';
import { SalesReportViewModel } from '../shared/salesReportViewModel';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, SideNavBarComponent, MatCard, MatCardModule, RouterLink, IonicModule, FormsModule,MatDividerModule, MatTableModule],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css'
})
export class SalesReportComponent {

  graphFilter!: string;

  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;

  reportData: any;
  totalOrderNumbers!: number;
  data: any;
  filter!:string;
  barChart1!: Chart;
  barChart2!: Chart;
  salesData: SalesReportViewModel[] = [];
  groupedSalesData: { [key: string]: SalesReportViewModel[] } = {};
  monthlyGroupedSalesData: { [key: number]: { [key: string]: SalesReportViewModel[] } } = {};
  monthlySalesSubtotals: { [month: number]: number } = {};
  monthlySalesCategorySubtotals: { [month: number]: { [category: string]: number } } = {};
  grandTotalOrdered: number = 0;
  grandTotalSales: number = 0;
  displayedColumns: string[] = ['product_Name', 'total_Ordered', 'total_Revenue'];
  today = new Date;
  dateGenerated: any;
  year!: number;
  ammendedFilter!:string;
  userName!:string;
monthNames!:string[];
monthNameArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // Create a map of month names to month numbers
monthNameToNumber: { [key: string]: number } = {
  'January': 1,
  'February': 2,
  'March': 3,
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10,
  'November': 11,
  'December': 12
};


  constructor (private elementRef: ElementRef, private salesService : SalesReportService, private route: ActivatedRoute, private router:Router){}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // this.inspectionType = params['booking_ID'];
     //  console.log('Parameter',params);

        if (params['One Month']) {
          this.filter = params['One Month'];
         

        } else if (params['Three Months']) {
          this.filter = params['Three Months'];
   

        } else if (params['Six Months']) {
          this.filter = params['Six Months'];
       

        } else if (params['Year']) {
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

       
      
      console.log('Parameter', this.filter);
      console.log('Amended Filter:', this.ammendedFilter);
      
     });

     let datePipe: DatePipe = new DatePipe('en-US');

     let formattedUtcDate = new Date(new Date().toUTCString()); 
    this.dateGenerated = datePipe.transform(formattedUtcDate, "MMMM dd, yyyy 'at' hh:mm a");
     this.year = this.today.getFullYear();
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


  loadData(filter: string): Promise<void> {
    return Promise.all([
      this.fetchData(),
    ]).then(() => {});
  }

  
  fetchData(): void {
    this.salesService.OrdersByProductAndCategory(this.filter).subscribe(data => {
      this.salesData = data;
      console.log('Data', data)
      console.log(data)
      this.groupSalesData();
      this.monthlyGroupedSalesData = this.groupByMonth(this.groupedSalesData);
      this.monthlySalesSubtotals = this.calculateMonthlySubtotals(this.monthlyGroupedSalesData);
      this.monthlySalesCategorySubtotals = this.calculateCategorySubtotals(this.monthlyGroupedSalesData);
      this.calculateGrandTotals();
      this.loadUser();
    });
  }

  //hasDataForCategory and hasCategoriesForMonth ensure that table headers are only displayed for categories that contain data else we see the tables for the data that is populated
  hasDataForCategory(month: string, category: string): boolean {
    const monthNumber = this.monthNameToNumber[month];
    return (this.monthlyGroupedSalesData[monthNumber]?.[category] || []).length > 0;
  }
  
  hasCategoriesForMonth(month: string): boolean {
    const monthNumber = this.monthNameToNumber[month];
    return Object.keys(this.monthlySalesCategorySubtotals[monthNumber] || {}).length > 0;
  }
  
  
  groupSalesData(): void {
    this.groupedSalesData = this.salesData.reduce((acc, curr) => {
      if (!acc[curr.category_Name]) {
        acc[curr.category_Name] = [];
      }
      acc[curr.category_Name].push(curr);
      return acc;
    }, {} as { [key: string]: SalesReportViewModel[] });
    

    console.log('Grouped Sales Data:', this.groupedSalesData);
  }

  groupByMonth(data: { [key: string]: SalesReportViewModel[] }): {[key: number]:{ [key: string]: SalesReportViewModel[] } }{
    const groupedByMonth = Object.keys(data).reduce((acc, category) => {
      const categoryData = data[category];
      
      categoryData.forEach(item => {
        const month = item.order_Date // 1-based month
        if (!acc[month]) {
          acc[month] = {}; // Initialize the month if it doesn't exist
        }
        if (!acc[month][category]) {
          acc[month][category] = []; // Initialize the category if it doesn't exist for the month
        }
        acc[month][category].push(item); // Push the item into the correct month and category
      });
  
      return acc;
    }, {} as { [key: number]: { [key: string]: SalesReportViewModel[] } });


    // Set month names for display
    this.monthNames = Object.keys(groupedByMonth).map(month => this.monthNameArray[+month - 1]);
    console.log(' Month Names', this.monthNames)

    return groupedByMonth;
  }

  calculateMonthlySubtotals(groupedData: { [key: number]: { [key: string]: SalesReportViewModel[] } }): { [month: number]: number } {
    return Object.keys(groupedData).reduce((acc: { [month: number]: number }, monthKey: string) => {
      const month = +monthKey;  // Convert monthKey from string to number
      const subtotal = Object.values(groupedData[month]).reduce((sum, items) => {
        return sum + items.reduce((categorySum, item) => categorySum + item.total_Sales, 0);
      }, 0); // Calculate total sales for the month across all categories
  
      acc[month] = subtotal;  // Store subtotal in accumulator
      return acc;  // Return updated accumulator
    }, {});
  }
  
  calculateCategorySubtotals(groupedData: { [key: number]: { [key: string]: SalesReportViewModel[] } }): { [month: number]: { [category: string]: number } } {
    return Object.keys(groupedData).reduce((acc: { [month: number]: { [category: string]: number } }, monthKey: string) => {
      const month = +monthKey;  // Convert monthKey from string to number
      
      const categoryTotals = Object.keys(groupedData[month]).reduce((catAcc, category) => {
        const subtotal = groupedData[month][category].reduce((sum, item) => sum + item.total_Sales, 0);
        catAcc[category] = subtotal;
        return catAcc;
      }, {} as { [category: string]: number });
  
      acc[month] = categoryTotals;  // Store category totals in accumulator
      return acc;  // Return updated accumulator
    }, {});
  }
  


  getCategories(): string[] {
   // console.log('Categories:', this.groupedSalesData);
    return Object.keys(this.groupedSalesData);
  }

  getCategoryTotalOrdered(category: string): number {
    return this.groupedSalesData[category].reduce((acc, curr) => acc + curr.total_Ordered, 0);
  }

  getCategoryTotalSales(category: string): number {
    return this.groupedSalesData[category].reduce((acc, curr) => acc + curr.total_Sales, 0);
  }

  calculateGrandTotals(): void {
    this.grandTotalOrdered = this.salesData.reduce((acc, curr) => acc + curr.total_Ordered, 0);
    this.grandTotalSales = this.salesData.reduce((acc, curr) => acc + curr.total_Sales, 0);
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
       this.salesService.GetGeneratorName(userId).subscribe(
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
    const content = this.reportContent.nativeElement;
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
    pdf.save(`${this.ammendedFilter}-sales-report-${this.year}.pdf`);

   // this.router.navigateByUrl('/dashboard');
  }
}
