import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { bookingReportViewModel } from '../shared/bookingReportViewModel';
import { BookingService } from '../Services/booking.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InspectionReportViewModel } from '../shared/inspectionReportViewModel';
import { InspectionService } from '../Services/inspection.service';
import { SalesReportService } from '../Services/sales-report.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-inspection-report',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard,  MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.css'
})
export class InspectionReportComponent implements OnInit {
  @ViewChild('reportContent', { static: false }) content!: ElementRef;

  dateGenerated:any;
  pdfGenerating = false;
  renderer: any;
  filter!: string;
  inventoryData: InspectionReportViewModel[] = [];
  equipmentData: InspectionReportViewModel[] = [];
  grandTotalInspections: number = 0;
  inventorySubtotal: number = 0;
  equipmentSubtotal: number = 0;
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

  inventoryDisplayedColumns: string[] = ['inventory_Item_Name', 'inspection_Type', 'inspection_Date', 'inspection_Notes'];
  equipmentDisplayedColumns: string[] = ['equipment_Name', 'inspection_Type', 'inspection_Date', 'inspection_Notes'];
  groupedInventoryData: { [key: number]: InspectionReportViewModel[] } = {};
  groupedEquipmentData: { [key: number]: InspectionReportViewModel[] } = {};
  monthlyInventorySubtotals: { [month: number]: number } = {};
  monthlyEquipmentSubtotals: { [month: number]: number } = {};
  today = new Date();
  ammendedFilter!:string;
  year!:number;
  userName!:string;
  monthNames: string[] = [];
  monthlyTotals: { [month: number]: number } = {};



  constructor( private route: ActivatedRoute, private router:Router, private inspectionService: InspectionService, private salesReportService:SalesReportService) {}
  
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

       this.year = this.today.getFullYear();
       let datePipe: DatePipe = new DatePipe('en-US');

       let formattedUtcDate = new Date(new Date().toUTCString()); 
      this.dateGenerated = datePipe.transform(formattedUtcDate, "MMMM dd, yyyy 'at' hh:mm a");
      this.generateReport(this.filter);
    
    });
  }
  
  generateReport(filter:string) {
    this.loadData(filter).then(() => {
      setTimeout(() => {
        this.generatePDF().then(() => {

           this.router.navigateByUrl('/dashboard');
        });
      }, 500);
    });
  }

  loadData(filter:string): Promise<void> {
    return Promise.all([
      this.fetchData(filter),
     // this.calculateGrandTotals(),
      this.loadUser()
    ]).then(() => { });
  }


  fetchData(filter: string): void {
    // this.inspectionService.InventoryInspections(filter).subscribe(data => {
    //   this.inventoryData = data;
    //   this.processData(this.inventoryData, 'inventory');
    // });

    this.inspectionService.EqupimentInspections(filter).subscribe(data => {
      this.equipmentData = data;
      this.processData(this.equipmentData, 'equipment');
    });
  }

  processData(data: InspectionReportViewModel[], type: 'inventory' | 'equipment') {
    const groupedData = this.groupByMonth(data);
    // if (type === 'inventory') {
    //   this.groupedInventoryData = groupedData;
    //   this.monthlyInventorySubtotals = this.calculateMonthlySubtotals(groupedData);
    //   this.inventorySubtotal = Object.values(this.monthlyInventorySubtotals).reduce((acc, curr) => acc + curr, 0);
    // } else 
    if (type === 'equipment') {
      this.groupedEquipmentData = groupedData;
      this.monthlyEquipmentSubtotals = this.calculateMonthlySubtotals(groupedData);
      this.equipmentSubtotal = Object.values(this.monthlyEquipmentSubtotals).reduce((acc, curr) => acc + curr, 0);
    }
    this.calculateMonthlyTotals(); 
    this.updateGrandTotal();
  }

  groupByMonth(data: InspectionReportViewModel[]): { [key: number]: InspectionReportViewModel[] } {
    const grouped = data.reduce((result, item) => {
      const month = new Date(item.inspection_Date).getMonth() + 1; // Months are 0-based in JavaScript
      (result[month] = result[month] || []).push(item);
      return result;
    }, {} as { [key: number]: InspectionReportViewModel[] });
    this.monthNames = Object.keys(grouped).map(month => this.getMonthName(+month));
    return grouped;
  }

  calculateMonthlySubtotals(groupedData: { [key: number]: InspectionReportViewModel[] }): { [month: number]: number } {
    return Object.keys(groupedData).reduce((acc, monthKey) => {
      const month = +monthKey;
      acc[month] = groupedData[month].reduce((sum, item) => sum + item.number_Of_Inspections, 0);
      return acc;
    }, {} as { [month: number]: number });
  }

  getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return this.monthNameArray[month - 1];
  }

  calculateSubtotalsByMonth(groupedData: { [key: number]: InspectionReportViewModel[] }): { [month: number]: number } {
    return Object.keys(groupedData).reduce((acc: { [month: number]: number }, month) => {
      acc[+month] = groupedData[+month].reduce((sum, item) => sum + item.number_Of_Inspections, 0);
      return acc;
    }, {});
  }

  calculateMonthlyTotals(): void {
    // Initialize monthly totals
    this.monthlyTotals = {};
  
    // Iterate through each month in the inventory data
    for (const month in this.groupedInventoryData) {
      const inventoryTotal = this.groupedInventoryData[month].reduce((sum, item) => sum + item.number_Of_Inspections, 0);
      const equipmentTotal = this.groupedEquipmentData[month] ? 
        this.groupedEquipmentData[month].reduce((sum, item) => sum + item.number_Of_Inspections, 0) : 0;
  
      this.monthlyTotals[month] = inventoryTotal + equipmentTotal;
    }
  
    // Also ensure to account for months in equipment data not present in inventory data
    for (const month in this.groupedEquipmentData) {
      if (!this.monthlyTotals[month]) {
        const equipmentTotal = this.groupedEquipmentData[month].reduce((sum, item) => sum + item.number_Of_Inspections, 0);
        this.monthlyTotals[month] = equipmentTotal;
      }
    }
  }
  

  updateGrandTotal(): void {
    this.grandTotalInspections = this.inventorySubtotal + this.equipmentSubtotal;
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

    //this ensures that a new page is generated should all the data on the canvas not fit on a single A4 page
    //while there is content we add pages to ensure all of the data is displayed.
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
      heightLeft -= pageHeight;
    }


    pdf.save(`${this.ammendedFilter}-inspection-report-${this.year}.pdf`);
  }
}


