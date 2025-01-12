import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http'; // Add HttpClient
import { catchError } from 'rxjs/operators'; // For error handling
import { throwError } from 'rxjs'; // For handling errors
import { ChatComponent } from '../chat/chat.component';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule,ChatComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit,OnDestroy {

  showMore: boolean = false;
  isAboutUsModalVisible = false;
  isCommunityModalVisible = false;
  showMoreAboutUs: boolean = false;
  showMoreCommunity: boolean = false;
  emailForm: FormGroup;
  showChat = false;

  public currentTime: string = '';

 



  toggleChat() {
    this.showChat = !this.showChat;
  }



  toggleDarkMode() {
    // Toggle dark mode on the body
    document.body.classList.toggle('dark-mode');

    // Toggle dark mode on specific sections
    const chatContainer = document.querySelector('.chat-container');
    const chatHeader = document.querySelector('.chat-header');
    const topBar = document.querySelector('.top-bar');
    const searchBar = document.querySelector('.search-bar');
    const topIcons = document.querySelector('.top-icons');
    const modeToggle = document.querySelector('.mode-toggle');
    const footerDivider = document.querySelector('.footer-divider');
    const chatFooter = document.querySelector('.chat-footer');
    const inputSection = document.querySelector('.input-section');
    const userMessage = document.querySelectorAll('.user-message');
    const botMessage = document.querySelectorAll('.bot-message');

    // Apply dark mode to all the elements
    chatContainer?.classList.toggle('dark-mode');
    chatHeader?.classList.toggle('dark-mode');
    topBar?.classList.toggle('dark-mode');
    searchBar?.classList.toggle('dark-mode');
    topIcons?.classList.toggle('dark-mode');
    modeToggle?.classList.toggle('dark-mode');
    footerDivider?.classList.toggle('dark-mode');
    chatFooter?.classList.toggle('dark-mode');
    inputSection?.classList.toggle('dark-mode');

    // Apply dark mode to chat messages
    userMessage.forEach(msg => msg.classList.toggle('dark-mode'));
    botMessage.forEach(msg => msg.classList.toggle('dark-mode'));
}


  // Same allowed domains from your previous example
  private allowedEmailDomains = [
    '@gmail.com', '@outlook.com', '@hotmail.com', '@live.com',
    '@yahoo.com', '@icloud.com', '@aol.com', '@zoho.com',
    '@protonmail.com', '@mail.com', '@gmx.com', '@yandex.com', '@yandex.co.za', '@tuks.co.za'
  ];



  images = [
    'assets/images/community5.jpg',  // Last image duplicated for infinite loop effect
    'assets/images/posterboy4.jpg',
    'assets/images/postergirl.jpg',
    'assets/images/posterboy1.jpg',
    'assets/images/boxer.jpg',
    'assets/images/community9.jpg',
    'assets/images/community12.jpg',
    'assets/images/community1.jpg',
    'assets/images/community4.jpg',
    'assets/images/community5.jpg',
    'assets/images/posterboy4.jpg'   // First image duplicated for infinite loop effect
  ];
  
  currentIndex = 1;  // Start from the first actual image
  intervalId: any;
  isTransitioning = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,  // Assuming snackBar is being used
    private router: Router,
    private http: HttpClient // Inject HttpClient for API requests
  ) {
    // Initialize email form with validation
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.validateEmail.bind(this)]]
    });
  }

  
  // Email validation function
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

  onSubmitEmail() {
    if (this.emailForm.invalid) {
      if (this.emailForm.controls['email'].errors?.['required']) {
        this.openSnackbar('Please enter an email address', 'danger');
      } else if (this.emailForm.controls['email'].errors?.['email']) {
        this.openSnackbar('Invalid email, please enter a valid input', 'danger');
      } else if (this.emailForm.controls['email'].errors?.['invalidDomain']) {
        this.openSnackbar('Email domain is not valid.', 'danger');
      }
      return;
    }
  
    const email = this.emailForm.controls['email'].value;
  
    // Send request to the backend
    this.sendTrialCode(email)
      .subscribe({
        next: (response: any) => {
          // On success, show the snackbar message
          this.openSnackbar(`OTP has been sent to your email: "${email}"`, 'success');
          this.emailForm.reset();
        },
        error: (error: any) => {
          // On error, show error message
          this.openSnackbar('Failed to send OTP. Please try again later.', 'danger');
        }
      });
  }
  
  // Send trial code request to the backend
  sendTrialCode(email: string) {
    return this.http.post('https://localhost:7185/api/FreeTrial/SendTrialCode', { email })
      .pipe(
        catchError((error) => {
          // Handle error and rethrow
          return throwError(error);
        })
      );
  }

  // Placeholder function for checking if email is already used
  isEmailAlreadyUsed(email: string): boolean {
    // Simulate email already used
    return false; // Change logic accordingly
  }

  // Placeholder function to determine if email is a guest email
  isGuestEmail(email: string): boolean {
    // Simulate guest check
    return false; // Change logic accordingly
  }

  // Snackbar method for displaying messages
  openSnackbar(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-danger'
    });
  }
  
  ngOnInit(): void {
    this.updateTransform();
    this.startAutoSlide();

    this.updateTime(); // Initialize the time on load
    setInterval(() => {
      this.updateTime(); // Update the time every second
    }, 1000);


  }

  // Function to update the time based on CAT (UTC+2)
  updateTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Johannesburg',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    this.currentTime = new Intl.DateTimeFormat('en-GB', options).format(now);
  }
  
  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
  
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Slide every 3 seconds
  }
  
  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  nextSlide(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.currentIndex++;
      this.updateTransform();
  
      setTimeout(() => {
        if (this.currentIndex >= this.images.length - 1) {
          this.currentIndex = 1;  // Jump back to the first real image
          this.disableTransition();
          this.updateTransform();
        }
        this.isTransitioning = false;
        this.enableTransition();
      }, 600); // Match the transition duration
    }
  }
  
  prevSlide(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.currentIndex--;
      this.updateTransform();
  
      setTimeout(() => {
        if (this.currentIndex <= 0) {
          this.currentIndex = this.images.length - 2;  // Jump to the last real image
          this.disableTransition();
          this.updateTransform();
        }
        this.isTransitioning = false;
        this.enableTransition();
      }, 600); // Match the transition duration
    }
  }
  
  updateTransform(): void {
    const carousel = document.querySelector('.carousel-images') as HTMLElement;
    const width = 200; // Image width
    carousel.style.transform = `translateX(-${this.currentIndex * width}px)`;
  }
  
  enableTransition(): void {
    const carousel = document.querySelector('.carousel-images') as HTMLElement;
    carousel.style.transition = 'transform 0.6s ease-in-out';
  }
  
  disableTransition(): void {
    const carousel = document.querySelector('.carousel-images') as HTMLElement;
    carousel.style.transition = 'none';
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
  }

  openModal(modalType: string): void {
    if (modalType === 'about') {
      this.isAboutUsModalVisible = true;
    } else if (modalType === 'community') {
      this.isCommunityModalVisible = true;
    }
  }

  closeModal(): void {
    this.isAboutUsModalVisible = false;
    this.isCommunityModalVisible = false;
  }

  toggleShowMoreAboutUs() {
    this.showMoreAboutUs = !this.showMoreAboutUs;
  }

  toggleShowMoreCommunity() {
    this.showMoreCommunity = !this.showMoreCommunity;
  }

}
