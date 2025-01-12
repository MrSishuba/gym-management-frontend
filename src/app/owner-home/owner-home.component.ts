import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';

@Component({
  selector: 'app-owner-home',
  standalone: true,
  imports: [CommonModule,MasterSideNavBarComponent],
  templateUrl: './owner-home.component.html',
  styleUrl: './owner-home.component.css'
})
export class OwnerHomeComponent {
  showMore1 = false;
  showMore2 = false;
  showMore3 = false;
  showMore4 = false;

  toggleText1() {
    this.showMore1 = !this.showMore1;
  }

  toggleText2() {
    this.showMore2 = !this.showMore2;
  }

  toggleText3() {
    this.showMore3 = !this.showMore3;
  }

  toggleText4() {
    this.showMore4 = !this.showMore4;
  }
}
