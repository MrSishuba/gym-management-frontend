import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-code-of-conduct',
  standalone: true,
  imports: [RouterLink,CommonModule,SideNavBarComponent],
  templateUrl: './code-of-conduct.component.html',
  styleUrl: './code-of-conduct.component.css'
})
export class CodeOfConductComponent {
  showModal: boolean = false;
  userTypeID: number | null = null;

  constructor(private router: Router) {}
 

  ngOnInit() {
   
     const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
     this.userTypeID = userTypeId;
   }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goBackToEmployeeHome(): void {
    this.router.navigate(['EmployeeHome/:id']);
  }



  downloadPDF() {
    const doc = new jsPDF();
    const margin = 14;
    const lineHeight = 10;
  
    // Title
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text('AVS Fitness Code of Conduct', margin, 20);
  
    // Subtitle
    doc.setFontSize(16);
    doc.setFont("Helvetica", "normal");
    doc.text('Commitment to Excellence in Fitness and Conduct', margin, 30);
  
    // Introduction
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('At AVS Fitness, we strive to create a safe and welcoming environment for all members and staff. Our Code of Conduct outlines the expected behavior to maintain a respectful and professional atmosphere.', margin, 40, { maxWidth: 180 });
  
    // Table of Contents
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text('Table of Contents', margin, 60);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('1. Introduction ........................................... 1', margin, 70);
    doc.text('2. Code of Conduct ................................... 2', margin, 75);
    doc.text('3. Penalties for Violations ........................ 3', margin, 80);
  
    // Code of Conduct Section
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text('1. Introduction', margin, 100);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('Our Code of Conduct is designed to foster a positive and respectful atmosphere. All members and staff are expected to adhere to these guidelines to ensure a harmonious and effective environment.', margin, 110, { maxWidth: 180 });
  
    // Detailed Code of Conduct
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text('2. Code of Conduct', margin, 130);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('• Respect for others and gym property', margin, 140);
    doc.text('• Proper gym attire at all times', margin, 145);
    doc.text('• Safe use of gym equipment', margin, 150);
    doc.text('• Prohibited behaviors: harassment, discrimination, and damage to property', margin, 155);
    doc.text('• Clean up after yourself and use provided sanitizing materials', margin, 160);
    doc.text('• Observe gym hours and closing times', margin, 165);
  
    // Penalties Section
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text('3. Penalties for Violations', margin, 185);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('Violations of the Code of Conduct may result in various disciplinary actions, depending on the severity of the offense. These actions can range from verbal warnings to membership suspension or permanent bans.', margin, 195, { maxWidth: 180 });
  
    // Detailed Penalties Table (Manual Drawing)
    const penalties = [
      { level: 'Minor Violations', description: 'Verbal warnings or written notices.' },
      { level: 'Moderate Violations', description: 'Temporary suspension of membership.' },
      { level: 'Severe Violations', description: 'Permanent ban from the facility & System.' }
    ];
  
    // Calculate position for the table
    const startY = 210;
    const rowHeight = 15;
    const colWidths = [80, 100]; // Adjust column widths
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  
    // Function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      let lines = [];
      let line = '';
      const words = text.split(' ');
  
      doc.setFontSize(fontSize);
  
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = doc.getStringUnitWidth(testLine) * fontSize / 72;
  
        if (testWidth > maxWidth && i > 0) {
          lines.push(line.trim());
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      return lines;
    };
  
    // Draw table headers
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.rect(margin, startY, tableWidth, rowHeight);
    doc.text('Violation Level', margin + 2, startY + 7);
    doc.text('Description', margin + colWidths[0] + 2, startY + 7);
  
    // Draw table rows
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    penalties.forEach((penalty, index) => {
      const y = startY + rowHeight * (index + 1);
      doc.rect(margin, y, tableWidth, rowHeight);
  
      const levelLines = wrapText(penalty.level, colWidths[0] - 4, 12);
      const descLines = wrapText(penalty.description, colWidths[1] - 4, 12);
  
      levelLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + 10 + (i * 7));
      });
  
      descLines.forEach((line, i) => {
        doc.text(line, margin + colWidths[0] + 2, y + 10 + (i * 7));
      });
    });
  
    // Check if there is enough space for the contact information, otherwise add a new page
    let contactStartY = startY + rowHeight * (penalties.length + 1) + 20;
    if (contactStartY + 40 > doc.internal.pageSize.height) {
      doc.addPage();
      contactStartY = 20; // Reset Y position on the new page
    }
  
    // Contact Information
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text('For Further Information', margin, contactStartY);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text('For any questions regarding the Code of Conduct, please contact our administration at:', margin, contactStartY + 10);
    doc.text('Email: support@avsfitness.com', margin, contactStartY + 20);
    doc.text('Phone: +27 123 456 789', margin, contactStartY + 25);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text('AVS Fitness © 2024. All rights reserved.', margin, doc.internal.pageSize.height - 10);
  
    // Save the PDF
    doc.save('Code_of_Conduct.pdf');
  }

}
