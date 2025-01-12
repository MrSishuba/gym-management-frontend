import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , FormsModule, NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SupplierService } from '../Services/supplier.service';
import { Supplier } from '../shared/supplier';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.css'
})
export class AddSupplierComponent implements OnInit {
  supplierName:string ='';
  supplierContactNum:string =''
  emailAddress:string='';
  physicalAddress:string ='';
  street: string = ''; // Property to bind to street input
  city: string = '';
  country: string = ''; 
  province:string = '';
  district:string = '';
  suburb:string='';
  postalCode!:number;
supplierNumber:string='';
  countries: string[]= ['South Africa', "Botswana"]; 
  southAfricaProvinces: string[]=['Gauteng', 'North West', 'Mpumalanga', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State', 'Limpopo'];
  botstwanaDistricts: string[]=['Central', 'Chobe', 'Francistown', 'Gaborone', 'Ghantsi', 'Jwaneng', 'Kgalagadi', 'Kgatleng', 'Kweneng', 'Lobatse', 'North East', 'North West', 'South East', 'Southern', 'Selibe Phikwe', 'Sowa Town'];


cities: string[] = [];
southAfricaCities = {
  'Gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Centurion'],
  'North West': ['Mahikeng', 'Rustenburg', 'Klerksdorp', 'Potchefstroom'],
  'Mpumalanga': ['Nelspruit', 'Witbank', 'Secunda', 'Middelburg'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'George', 'Paarl'],
  'Eastern Cape': ['Gqeberha (Port Elizabeth)', 'East London', 'Mthatha', 'Grahamstown'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar'],
  'Free State': ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem'],
  'Limpopo': ['Polokwane', 'Thohoyandou', 'Tzaneen', 'Lephalale']
};

botswanaCities = {
  'Central': ['Serowe', 'Palapye', 'Mahalapye'],
  'Chobe': ['Kasane'],
  'Francistown': ['Francistown'],
  'Gaborone': ['Gaborone'],
  'Ghantsi': ['Ghanzi'],
  'Jwaneng': ['Jwaneng'],
  'Kgalagadi': ['Tsabong'],
  'Kgatleng': ['Mochudi'],
  'Kweneng': ['Molepolole'],
  'Lobatse': ['Lobatse'],
  'North East': ['Masunga'],
  'North West': ['Maun'],
  'South East': ['Ramotswa'],
  'Southern': ['Kanye'],
  'Selibe Phikwe': ['Selebi-Phikwe'],
  'Sowa Town': ['Sowa Town']
};


  registerFormGroup: FormGroup;

  southAfricaCountryCode: string = '+27';
  botswanaCountryCode: string = '+267';

  searchTerm: string = '';
  helpContent: any[] = [];
 filteredContent: any[] = [];

  constructor(private supplierService: SupplierService, private router: Router,private dialog:MatDialog, private fb: FormBuilder ) { 
    this.registerFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      streetName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      city: [null, Validators.required],
      PhoneNumber: [0, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      country: [null, Validators.required],
      province: [null, Validators.required],
      postalCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      suburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],

    });


     // Listen for country changes and reset province when the country changes
     const countryControl = this.registerFormGroup.get('country');
  if (countryControl) {
    countryControl.valueChanges.subscribe((selectedCountry) => {
      this.province = ''; // Reset province/district when country changes
    });
  }

