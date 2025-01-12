import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-affiliations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './affiliations.component.html',
  styleUrls: ['./affiliations.component.css']
})
export class AffiliationsComponent {
  // Function to toggle the modal visibility
  toggleModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    }
  }
}
