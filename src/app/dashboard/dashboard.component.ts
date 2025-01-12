import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookingService } from '../Services/booking.service';

import Chart from 'chart.js/auto';
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';
import { DashboardService } from '../Services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, MatCard, MatCardModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  salesCount: number = 0;
  salesPercentageChange: number = 0;
  subscriptionsCount: number = 0;
  subscriptionsPercentageChange: number = 0;
  popularProducts: any[] = [];
  topMembers: any[] = [];
  currentFilter: string = 'week';
  showModal: boolean = false;
  showModal2: boolean = false;
  needFilter: boolean = true;
  reportFilter!: string;
  graphFilter!: string;
  salesData: any[]=[];
  subscriptionData: any[]=[];
  private salesChart: Chart | undefined;


  chart: any;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];
  constructor(
    private router: Router, 
    private bookingService: BookingService,
    private reportService: DashboardService // Inject the service
  ) {}

  ngOnInit() {
    this.loadData(this.currentFilter);
    this.setUpEventListeners();

    this.helpContent = [
      {
        title: 'Overview',
        content: `
          <p><strong>AVS Fitness Dashboard:</strong> This dashboard provides a comprehensive overview of fitness metrics, including sales, subscriptions, top members, and popular products.</p>`
      },
      {
        title: 'Navigating the Dashboard',
        content: `
          <p><strong>Back Button:</strong> Use the back button at the top left to return to the previous page (Gym Manager).</p>
          <p><strong>Dashboard Links:</strong> Click on the "Week," "Day," or "Month" links to filter the displayed data according to your preference.</p>`
      },
      {
        title: 'Generating Reports',
        content: `
          <p><strong>Report Generation:</strong> Click the "Generate Report" button to start the report generation process.</p>
          <p><strong>Steps to Generate Report:</strong></p>
          <ul>
            <li>Select the type of report you want from the dropdown menu.</li>
            <li>Click "Continue" to proceed to the next modal.</li>
            <li>Select the report period (One Month, Three Months, Six Months, or Year) and click "Generate Report."</li>
          </ul>`
      },
      {
        title: 'Understanding Dashboard Metrics',
        content: `
          <p><strong>Number of Sales:</strong> Displays the total sales count for the selected period.</p>
          <p><strong>No. of New Subscriptions:</strong> Shows the count of new subscriptions during the selected timeframe.</p>
          <p><strong>Top Five Members:</strong> Lists the top five members based on booking counts.</p>
          <p><strong>Top Five Products:</strong> A chart visualizing the most popular products sold.</p>`
      },
      {
        title: 'Troubleshooting',
        content: `
          <p><strong>Problem:</strong> Data not updating after changing the filter.</p>
          <p><strong>Solution:</strong> Ensure you click the appropriate filter link (Week, Day, Month) to refresh the data.</p>`
      }
    ];
    
    this.filteredContent = [...this.helpContent];
    
  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }

  loadData(filter: string) {
    this.loadSalesData(filter);
    this.loadSubscriptionData(filter);
    this.loadPopularProducts(filter);
    this.loadTopMembers(filter);
  }

  loadSalesData(filter: string) {
    this.reportService.getSalesData(filter).subscribe(data => {
      this.salesData  = data;
      console.log('Sales Data',data)
     this.salesCount = 0;
      this.salesData.forEach((element: any) => {
        this.salesCount += element.salesCount;
        //this.totalSales += element.totalSales;
      });
     
      console.log(this.salesCount)
      this.salesPercentageChange = data.percentageChange;
      
    
    });
  }

  loadSubscriptionData(filter: string) {
    this.reportService.getSubscriptionData(filter).subscribe((data: any) => {
      this.subscriptionData = data;
      this.subscriptionsCount = data.subscriptionsCount;
      this.subscriptionsCount = 0;
      this.subscriptionData.forEach((element: any) => {
        this.subscriptionsCount += element.subscriptionsCount;
        //this.totalSales += element.totalSales;
      });
     
      this.subscriptionsPercentageChange = data.percentageChange;
    });
  }

  loadPopularProducts(filter: string) {
    this.reportService.getPopularProducts(filter).subscribe((data: any) => {
      this.popularProducts = data;
      console.log('Products', data)
      //use quantity of products bought not nuber of times its bought
      this.createChart();
    });
  }
  createChart() {
    if(this.chart){
      this.chart = this.chart.destroy()
    }
    const labels = this.popularProducts.map(product => product.productName);
    const data = this.popularProducts.map(product => product.productOrderCount);

    this.chart = new Chart('popularProductsChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Popular Products (Quantity)',
          data: data,
          backgroundColor: '#fff8cc',
          borderColor: '#ffcc00',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }



  loadTopMembers(filter: string) {
    this.reportService.getTopMembers(filter).subscribe((data: any) => {
      this.topMembers = data.members;
      console.log(data)
    });
  }

  setUpEventListeners() {
    document.getElementById('weekLink')?.addEventListener('click', () => this.filterData('week'));
    document.getElementById('dayLink')?.addEventListener('click', () => this.filterData('day'));
    document.getElementById('monthLink')?.addEventListener('click', () => this.filterData('month'));
  }

  filterData(filter: string) {
    this.currentFilter = filter;
    this.loadData(filter);
  }

  open() {
    this.showModal = true;
  }
   
  close() {
    this.showModal = false;
    this.showModal2 = false;
  }

  onReportFilterChange() {
    // Check if the selected reportFilter is either "Member" or "Inventory"
    if (this.reportFilter === "Member" || this.reportFilter === "Inventory") {
      // Directly call generateReport with the selected filter
      this.needFilter = false;
    } else{
      this.needFilter = true;
     // this.continueToSecondModal();
    }
  }

  continueToSecondModal() {
    this.showModal = false;
    this.showModal2 = true;
  }

  generateReport(filter: string) {
    if (this.reportFilter == "Member") {
      this.router.navigateByUrl(`member-report`);
    } else if (this.reportFilter == "Financial") {
      this.router.navigateByUrl(`financial-report/${filter}`);
    } else if (this.reportFilter == "Booking") {
      this.router.navigateByUrl(`booking-report/${filter}`);
    } else if (this.reportFilter == "Sales") {
      this.router.navigateByUrl(`sales-report/${filter}`);
    } else if (this.reportFilter == "Inspection") {
      this.router.navigateByUrl(`inspection-report/${filter}`);
    } else if (this.reportFilter == "Inventory") {
      this.router.navigateByUrl(`inventory-report`);
    }else if (this.reportFilter == "Audit Trail") {
      this.router.navigateByUrl(`audit-trail-report/${filter}`);
    }
  }
}