   // Reset cities when province changes
   const provinceControl = this.registerFormGroup.get('province');
   if (provinceControl) {
     provinceControl.valueChanges.subscribe((selectedProvince) => {
      this.cities = []
       this.selectProvince(); // Call to update cities based on selected province
     });
   }
}

  ngOnInit(): void {
      // Initialize help content
this.helpContent = [
  {
    title: 'Create Supplier Overview',
    content: `
      <p><strong>Overview:</strong> The Create Supplier form allows you to enter details for a new supplier. This includes the supplier's name, contact information, email address, and physical address.</p>`
  },
  {
    title: '1. Supplier Name',
    content: `
      <ul>
        <li><strong>Input Field:</strong> Enter the supplier's name in the "Supplier Name" field. This is a required field.</li>
       
      </ul>`
  },
  {
    title: '2. Supplier Contact Number',
    content: `
      <ul>
        <li><strong>Input Field:</strong> Enter the supplier's contact number in the "Supplier Contact Number" field. This is a required field and must be exactly 10 digits long.</li>
      </ul>`
  },
  {
    title: '3. Supplier Email Address',
    content: `
      <ul>
        <li><strong>Input Field:</strong> Enter the supplier's email address in the "Supplier Email Address" field. This field is required.</li>
        <li><strong>Validation:</strong> You will receive an error message if the email is left blank or if the format is invalid.</li>
      </ul>`
  },
  {
    title: '4. Supplier Physical Address',
    content: `
      <p>This section includes multiple fields for entering the physical address of the supplier:</p>
      <ul>
        <li><strong>Country:</strong> Select the country from the dropdown. This field is required.</li>
        <li><strong>Province/District:</strong> Select the province or district of that supplier from the dropdown. This field is required.</li>
        <li><strong>City:</strong> Select the city of that supplier from the dropdown. This field is required.</li>
        <li><strong>Suburb/Town:</strong> Enter the suburb/town name of that supplier from the dropdown. This field is required.</li>
        <li><strong>Street Name:</strong> Enter the street name of the supplier.</li>
        <li><strong>Postal Code:</strong> Enter the postal code of the supplier.</li>
      
      </ul>`
  },
  {
    title: '5. Submission Buttons',
    content: `
      <p>At the bottom of the form, you will find the following buttons:</p>
      <ul>
        <li><strong>Add:</strong> Click this button to submit the form and add the supplier. The button will be disabled until all required fields are valid.</li>
        <li><strong>Cancel:</strong> Click this button to cancel the operation and return to the supplier list.</li>
      </ul>`
  },
  {
    title: 'Common Questions:',
    content: `
      <p><strong>Q:</strong> What happens if I try to submit the form with errors?</p>
      <p><strong>A:</strong> The form will not submit, and you will see error messages highlighting any invalid fields.</p>`
  },
  {
    title: 'Troubleshooting:',
    content: `
      <p><strong>Problem:</strong> The "Add" button is disabled even when I have filled out the form.</p>
      <p><strong>Solution:</strong> Ensure that all required fields are valid according to the specified validation rules before submitting.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];

  }

  get PhysicalAddress(): string {

    if(this.country == "South Africa"){
      return `${this.country}, ${this.province}, ${this.city}, ${this.suburb}, ${this.street}, ${this.postalCode} `;
    }else{
      return `${this.country}, ${this.district}, ${this.city}, ${this.suburb}, ${this.street}, ${this.postalCode}`;
    }


    
}


//ensures phone number input doesn't allow text
validateNumber(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Remove any non-digit characters
  input.value = value.replace(/[^0-9]/g, '');
}

get processPhoneNumber():string {
  let phoneNumber = this.supplierNumber;

  // Check if there is a leading zero and remove it
  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.substring(1); // Remove leading zero
  }

  if(this.country == "South Africa" ){
    this.supplierContactNum = this.southAfricaCountryCode + phoneNumber;
  }else{
    this.supplierContactNum = this.botswanaCountryCode + phoneNumber;
  }
  // Concatenate the country code
    console.log(this.supplierContactNum)

  // Now you can use `fullPhoneNumber` as needed, for example:
  return this.supplierContactNum;
}



filterHelpContent(): void {
  const term = this.searchTerm.toLowerCase();
  this.filteredContent = this.helpContent.filter(item =>
    item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
  );
}


selectCountry() {
  this.country = this.registerFormGroup.get('country')?.value;
  this.province = ''; // Reset province
  this.city = ''; // Reset city
  this.cities = []; // Clear cities
}

selectProvince() {
  const selectedProvince = this.registerFormGroup.get('province')?.value;

  if (this.country === 'South Africa') {
    // Ensure selectedProvince is a valid key in southAfricaCities
    this.cities = this.southAfricaCities[selectedProvince as keyof typeof this.southAfricaCities] || [];
  } else if (this.country === 'Botswana') {
    // Ensure selectedProvince is a valid key in botswanaCities
    this.cities = this.botswanaCities[selectedProvince as keyof typeof this.botswanaCities] || [];
  }
}




  addSupplier(newName:String, email_Address:String){
    
    const newSupplier: Supplier = {
     supplier_ID:0,
      name:newName,
      email_Address:email_Address,
      contact_Number:this.processPhoneNumber,
      physical_Address: this.PhysicalAddress
    };

    
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Are you sure you want to add this Supplier?' } });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
        this.supplierService.AddSupplier(newSupplier).subscribe((result:Supplier)=>{
      
          this.router.navigateByUrl('/supplier');
          this.dialog.open(SuccessDialogComponent,{data: { message: 'Supplier successfully added!' }});
        });
        }
     
      console.log('Supplier Added', result)
    
    } ,(error: HttpErrorResponse) => {
      // Handle error
      this.dialog.open(ErrorDialogComponent, { 
        data: { message: error.error || 'An unexpected error occurred Please try again.' } 
      });
      console.log('Error:', error.error)
     
    });
  }
}
