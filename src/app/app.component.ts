// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { MasterSideNavBarComponent } from './master-side-nav-bar/master-side-nav-bar.component';
import { MemberSideNavBarComponent } from './member-side-nav-bar/member-side-nav-bar.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './Services/authentication.service';
// import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavBarComponent,
    MasterSideNavBarComponent,
    MemberSideNavBarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthenticationService) {}
}
