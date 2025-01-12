import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-master-side-nav-bar',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './master-side-nav-bar.component.html',
  styleUrls: ['./master-side-nav-bar.component.css']
})
export class MasterSideNavBarComponent {
  constructor(private router: Router) { }
  searchQuery: string = '';



  ngOnInit() {
    const specialNavLink = document.querySelector('.special-nav-link') as HTMLElement;

    if (specialNavLink) {
      specialNavLink.addEventListener('click', (event: Event) => {
        event.preventDefault();
     
      });
    }
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

