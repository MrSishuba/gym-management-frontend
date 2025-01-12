import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import {HttpErrorResponse } from '@angular/common/http';
import { Supplier } from '../shared/supplier';
import { SupplierService } from '../Services/supplier.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor,ReactiveFormsModule,CommonModule ],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css'
})
export class EditSupplierComponent implements OnInit{
  supplier:Supplier ={
    supplier_ID:0,
    name:'',
    contact_Number:'',
    email_Address:'',
    physical_Address:''
    
  }
  street: string = ''; // Property to bind to street input
  city: string = ''; // Property to bind to city input
  registerFormGroup: FormGroup;
  supplierID!:Number;
  searchTerm: string = '';
  helpContent: any[] = [];
filteredContent: any[] = [];

country: string = ''; 
province:string = '';
district:string = '';
suburb:string='';
postalCode!:number;

countries: string[]= ['South Africa', "Botswana"]; 
  southAfricaProvinces: string[]=['Gauteng', 'North West', 'Mpumalanga', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State', 'Limpopo'];
  botswanaDistricts: string[]=['Central', 'Chobe', 'Francistown', 'Gaborone', 'Ghantsi', 'Jwaneng', 'Kgalagadi', 'Kgatleng', 'Kweneng', 'Lobatse', 'North East', 'North West', 'South East', 'Southern', 'Selibe Phikwe', 'Sowa Town'];


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

supplierContactNum:string =''
phoneNumberDisplay: string = ''; 
southAfricaCountryCode: string = '+27';
botswanaCountryCode: string = '+267';


  constructor(private supplierService: SupplierService, private route: ActivatedRoute, private router: Router, private dialog:MatDialog,private fb: FormBuilder) { 
    this.registerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
       number: [0, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
       email: ['', [Validators.required, Validators.email]],
       country: [null, Validators.required],
       province: [''],
       district: [''],
       city: [null, Validators.required],
       suburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
       streetName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
       postalCode: [0, [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
     

    });
  }

  
  ngOnInit():void{
      
    this.route.params.subscribe(params => {
      this.supplierID = params['supplier_ID'];
      this.getSupplier(this.supplierID);
    });


         // Listen for country changes and reset province when the country changes
         const countryControl = this.registerFormGroup.get('country');
         if (countryControl) {
           countryControl.valueChanges.subscribe((selectedCountry) => {
            setTimeout(() => { 
             this.province = ''; // Reset province/district when country changes
            });
          });
         
         }
       
          // Reset cities when province changes
          const provinceControl = this.registerFormGroup.get('province');
          if (provinceControl) {
            provinceControl.valueChanges.subscribe((selectedProvince) => {
              setTimeout(() => { 
              this.cities = []
              this.selectProvince(); // Call to update cities based on selected province
            });
          });
         }

          const districtControl = this.registerFormGroup.get('district'); 
          if (districtControl) {
            districtControl.valueChanges.subscribe((selectedProvince) => {
              setTimeout(() => {
                this.cities = [];
                this.selectProvince(); // Call to update cities based on selected province
              });
            });
          }

        // Initialize help content
this.helpContent = [
  {
    title: 'Edit Supplier Overview',
    content: `
      <p><strong>Overview:</strong> The Edit Supplier form allows you to enter updated details for an existing supplier. This includes the supplier's name, contact information, email address, and physical address.</p>`
  },
  {
    title: '1. Supplier Name',
    content: `
      <ul>
        <li><strong>Input Field:</strong> The input filed will be populated with the existing name. Enter the updated supplier's name in the "Supplier Name" field. This is a required field.</li>
       
      </ul>`
  },
  {
    title: '2. Supplier Contact Number',
    content: `
      <ul>
        <li><strong>Input Field:</strong> The input filed will be populated with the existing contanct number. Enter the updated supplier's contact number in the "Supplier Contact Number" field. This is a required field and must be exactly 10 digits long.</li>
      </ul>`
  },
  {
    title: '3. Supplier Email Address',
    content: `
      <ul>
        <li><strong>Input Field:</strong> The input filed will be populated with the existing email address. Enter the updated supplier's email address in the "Supplier Email Address" field. This field is required.</li>
        <li><strong>Validation:</strong> You will receive an error message if the email is left blank or if the format is invalid.</li>
      </ul>`
  },
  {
    title: '4. Supplier Physical Address',
    content: `
      <p>This section includes multiple fields for entering the physical address of the supplier:</p>
      <ul>
        <li><strong>Street Name:</strong> The input filed will be populated with the existing street name. Enter the updated street name.</li>
        <li><strong>City:</strong> The input filed will be populated with the existing city name. Enter updated the city name. </li>
        <li><strong>Country:</strong> The input filed will be populated with the existing country. Select the updated country from the dropdown.</li>

         <li><strong>Country:</strong> The input filed will be populated with the existing country. Select the updated country from the dropdown.</li>
        <li><strong>Province/District:</strong> The input filed will be populated with the existing country. Select the updated province/district from the dropdown.</li>
        <li><strong>City:</strong> The input filed will be populated with the existing country. Select the updated city from the dropdown.</li>
        <li><strong>Suburb/Town:</strong> The input filed will be populated with the existing suburb/town name. Enter updated the suburb/town name. </li>
        <li><strong>Street Name:</strong>The input filed will be populated with the existing street name. Enter updated the street name. </li>
        <li><strong>Postal Code:</strong>The input filed will be populated with the existing postal code. Enter updated the postal code. </li>
      </ul>`
  },
  {
    title: '5. Submission Buttons',
    content: `
      <p>At the bottom of the form, you will find the following buttons:</p>
      <ul>
        <li><strong>Save:</strong> Click this button to submit the form and update the supplier details. The button will be disabled if all required fields are not valid.</li>
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
      <p><strong>Problem:</strong> The "Save" button is disabled even when I have filled out the form.</p>
      <p><strong>Solution:</strong> Ensure that all required fields are valid according to the specified validation rules before submitting.</p>`
  }
];

// Initialize filtered content
this.filteredContent = [...this.helpContent];
  }

  filterHelpContent(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContent = this.helpContent.filter(item =>
      item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)
    );
  }
  
  
  getSupplier(id: Number): void {
    this.supplierService.GetSupplier(id).subscribe(result => {
      this.supplier = result;
      const provinceControl = this.registerFormGroup.get('province');
      const districtControl = this.registerFormGroup.get('district');

      let fullPhoneNumber = result.contact_Number;
      console.log(fullPhoneNumber)
      this.phoneNumberDisplay = this.convertToDisplayNumber(fullPhoneNumber);

      const addressSection = result.physical_Address.split(', ');
      console.log('Address Section',addressSection)
            this.country = addressSection[0];

            
            if (this.country == 'South Africa') {
              this.province = addressSection[1];
              provinceControl?.setValidators(Validators.required);
              districtControl?.clearValidators();

              this.registerFormGroup.patchValue({
                province: this.province,
              });
              console.log('Province:', this.province);
            } else {
              this.district = addressSection[1];
              districtControl?.setValidators(Validators.required);
              provinceControl?.clearValidators();

              this.registerFormGroup.patchValue({
                district: this.district,
              });
              console.log('District:', this.district);
            }


            console.log('Address Section 1',addressSection[1])
            // Check if the city value can be patched from the address section
              this.city = addressSection[2];
              this.registerFormGroup.patchValue({
                city: this.city,
              });
          
            console.log('Address Section 2',addressSection[2])

            this.suburb = addressSection[3];
            console.log('Address Section 3',addressSection[3])

            this.street = addressSection[4];
            console.log('Address Section 4',addressSection[4])

            this.postalCode = addressSection[5];
            console.log('Address Section 5',addressSection[5])


          
      //console.log('Supplier', this.supplier)
    });
  }

  convertToDisplayNumber(fullPhoneNumber: string): string {
    // Example: Strip the country code and prepend '0'
    if (fullPhoneNumber.startsWith(this.botswanaCountryCode)) {
      return '0' + fullPhoneNumber.slice(this.botswanaCountryCode.length);

    }else if(fullPhoneNumber.startsWith(this.southAfricaCountryCode)) {
      return '0' + fullPhoneNumber.slice(this.southAfricaCountryCode.length);
    }else{
    return fullPhoneNumber;
    }
  }

  

selectCountry() {
  this.country = this.registerFormGroup.get('country')?.value;
  this.province = ''; // Reset province
  this.city = ''; // Reset city
  this.cities = []; // Clear cities
}

selectProvince() {
  const selectedProvince = this.registerFormGroup.get('province')?.value;
  const selectedDistrict = this.registerFormGroup.get('district')?.value;

  if (this.country === 'South Africa') {
    // Ensure selectedProvince is a valid key in southAfricaCities
    this.cities = this.southAfricaCities[selectedProvince as keyof typeof this.southAfricaCities] || [];
  } else if (this.country === 'Botswana') {
    // Ensure selectedProvince is a valid key in botswanaCities
    this.cities = this.botswanaCities[selectedDistrict as keyof typeof this.botswanaCities] || [];
  }
}


get PhysicalAddress(): string {

  const country = this.registerFormGroup.get('country')?.value;
  const province = this.registerFormGroup.get('province')?.value;
  const district = this.registerFormGroup.get('district')?.value;
  const city = this.registerFormGroup.get('city')?.value;

  if(this.country == "South Africa"){
    return `${country}, ${province}, ${city}, ${this.suburb}, ${this.street}, ${this.postalCode} `;
  }else{
    return `${country}, ${district}, ${city}, ${this.suburb}, ${this.street}, ${this.postalCode}`;
  }


  
}

  // Convert display format back to the raw phone number format (with country code)
 get processPhoneNumber():string {
  let phoneNumber = this.phoneNumberDisplay;

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



  validateNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, ''); // Ensure input is numeric
}



  updateSupplier(id: Number) {
    
    //Update the physical address of the supplier object
    this.supplier.physical_Address = this.PhysicalAddress;
   
    //const supplierNumber = this.processPhoneNumber
    this.supplier.contact_Number = this.processPhoneNumber;

    // Open the confirmation dialog first
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: { message: 'Are you sure you want to update this Supplier?' } 
    });
  
    // Handle the result of the confirmation dialog
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Proceed with updating the supplier if confirmed
        this.supplierService.UpdateSupplier(id, this.supplier).subscribe((result: Supplier) => {
          this.dialog.open(SuccessDialogComponent, { data: { message: 'Supplier successfully updated!' } });
          console.log('Supplier Updated', result);
          this.router.navigateByUrl('/supplier');
        }, (error: HttpErrorResponse) => {
          // Handle error
          this.dialog.open(ErrorDialogComponent, { 
            data: { message: error.error || 'An unexpected error occurred Please try again.' } 
          });
          console.log('Error:', error.error);
        });
      }
    });
  }
  

}
