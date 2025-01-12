import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractManagerService } from '../Services/contractManager.service';
import { CommonModule } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { ContractDropdownNavComponent } from '../contract-dropdown-nav/contract-dropdown-nav.component';
import { Router } from '@angular/router';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-delete-contract-file',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MasterSideNavBarComponent,ContractDropdownNavComponent,SideNavBarComponent],
  templateUrl: './delete-contract-file.component.html',
  styleUrls: ['./delete-contract-file.component.css']
})
export class DeleteContractFileComponent {
  removeContractForm: FormGroup;
  message: string = ''; // Initialize message
  userTypeID: number | null = null;
  showHelpModal = false; // Controls modal visibility


  constructor(private fb: FormBuilder, private contractService: ContractManagerService, private router: Router) {
    this.removeContractForm = this.fb.group({
      Member_Name: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  goBack(): void {
    this.router.navigate(['/upload-contract']);
  }

  openHelpModal(): void {
    this.showHelpModal = true;
  }

  closeHelpModal(): void {
    this.showHelpModal = false;
  }


  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId; }


  onSubmit() {
    if (this.removeContractForm.valid) {
      const formData = new FormData();
      formData.append('Member_Name', this.removeContractForm.value.Member_Name);
      formData.append('Password', this.removeContractForm.value.Password);

      this.contractService.removeContractFile(formData).subscribe(
        response => this.message = response.message,
        error => this.message = 'Error removing contract file.'
      );
    }
  }
}
