import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TimeslotsService } from '../Services/timeslots.service';
import { AttendanceList } from '../shared/attendanceList';

// run to install: npm i jspdf --save
import  jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-generate-attendance-list',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule],
  templateUrl: './generate-attendance-list.component.html',
  styleUrl: './generate-attendance-list.component.css'
})
export class GenerateAttendanceListComponent {
  @ViewChild('content', { static: false }) content!: ElementRef;

  list:AttendanceList[]=[]
  listHeading:AttendanceList[]=[]
  bookingSlotID!:Number;
  programName!:String;
  slotDate!:Date;
  slotTime!:Date;
  numberOfBookings!:Number;
  renderer: any;
   today = new Date();
  dateGenerated!: string;
  pdfGenerating = false;
  constructor(private timeSlotService:TimeslotsService, private route:ActivatedRoute, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingSlotID = params['timeSlotId'];
    
    });
    this.GetAttendees(this.bookingSlotID);
    console.log('Ateendees:',this.list)
    console.log('ID', this.bookingSlotID)
    this.dateGenerated = this.today.toLocaleDateString();
  }

  
  GetAttendees(id:Number)
  {
    this.timeSlotService.GetAttendance(id).subscribe(result => {
      let attendanceList:any[] = result;
      console.log('Data',attendanceList)
      attendanceList.forEach((element) => {
        this.list.push(element)

        this.programName = result[0].programName;
        this.slotDate = result[0].slotDate;
        this.slotTime = result[0].slotTime;
        this.numberOfBookings = result[0].numberOfBookings;
        
      });
      
    })

    console.log(this.list)
  }

 


  async generateAttendacePDF(){
    this.pdfGenerating = true;
    const content = this.content.nativeElement;
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();

    const imgProperties = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth)/imgProperties.width

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save('attendance_list.pdf');
    
    // const pdfWindow = window.open(imgData);
    // pdfWindow?.document.write( );
    // pdfWindow?.document.close();
    this.pdfGenerating = false;
  }

  formatSlotTime(slotTime: any): string {
    if (typeof slotTime === 'string') {
      return new Date(slotTime).toISOString();
    }
    return slotTime;
  }

}
