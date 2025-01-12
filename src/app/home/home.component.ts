import { Component } from '@angular/core';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MemberSideNavBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent {


  toggleDetails(section: string) {
    const textElement = document.getElementById(`${section}-text`);
    const imageElement = document.getElementById(`${section}-image`);
    const buttonElement = document.getElementById(`read-more-${section}`);

    if (textElement && buttonElement && imageElement) {  // Ensure all elements are found
        const isHidden = textElement.style.display === "none";
        
        textElement.style.display = isHidden ? "block" : "none";
        imageElement.style.display = isHidden ? "block" : "none";
        buttonElement.textContent = isHidden ? "Show Less" : "Read More";
    }
  }



}
