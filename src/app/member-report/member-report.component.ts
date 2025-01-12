import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { bookingReportViewModel } from '../shared/bookingReportViewModel';
import { BookingService } from '../Services/booking.service';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MemberReportViewModelService } from '../Services/member-report-view-model.service';
import { SalesReportService } from '../Services/sales-report.service';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-member-report',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard, MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './member-report.component.html',
  styleUrl: './member-report.component.css'
})
export class MemberReportComponent {
  data: any;
  @ViewChild('reportContent', { static: true }) reportContentRef!: ElementRef;
  myTempRef!: ElementRef;
  dateGenerated: any;
  pdfGenerating = false;
  renderer: any;
  totalBookingsNumber!: number;
  filter!:string;
  today = new Date();
  reportTitle:any;




  totalNewSubscriptions: number = 0;
  contractsByType: any[] = [];
  memberBookings: any[] = [];
  memberAgeDemographic: any[] = [];
  unredeemedRewards: number = 0;
  totalNewContracts!: number;

  totalBookings: number = 0;
  totalAgeDemographics: number = 0;
  totalContractsByType: number = 0;
  totalMembers: number = 0;
  totalContracts: number = 0;
  ammendedFilter!:string;
  year!:number;
  userName!:string;
  private ageGroupOrder: string[] = [
    "Under 18",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65 and over"
  ];

  constructor( private route: ActivatedRoute, private router:Router, private reportService: MemberReportViewModelService, private salesReportService: SalesReportService) {}
  ngOnInit(): void {
  
         
     let datePipe: DatePipe = new DatePipe('en-US');
     let formattedUtcDate = new Date(new Date().toUTCString()); 
     this.dateGenerated = datePipe.transform(formattedUtcDate, "MMMM dd, yyyy 'at' hh:mm a");
     this.reportTitle = datePipe.transform(formattedUtcDate, "MMMM-yyyy");
     this.year = this.today.getFullYear();
     console.log('Parameter', this.filter);
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
      this.fetchReportData(),
      this.loadUser()
    ]).then(() => {});
  }



 
  fetchReportData(): void {

    this.reportService.MemberAgeDemographic().subscribe(data => {
      this.memberAgeDemographic = this.sortAgeDemographics(data);
      console.log('Demographic', data)
      this.totalAgeDemographics = this.memberAgeDemographic.reduce((acc, demo) => acc + demo.numberOfMembers, 0);
    });

    this.reportService.UnredeemedRewards().subscribe(data => {
      this.unredeemedRewards = data;
      console.log('Unredeemed Rewards', data)
    });

  }

  sortAgeDemographics(data: any[]): any[] {
    return data.sort((a, b) => {
      return this.ageGroupOrder.indexOf(a.ageGroup) - this.ageGroupOrder.indexOf(b.ageGroup);
    });
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
    const content = this.reportContentRef.nativeElement;
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
    pdf.save(`member-report-${this.reportTitle}.pdf`);
  }
}