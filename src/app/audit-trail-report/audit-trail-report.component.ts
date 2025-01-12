import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuditTrail } from '../shared/audit-trail';
import { AuditTrailService } from '../Services/audit-trail.service';
import { UserActivity } from '../shared/userActivity';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SalesReportService } from '../Services/sales-report.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChartData } from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-audit-trail-report',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard,  MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './audit-trail-report.component.html',
  styleUrl: './audit-trail-report.component.css'
})
export class AuditTrailReportComponent implements OnInit {
  @ViewChild('reportContent', { static: false }) content!: ElementRef;

  public chart: any;
  public chart1: any;
  filter!: string;
  ammendedFilter!:string;
  year!:number;
  userName!:string;
  today = new Date();
  dateGenerated:any;
  pdfGenerating = false;
  renderer: any;
  totalTransactions!:number;
  auditTrailData:AuditTrail[]=[];
  userActivityMap:any = [];
  transactionTypeCount: { [key: string]: number } = {};
  auditTrailDisplayedColumns: string[] = ['transaction_Type', 'critical_Data', 'changed_By', 'table_Name', 'change_Timestamp'];

  constructor( private route: ActivatedRoute, private router:Router, private auditTrailService:AuditTrailService, private salesReportService:SalesReportService) {}


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
     
      this.loadUser(),  

    ]).then(() => { });
  }



fetchData(filter:string):any{
  const transactionTypeCount = {};
  this.auditTrailService.GetAuditTrailReportData(filter).subscribe(result =>{
    this.auditTrailData = result;
    this.getUserSpecificInsight(result);
    this.loadChartData(result);
    this.processAuditTrailData(result);
  
    console.log('Audit Trail', this.auditTrailData);
    this.totalTransactions = this.auditTrailData.length;
  });

}

getUserSpecificInsight(result:AuditTrail[]){
  result.forEach((item: any)=> {
      const userId = item.changed_By; // Using the full name for tracking
      const transactionType = item.transaction_Type; // e.g., "INSERT", "UPDATE"
    
      // Initialize user activity tracking if the user doesn't exist in the map
      if (!this.userActivityMap[userId]) {
        this.userActivityMap[userId] = {
          userId,
          userName: item.changed_By, // Use the changed_By field directly
          totalChanges: 0,
          transactionTypes: {},
          activityTimestamps: [],
        };
      }
    
      // Increment the total changes for the user
      this.userActivityMap[userId].totalChanges++;
    
      // Track the types of transactions
      this.userActivityMap[userId].transactionTypes[transactionType] = 
        (this.userActivityMap[userId].transactionTypes[transactionType] || 0) + 1;
    
      // Store the timestamp of the activity
      this.userActivityMap[userId].activityTimestamps.push(item.timestamp);
    });
    
    // Convert the user activity map to an array for easier display
    const userActivityArray = Object.values(this.userActivityMap);
    
    // You can then display this information
    this.displayUserActivity(userActivityArray);

}
processAuditTrailData(result: AuditTrail[]): void {
  const activityCounts: { [date: string]: number } = {};

  result.forEach(item => {
    // Extract the date part from the timestamp
    const date = new Date(item.timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Count activities for each date
    activityCounts[date] = (activityCounts[date] || 0) + 1;
  });

  // Prepare the data for the chart
  const timeLabels = Object.keys(activityCounts); // Dates
  const activityData = Object.values(activityCounts); // Counts of activities

  // Sort dates in ascending order
  const sortedEntries = Object.entries(activityCounts).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

  // Extract sorted labels and data
  const sortedLabels = sortedEntries.map(([date]) => date);
  const sortedData = sortedEntries.map(([, count]) => count);

  this.createSingleAxisChart(sortedLabels, sortedData);
}

loadChartData(result:AuditTrail[]){
  const transactionTypeCount = {};

    result.forEach(item => {
      const transactionType = item.transaction_Type;

      // Count transaction types
      this.transactionTypeCount[transactionType] = (this.transactionTypeCount[transactionType] || 0) + 1;

      // You can add more processing here as needed
    });
    this.createPieChart(this.transactionTypeCount)
console.log(this.transactionTypeCount)
    this.transactionTypeCount = transactionTypeCount; // Store transaction type count for pie chart

   
}


createPieChart(chatData: { [key: string]: number } ) {
  const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

  console.log('chart data',  Object.keys(chatData))
  if (this.chart1) {
    this.chart1.destroy(); // Destroy previous chart instance
  }

  const data = {
    labels: Object.keys(chatData),
    datasets: [
      {
        data: Object.values(chatData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  this.chart1 = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false
    },
  });
}

createSingleAxisChart(labels: string[], data: number[]): void {
  const ctx = document.getElementById('singleAxisChart') as HTMLCanvasElement;

  if (this.chart) {
    this.chart.destroy(); // Destroy previous chart instance
  }

  const chartData: ChartData<'line'> = {
    labels: labels,
    datasets: [
      {
        label: 'Activity Count',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  this.chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Activity Count',
          },
        },
      },
    },
  });
}

displayUserActivity(userActivityArray: any[]): void {
  // Example: Logging the user activity to the console
  console.table(userActivityArray);

  // Alternatively, you can set this data to a property for rendering in the template
  this.userActivityMap = userActivityArray;
}

// Class property to cache transaction types
private transactionTypesCache: { [key: string]: { name: string; count: number }[] } = {};

getTransactionTypes(transactionTypes: { [key: string]: number }): { name: string; count: number }[] {
  const cacheKey = JSON.stringify(transactionTypes); // Create a unique key based on the input

  // Check if the result is already cached
  if (this.transactionTypesCache[cacheKey]) {
    return this.transactionTypesCache[cacheKey];
  }

  // Calculate transaction types and cache the result
  const result = [];
  for (const type in transactionTypes) {
    if (transactionTypes.hasOwnProperty(type)) {
      result.push({ name: type, count: transactionTypes[type] });
    }
  }

  // Store the result in the cache
  this.transactionTypesCache[cacheKey] = result;

  return result;
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


    pdf.save(`${this.ammendedFilter}-audit-trail-report-${this.year}.pdf`);
  }





}
