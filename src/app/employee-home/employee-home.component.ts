import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employee-home',
  standalone: true,
  imports: [CommonModule,SideNavBarComponent],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css'
})
export class EmployeeHomeComponent {
  constructor(private router: Router) {}

  toggleContent(event: Event) {
    const button = event.target as HTMLButtonElement;
    const section = button.closest('section')!;
    const moreText = section.querySelector('.more-text') as HTMLElement;
    const shortText = section.querySelector('.short-text') as HTMLElement;

    if (moreText.style.display === 'none') {
      moreText.style.display = 'block';
      shortText.style.display = 'none';
      button.textContent = 'Show less';
    } else {
      moreText.style.display = 'none';
      shortText.style.display = 'block';
      button.textContent = 'Read more';
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
