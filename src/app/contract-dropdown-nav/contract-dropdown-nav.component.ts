import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-dropdown-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-dropdown-nav.component.html',
  styleUrls: ['./contract-dropdown-nav.component.css']
})
export class ContractDropdownNavComponent implements OnInit {
  userTypeID: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
  }

  navigate(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value) {
      this.router.navigate([value]);
    }
  }
}
