import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { UserService } from '../Services/userprofile.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Member, updateUser } from '../shared/update-user';
import { Subscription, catchError } from 'rxjs';
import { RewardRedeemViewModel, UnredeemedRewardModel } from '../shared/reward';
import { RewardService } from '../Services/reward.service';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MemberSideNavBarComponent } from '../member-side-nav-bar/member-side-nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any; // Import jQuery

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MasterSideNavBarComponent, SideNavBarComponent, MemberSideNavBarComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  user: updateUser | undefined;
  member: Member | undefined;
  isEditMode = false;
  errorMessage = '';  
  userProfileImage: string | null = null;
  photoFile: File | null = null;
  unredeemedRewards: UnredeemedRewardModel[] = [];
  selectedReward: UnredeemedRewardModel | null = null;
  discountCode!: string;
  userTypeID: number | null = null;
  helpContent: any[] = [];
  filteredContent: any[] = [];
  searchTerm: string = '';

  private allowedImageFormats = ['jpg', 'jpeg', 'png'];

  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za'
  ];


  private userSubscription: Subscription | undefined;
  private memberSubscription: Subscription | undefined;
  private redeemSubscription: Subscription | undefined;
  
  constructor(
    private userService: UserService,
    private rewardService: RewardService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^(06|07|08)\\d{8}$')]],
      physical_Address: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      photo: ['']
    });
  }

  validateEmail(control: any): { [key: string]: any } | null {
    const email = control.value ? control.value.toLowerCase() : '';
    
    if (!email || !email.includes('@')) {
      return { 'invalidEmail': true };
    }
  
    const domain = email.substring(email.lastIndexOf('@'));
    if (!this.allowedEmailDomains.includes(domain)) {
      return { 'invalidDomain': true };
    }
  
    return null;
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);
    const userId = JSON.parse(localStorage.getItem('User') || '{}').userId;
    console.log('User ID from local storage:', userId);
    this.loadUserProfile(userId);
    this.isEditMode = false;    


    // Initialize help content
    this.helpContent = [
      {
        title: 'Profile Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Profile Page allows users to view and update their personal information. This includes details such as username, email, and profile picture.</p>
          <p><strong>Elements and Features:</strong></p>`
      },
      {
        title: '1. Back Button',
        content: `
          <ul>
            <li><strong>Description:</strong> An arrow icon located in the header that allows you to return to the previous page.</li>
            <li><strong>Functionality:</strong> Clicking the back button navigates to the previous page you visited.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the back button if you want to return to your previous page without losing your current context.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Header Title',
        content: `
          <ul>
            <li><strong>Description:</strong> Displays the title "Profile" to indicate the purpose of the screen.</li>
            <li><strong>Functionality:</strong> Provides a clear indication of the current screen's functionality.</li>
          </ul>`
      },
      {
        title: '3. Profile Information',
        content: `
          <ul>
            <li><strong>Description:</strong> Displays your personal information such as username, email, and profile picture.</li>
            <li><strong>Functionality:</strong> Allows you to view and edit your personal details.</li>
          </ul>`
      },
      {
        title: '4. Change Password Button',
        content: `
          <ul>
            <li><strong>Description:</strong> A button that navigates you to the Change Password screen.</li>
            <li><strong>Functionality:</strong> Allows you to update your password securely.</li>
          </ul>`
      },
      {
        title: 'Technical Details:',
        content: `
          <ul>
            <li>Dynamic Data: The profile information is dynamically updated based on the data retrieved from the backend.</li>
            <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> How do I update my profile information?</p>
          <p><strong>A:</strong> Click on the edit button next to the information you want to update, make your changes, and click save.</p>
          <p><strong>Q:</strong> How do I change my password?</p>
          <p><strong>A:</strong> Click the "Change Password" button to navigate to the Change Password screen.</p>
          <p><strong>Q:</strong> What should I do if I encounter an error?</p>
          <p><strong>A:</strong> Refresh the page or contact support for assistance.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The profile information is not loading.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and logged in. If the problem persists, try refreshing the page or contact technical support.</p>
          <p><strong>Problem:</strong> Unable to update profile information.</p>
          <p><strong>Solution:</strong> Check your internet connection and ensure all required fields are filled out correctly. If the issue continues, contact support.</p>`
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

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe();
    }
    if (this.redeemSubscription) {
      this.redeemSubscription.unsubscribe();
    }
  }

  loadUserProfile(userId: number): void {
    this.userSubscription = this.userService.getUserById(userId).pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return [];
      })
    ).subscribe({
      next: (result) => {
        console.log('User data received:', result);
        this.user = result; 

        // Patch non-file form values
        this.profileForm.patchValue({
          email: this.user.email,
          name: this.user.name,
          surname: this.user.surname,
          phoneNumber: this.user.phoneNumber,
          physical_Address: this.user.physical_Address,
        });

        // Log photo to debug
        console.log('Photo:', this.user.photo);        
        // Set user profile image
        this.userProfileImage = `data:image/jpeg;base64,${this.user.photo}`;
        console.log('User:', this.user);

        const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
        this.userTypeID = userTypeId;
        if (this.userTypeID === 3) {
          this.loadMemberProfile(userId);
        }
      },
      complete: () => {
        console.log('getUserById subscription completed');
      }
    });
  }

  loadMemberProfile(userId: number): void {
    this.memberSubscription = this.userService.getMemberByUserId(userId).pipe(
      catchError(error => {
        console.error('Error fetching member profile:', error);
        return [];
      })
    ).subscribe({
      next: (result) => {
        this.member = result;
        if (this.member) {
          console.log('Member data received:', this.member); // Detailed debug statement
          console.log('Member ID:', this.member.member_ID); // Debug statement
          this.loadUnredeemedRewards(this.member.member_ID);
        }
      },
      complete: () => {
        console.log('getMemberByUserId subscription completed');
      }
    });
  }

  clearForm() {
    this.profileForm.reset();
  }

  enableEditMode(event: Event) {
    event.preventDefault();
    this.isEditMode = true;
    this.profileForm.enable();
  }

  openSaveModal() {
    if (this.profileForm.invalid) {
      this.showValidationErrors();
      $('#errorModal').modal('show');
      return;
    }
    $('#saveConfirmationModal').modal('show');
  }

  showValidationErrors() {
    const invalidFields: string[] = [];
    Object.keys(this.profileForm.controls).forEach(key => {
      const controlErrors = this.profileForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          invalidFields.push(`${key}: ${errorKey}`);
        });
      }
    });
    this.errorMessage = `Please enter a valid input: ${invalidFields.join(', ')}`;
  }

  dismissModal() {
    $('#saveConfirmationModal').modal('hide');
  }

  dismissErrorModal() {
    $('#errorModal').modal('hide');
  }

  confirmSave() {
    this.dismissModal();
    this.onSubmit();
    this.isEditMode = false; // Disable edit mode after confirmation
  }

  onSubmit() {
    if (this.profileForm.valid) {
        const userId = JSON.parse(localStorage.getItem('User')!).userId;
        const formValue = this.profileForm.value;

        // If no new photo is selected, use the existing photo
        let photoFile: File | null = this.photoFile;
        if (!photoFile && this.user?.photo) {
          // Ensure the Base64 string is valid
          const base64Prefix = 'data:image/jpeg;base64,';
          let base64String = this.user.photo;
          if (base64String.startsWith(base64Prefix)) {
            base64String = base64String.replace(base64Prefix, '');
          }
          try {
            const byteString = atob(base64String);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const intArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
              intArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([intArray], { type: 'image/jpeg' });
            photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          } catch (e) {
            console.error('Invalid Base64 string:', e);
          }
        }

        // Create the user object
        const user: updateUser = {
            name: formValue.name,
            surname: formValue.surname,
            email: formValue.email,
            physical_Address: formValue.physical_Address,
            phoneNumber: formValue.phoneNumber,
            photo: this.user?.photo ?? '', // Ensure photo is included even if it's not updated
            user_Type_ID: this.user?.user_Type_ID ?? 0
        };

        this.userService.updateUser(userId, user, photoFile).subscribe({
            next: (result) => {
                console.log('User updated successfully:', result);
                this.router.navigateByUrl(`/ProfilePage/${userId}`);
                this.snackBar.open('Successfully updated profile', 'Close', { duration: 3000 });
            },
            error: (error) => {
                console.error('Error updating user profile:', error);
                alert('Error updating profile.');
            }
        });
    } else {
        console.warn('Form is invalid:', this.profileForm.errors);
    }
  }

  onPhotoChange(event: Event): void {
    if (!this.isEditMode) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // Validate file extension
        if (!this.allowedImageFormats.includes(fileExtension || '')) {
            console.error('Invalid file type. Allowed formats are:', this.allowedImageFormats.join(', '));
            this.snackBar.open('Invalid file type. Only JPG, JPEG, and PNG are allowed.', 'Close', { duration: 3000 });
            return;
        }
        
        // Ensure file is an image
        if (!file.type.startsWith('image/')) {
            console.error('Selected file is not an image.');
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
          if (e.target && e.target.result) {
              this.userProfileImage = e.target.result; // Update the image source for preview
              this.photoFile = file; // Set the file for form submission
              console.log('Base64 string of the image:', this.userProfileImage);
          }
      };

        reader.onerror = (e) => {
            console.error('Error reading file:', e);
            alert('There was an error reading the file. Please try again.');
        };

        reader.onabort = (e) => {
            console.warn('File read aborted:', e);
            alert('File read was aborted. Please try again.');
        };

        reader.onloadend = () => {
            console.log('File read completed.');
        };

        try {
            reader.readAsDataURL(file);
            this.photoFile = file; 
        } catch (error) {
            console.error('An error occurred while reading the file:', error);
            alert('An error occurred while reading the file. Please try again.');
        }
    } else {
        console.error('No file selected or input element is invalid.');
    }
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

  changePassword() {
    this.router.navigateByUrl('/ChangePasswordPage');
  }

  // Method to load rewards for the current user
  loadUnredeemedRewards(memberId: number): void {
    console.log('Loading unredeemed rewards for member ID:', memberId); 
    this.rewardService.getUnredeemedRewardsForMember(memberId).subscribe({
      next: rewards => {
        this.unredeemedRewards = rewards;
        console.log("reward", rewards)
      },
      error: error => {
        console.error('Error fetching unredeemed rewards:', error);
      },
      complete: () => {
        console.log('Fetching unredeemed rewards completed.');
      }
    });
  }

  // Method to open redeem modal for a reward
  openRedeemModal(reward: UnredeemedRewardModel): void {
    this.selectedReward = reward;
    $('#redeemRewardModal').modal('show');
  }

  // Method to dismiss redeem modal
  dismissRedeemModal(): void {
    $('#redeemRewardModal').modal('hide');
  }

  // Method to confirm redeeming a reward
  confirmRedeem(): void {
    if (!this.selectedReward) {
      return;
    }
    const redeemRequest = new RewardRedeemViewModel();
    redeemRequest.MemberId = this.member?.member_ID ?? 0;
    redeemRequest.RewardId = this.selectedReward.reward_ID;

    console.log('Sending redeem request:', redeemRequest); // Log the request

    // Call backend service to redeem the reward
    this.redeemSubscription = this.rewardService.redeemReward(redeemRequest).subscribe({
      next: (response: any) => {
        console.log('Redeem response:', response); // Log the response
        if (response && response.status === "Success") {
          this.discountCode = response.discountCode || ''; // Handle absence of DiscountCode
    
          console.log('Discount Code:', this.discountCode); // Log the discount code to verify
          this.cdr.detectChanges();
          
          // Log to ensure the order of operations
          console.log('Hiding redeem modal');
          this.dismissRedeemModal();  // Ensure the redeem modal is hidden
          
          // Adding a slight delay to ensure the redeem modal is fully hidden
          setTimeout(() => {
            $('#successModal').modal('show');
          }, 300); // Adjust the delay as needed

          // Remove redeemed reward from the list
          this.unredeemedRewards = this.unredeemedRewards.filter(r => r.reward_ID !== this.selectedReward?.reward_ID);
        }
      },
      error: (error) => {
        alert(error);
        console.error('Error redeeming reward:', error);
        // Handle error
      }
    });

    this.dismissRedeemModal();
  }

  // Method to dismiss success modal
  dismissSuccessModal(): void {
    $('#successModal').modal('hide');
  }
}
