import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-security',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MasterSideNavBarComponent,ContractDropdownNavComponent],
  templateUrl: './contract-security.component.html',
  styleUrls: ['./contract-security.component.css']
})
export class ContractSecurityComponent implements OnInit {
  changePasswordForm: FormGroup;
  message: string = ''; // Initialize message
  userTypeID: number | null = null;
  showHelpModal: boolean = false;

  openHelpModal() {
    this.showHelpModal = true;
  }

  closeHelpModal() {
    this.showHelpModal = false;
  }


  constructor(private fb: FormBuilder, private contractService: ContractManagerService, private router:Router) {
    this.changePasswordForm = this.fb.group({
      CurrentPassword: ['', Validators.required],
      NewPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const model = this.changePasswordForm.value;

      this.contractService.changePassword(model).subscribe(
        response => this.message = response.message,
        error => this.message = 'Error changing password.'
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/all-signed-contracts']);
  }

}
