import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-member-side-nav-bar',
  standalone: true,
  imports: [IonHeader, RouterLink,FormsModule,CommonModule, IonicModule],
  templateUrl: './member-side-nav-bar.component.html',
  styleUrls: ['./member-side-nav-bar.component.css']
})
export class MemberSideNavBarComponent {
  constructor(private router: Router) { }
  searchQuery: string = '';

  ngOnInit() {
    const specialNavLink = document.querySelector('.special-nav-link') as HTMLElement;

    if (specialNavLink) {
      specialNavLink.addEventListener('click', (event: Event) => {
        event.preventDefault();
        this.openHelpModal(event);
      });
    }
  }

  openHelpModal(event: Event) {
    event.preventDefault();

    const helpModal = document.getElementById('modalHelp') as HTMLElement;
    if (helpModal) {
      helpModal.style.display = 'block';
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.backgroundColor = 'rgba(211, 211, 211, 0.5)'; // Light transparent grey
    document.body.appendChild(backdrop);
    backdrop.style.display = 'block';

    const closeHandler = () => {
      this.closeModal(helpModal, backdrop);
    };

    const btnClose = document.querySelector('.btn-close') as HTMLElement;
    if (btnClose) {
      btnClose.addEventListener('click', closeHandler);
    }

    backdrop.addEventListener('click', closeHandler);
  }

  closeModal(helpModal: HTMLElement | null, backdrop: HTMLElement) {
    if (helpModal) {
      helpModal.style.display = 'none';
    }
    backdrop.style.display = 'none';
    document.body.removeChild(backdrop);
  }

  filterTable() {
    const helpContent = document.querySelector('.help-content') as HTMLElement;
    const items = helpContent.querySelectorAll('h3, h4, p, ul') as NodeListOf<HTMLElement>;

    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || '';
      item.style.display = text.includes(this.searchQuery.toLowerCase()) ? 'block' : 'none';
    });
  }

  navToProfile(){
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    this.router.navigateByUrl(`/ProfilePage/${userId}`);
  }

  logout() {
    localStorage.removeItem('User');
    this.router.navigateByUrl('/landing-page');
  }

  goBack() {
    const userTypeId = JSON.parse(localStorage.getItem('User')!).userTypeId;
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    if (userTypeId === 1) {  // Ensure userTypeID is compared as string
      this.router.navigateByUrl(`/OwnerHome/${userId}`);
    } else if (userTypeId === 2) {
      this.router.navigateByUrl(`/EmployeeHome/${userId}`);
    } else if (userTypeId === 3) {
      this.router.navigateByUrl(`/Home/${userId}`);
    }
  }
}
