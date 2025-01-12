import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent {
  sections = [
    {
      title: 'Introduction',
      content: 'Welcome to AVS Fitness. This document outlines our policies, code of conduct, and guidelines for all members.',
      bulletPoints: [
        'Adhere to gym rules and regulations.',
        'Respect staff and other members.',
        'Maintain cleanliness and hygiene.',
        'Timely payments and renewals.',
        'Use equipment responsibly.',
        'Report issues to management.'
      ]
    },
    {
      title: 'Code of Conduct',
      content: 'Our code of conduct ensures that all members adhere to high standards of behavior. Members must show respect to others, comply with gym rules, and act responsibly at all times.',
      bulletPoints: [
        'Respectful interaction with others.',
        'Proper use of gym equipment.',
        'Punctuality for classes and appointments.',
        'Compliance with safety protocols.',
        'Appropriate attire at all times.',
        'No disruptive behavior.'
      ]
    },
    {
      title: 'Behavioral Rules',
      content: 'This section covers the expected behavioral norms, including punctuality, hygiene standards, and respectful interaction with staff and other members.',
      bulletPoints: [
        'Arrive on time for scheduled sessions.',
        'Keep personal hygiene in check.',
        'Respect gym property and equipment.',
        'Maintain a positive attitude.',
        'Avoid loud or disruptive behavior.',
        'Follow instructions from staff.'
      ]
    },
    {
      title: 'Blocking and Suspension',
      content: 'Details about the conditions under which members may be blocked or suspended from using the facilities. This includes non-compliance with rules and repeated violations.',
      bulletPoints: [
        'Repeated violation of gym rules.',
        'Inappropriate behavior towards staff or members.',
        'Non-payment of dues.',
        'Misuse of gym equipment.',
        'Disruptive behavior.',
        'Failure to comply with safety guidelines.'
      ]
    },
    {
      title: 'Banning',
      content: 'Outlines the circumstances under which a member may be permanently banned from the gym and the process for appealing such decisions.',
      bulletPoints: [
        'Severe misconduct or harassment.',
        'Intentional damage to property.',
        'Threatening behavior.',
        'Chronic rule violations.',
        'Unauthorized access to restricted areas.',
        'Using the gym for illegal activities.'
      ]
    }
  ];

  visibleSections: Set<string> = new Set();

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  goBack(): void {
    this.router.navigate(['/contract']);
  }

  downloadPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text('AVS Fitness Policy', 10, 10);

    let yOffset = 20;

    this.sections.forEach((section) => {
      doc.setFontSize(14);
      doc.text(section.title, 10, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      let splitContent = doc.splitTextToSize(section.content, 190);
      doc.text(splitContent, 10, yOffset);
      yOffset += splitContent.length * 10;

      section.bulletPoints.forEach((point) => {
        let splitPoint = doc.splitTextToSize(`- ${point}`, 180);
        doc.text(splitPoint, 10, yOffset);
        yOffset += splitPoint.length * 10;
      });

      yOffset += 10;
    });

    doc.save('AVS_Fitness_Policy.pdf');
  }

  toggleSection(title: string) {
    if (this.visibleSections.has(title)) {
      this.visibleSections.delete(title);
    } else {
      this.visibleSections.add(title);
    }
  }

  isSectionVisible(title: string): boolean {
    return this.visibleSections.has(title);
  }

  getBulletPoints(title: string): string[] {
    return this.sections.find(section => section.title === title)?.bulletPoints || [];
  }
}
