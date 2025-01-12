import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../Services/userprofile.service';
import { UserViewModel } from '../shared/search-user';
import { Location } from '@angular/common';
import { UserProfile } from '../Models/UserProfile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
declare var $: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, MasterSideNavBarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  searchCriteria: string = '';
  users: UserViewModel[] = [];
  filteredUsers: UserViewModel[] = [];
  selectedUser: UserViewModel | null = null;
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];
 
  constructor(private router: Router, private userService: UserService, private location: Location, private snackBar: MatSnackBar) { }
 
  ngOnInit(): void {
    this.loadUsers();

    // Initialize help content
    this.helpContent = [
      {
        title: 'Users Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Users page allows administrators to view, search, and manage user accounts within the system. You can search for specific users, view their details, and update their status (activate or deactivate).</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> To filter and find specific users in the list.</li>
            <li><strong>Usage:</strong> Enter search criteria such as user ID, name, or surname to filter the displayed users. The table updates in real-time based on the search input.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific terms to quickly locate a user.</li>
                <li>Ensure correct spelling of search terms for accurate results.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Update Deletion Settings Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate to the page where deletion settings can be updated.</li>
            <li><strong>Usage:</strong> Click this button to access the deletion settings for the system.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Verify you have the necessary permissions to update deletion settings.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Users Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a list of users with their details and actions.</li>
            <li><strong>Usage:</strong> 
              <ul>
                <li><strong>User ID:</strong> Unique identifier for each user.</li>
                <li><strong>Name:</strong> User’s first name.</li>
                <li><strong>Surname:</strong> User’s last name.</li>
                <li><strong>Status:</strong> Indicates whether the user is active or deactivated.</li>
                <li><strong>Actions:</strong> Includes buttons to view user details and change user status.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Review user details and statuses regularly to manage user accounts effectively.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. View Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Opens a modal displaying detailed information about the user.</li>
            <li><strong>Usage:</strong> Click the “View” button to see details such as User ID, Name, and Surname.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button to access comprehensive details before performing other actions.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Deactivate Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Change the status of the user to deactivated.</li>
            <li><strong>Usage:</strong> Click the “Deactivate” button for users currently active. This option is visible for users with certain user types (2 or 3).</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Ensure that you have selected the correct user before deactivating.</li>
                <li>Check for confirmation messages to verify the status change.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '6. Reactivate Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Change the status of the user back to active.</li>
            <li><strong>Usage:</strong> Click the “Reactivate” button for users who are currently deactivated. This option is visible for users with certain user types (2 or 3).</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Verify the user’s current status before reactivation.</li>
                <li>Ensure you receive a confirmation that the status has been updated.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Modal for Viewing User Details',
        content: `
          <ul>
            <li><strong>User Details:</strong> Display detailed information about the selected user.</li>
            <li><strong>Usage:</strong> The modal shows the User ID, Name, and Surname. Click "Close" to exit the modal.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the modal to review user information in detail before making changes.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I search for a user?</p>
          <p><strong>A:</strong> Enter search terms in the "Search Users" input field. The table will filter users based on ID, name, or surname matching the search criteria.</p>
          <p><strong>Q:</strong> What should I do if the user list is not updating after deactivating or reactivating a user?</p>
          <p><strong>A:</strong> Ensure that the deactivateUser or reactivateUser methods are successfully called and that the loadUsers method is reloading the user data. Check for any errors in the browser console and ensure that network requests are successful.</p>
          <p><strong>Q:</strong> How can I view a user’s details?</p>
          <p><strong>A:</strong> Click the “View” button next to the user in the table. This will open a modal with detailed information about the user.</p>
          <p><strong>Q:</strong> What if the "Update Deletion Settings" button is not working?</p>
          <p><strong>A:</strong> Ensure that the button is properly linked to the "/deletion-settings" route and that the router configuration is correct. Check for any navigation errors in the console.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The user list is not updating after deactivating or reactivating a user.</p>
          <p><strong>Solution:</strong> Ensure the deactivateUser or reactivateUser methods are functioning correctly and the loadUsers method is reloading the list. Refresh the page or check the network requests for errors if needed.</p>
          <p><strong>Problem:</strong> The search bar is not filtering results accurately.</p>
          <p><strong>Solution:</strong> Verify that search terms are correctly entered and check for any issues with real-time updates.</p>`
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

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users: UserViewModel[]) => {
      this.users = users;
      this.filteredUsers = users;
      console.log(users);
    });
  }
 
  filterUsers(): void {
    const term = this.searchCriteria.toLowerCase();
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.user_ID.toString().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.surname.toLowerCase().includes(term)
      );
    }
  }
  
  deactivateUser(id: number): void {
    this.userService.deactivateUser(id).subscribe({
      next: (response) => {
        console.log('User deactivated successfully', response);
        this.snackBar.open('User deactivated successfully', 'Close', { duration: 5000 });
        this.loadUsers();
        // Handle successful deactivation, e.g., refresh the user list
      },
      error: (error) => {
        console.error('Error deactivating user', error);
        this.snackBar.open('User not deactivated. Please try again', 'Close', { duration: 5000 });
      }
    });
  }
  
  reactivateUser(id: number): void {
    this.userService.reactivateUser(id).subscribe({
      next: (response) => {
        console.log('User reactivated successfully', response);
        this.snackBar.open('User reactivated successfully', 'Close', { duration: 5000 });
        this.loadUsers();
        // Handle successful deactivation, e.g., refresh the user list
      },
      error: (error) => {
        console.error('Error deactivating user', error);
        this.snackBar.open('User not reactivated. Please try again', 'Close', { duration: 5000 });
      }
    });
  }

 
  openModal(user: UserViewModel): void {
    this.selectedUser = user;
    $('#userModal').modal('show');
  }
 
  closeModal(): void {
    $('#userModal').modal('hide');
  }
 
  goBack(): void {
    this.location.back();
  }
}
