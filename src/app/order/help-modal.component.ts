import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-modal.component.html',
  styleUrl: './help-modal.component.css'
})
export class HelpModalComponent implements OnInit {
  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2; 

  constructor() {}

  ngOnInit(): void {
    // Initialize help content
    this.helpContent = [
      {
        title: 'Navbar Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The navbar is a persistent element located at the top of the screen, providing quick access to key features of the AV MERCH application. It contains links to your wishlist, cart, and a help section. The navbar is designed to enhance your navigation experience and ensure that essential functions are always within reach.</p>
          <p><strong>Elements and Features:</strong></p>
          <ol>
            <li>Wishlist Icon</li>
            <li>Cart Icon</li>
            <li>Help Icon</li>
          </ol>
          <p><strong>1. Wishlist Icon</strong></p>
          <ul>
            <li><strong>Description:</strong> The wishlist icon is represented by a heart symbol. It displays the number of items currently in your wishlist.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>View Wishlist:</strong> Clicking on the heart icon will navigate you to the wishlist page, where you can view and manage your wishlist items.</li>
                <li><strong>Item Count:</strong> The number next to the heart icon indicates how many items are in your wishlist.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the wishlist to save products you are interested in but not ready to purchase immediately.</li>
              </ul>
            </li>
          </ul>
          <p><strong>2. Cart Icon</strong></p>
          <ul>
            <li><strong>Description:</strong> The cart icon is represented by a shopping cart symbol. It shows the total number of items in your cart.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>View Cart:</strong> Clicking on the cart icon will navigate you to the cart page, where you can review and manage the items you plan to purchase.</li>
                <li><strong>Item Count:</strong> The number next to the cart icon represents the total items in your cart.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Regularly review your cart to ensure all items are correct before proceeding to checkout.</li>
                <li>Adjust quantities or remove items directly from the cart page if necessary.</li>
              </ul>
            </li>
          </ul>
          <p><strong>3. Help Icon</strong></p>
          <ul>
            <li><strong>Description:</strong> The help icon is represented by an information symbol.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>View Help Section:</strong> Clicking on the help icon will this pop-up screen, which contains detailed information and FAQs about using the application and troubleshooting common issues.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Visit the help section whenever you have questions or need guidance on how to use different features of the application.</li>
                <li>The help section is regularly updated with new information, so check back often for the latest tips and guides.</li>
              </ul>
            </li>
          </ul>
          <p><strong>Technical Details:</strong></p>
          <ul>
            <li><strong>Dynamic Counts:</strong> The wishlist and cart icons dynamically update their item counts based on your interactions. These counts are updated in real-time to reflect the current state of your wishlist and cart.</li>
            <li><strong>Router Integration:</strong> Clicking the icons uses Angular's Router to navigate to the respective pages without a full page reload, ensuring a smooth user experience.</li>
          </ul>
          <p><strong>Common Questions:</strong></p>
          <p><strong>Q:</strong> How do I know how many items are in my wishlist or cart?</p>
          <p><strong>A:</strong> The numbers next to the heart and cart icons indicate the total items in your wishlist and cart, respectively. These numbers update automatically as you add or remove items.</p>
          <p><strong>Q:</strong> What happens when I click on the wishlist or cart icon?</p>
          <p><strong>A:</strong> Clicking the wishlist icon will take you to the wishlist page, where you can view and manage your wishlist items. Clicking the cart icon will take you to the cart page, where you can review and manage your cart items.</p>
          <p><strong>Q:</strong> Where can I find help if I'm confused about how to use a feature?</p>
          <p><strong>A:</strong> Click the help icon (information symbol) to navigate to the help section. This section contains detailed information, FAQs, and troubleshooting tips to assist you with using the application.</p>
          <p><strong>Troubleshooting:</strong></p>
          <p><strong>Problem:</strong> The item counts next to the wishlist or cart icons are not updating.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and try refreshing the page. If the issue persists, it may be a temporary problem with the server. Contact support for further assistance.</p>
          <p><strong>Problem:</strong> Clicking the icons does not navigate to the expected page.</p>
          <p><strong>Solution:</strong> This could be due to a temporary issue with the navigation system. Try refreshing the page. If the problem continues, report it to customer support.</p>`
      },
      {
        title: 'Side Navbar Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The side navbar allows you to filter and navigate products by categories. It slides in from the side of the screen and includes a toggle button for opening and closing the sidebar.</p>
          <p><strong>What You Can Do:</strong></p>
          <ol>
            <li><strong>Filter Products by Category:</strong>
              <ul>
                <li>Click on any of the category options to filter products displayed on the screen.</li>
                <li>All: Displays all available products.</li>
                <li>Tops: Displays products categorized as tops.</li>
                <li>Bottoms: Displays products categorized as bottoms.</li>
                <li>Gear: Displays products categorized as gear.</li>
              </ul>
            </li>
            <li><strong>Toggle Sidebar:</strong>
              <ul>
                <li>Use the toggle button to open and close the side navbar. When the sidebar is closed, the button shows a list icon; when open, it shows a close icon.</li>
              </ul>
            </li>
          </ol>
          <p><strong>Helpful Tips:</strong></p>
          <ul>
            <li>The sidebar helps you quickly find products by narrowing down the selection to specific categories.</li>
            <li>After selecting a category, the sidebar will automatically close, providing more space for browsing the filtered products.</li>
          </ul>
          <p><strong>Usage:</strong></p>
          <ul>
            <li>Open/Close Sidebar: Click the toggle button to open or close the sidebar.</li>
            <li>Select Category: Click on a category name to filter the displayed products.</li>
          </ul>`
      },
      {
        title: 'Product List Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Product List screen is your main interface for browsing, searching, and filtering products in the AV MERCH application. It features a header for navigation and searching, a sidebar for category filtering, and a dynamic product display area.</p>
          <p><strong>Elements and Features:</strong></p>
          <ol>
            <li>Header Navigation</li>
            <li>Search Bar</li>
            <li>Category Filter Sidebar</li>
            <li>Product Display Area</li>
          </ol>
          <p><strong>Detailed Help:</strong></p>
          <p><strong>1. Header Navigation</strong></p>
          <ul>
            <li><strong>Description:</strong> The header is located at the top of the Product List screen and provides key navigation elements.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Back Button:</strong> The back arrow icon allows you to return to your previous screen.</li>
                <li><strong>Title:</strong> Displays "AV MERCH" to indicate you are on the product list page.</li>
                <li><strong>Search Bar:</strong> Allows you to search for specific products by typing keywords.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the back button to quickly navigate to your home screen based on your user type.</li>
                <li>The title provides a visual confirmation that you are browsing products.</li>
              </ul>
            </li>
          </ul>
          <p><strong>2. Search Bar</strong></p>
          <ul>
            <li><strong>Description:</strong> The search bar is located in the header and allows you to find products quickly.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Search Input:</strong> Type in keywords to filter the products displayed in real-time.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the search bar for precise product searches.</li>
                <li>Clear the search bar to reset the product list to show all available items.</li>
              </ul>
            </li>
          </ul>
          <p><strong>3. Category Filter Sidebar</strong></p>
          <ul>
            <li><strong>Description:</strong> The sidebar allows you to filter products by categories.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Toggle Button:</strong> Click to open or close the sidebar.</li>
                <li><strong>Category Options:</strong> Choose from "All," "Tops," "Bottoms," and "Gear" to filter the products displayed.</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use the category filter to narrow down the products based on your preferences.</li>
                <li>The sidebar will close automatically after you select a category to provide a better view of the products.</li>
              </ul>
            </li>
          </ul>
          <p><strong>4. Product Display Area</strong></p>
          <ul>
            <li><strong>Description:</strong> The main section where products are displayed.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Product Cards:</strong> Each product is shown in a card with an image and name. Click on the product image or name to see more details.</li>
                <li><strong>No Products Found Message:</strong> If no products match your search or filter, a message will display saying "No Products Found."</li>
              </ul>
            </li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Scroll through the product cards to browse available items.</li>
                <li>Click on a product card to view detailed information and purchase options.</li>
              </ul>
            </li>
          </ul>
          <p><strong>Technical Details:</strong></p>
          <ul>
            <li><strong>Dynamic Updates:</strong> The search bar and category filters update the product list in real-time based on your input.</li>
            <li><strong>Router Integration:</strong> Clicking on a product image or name uses Angular's Router to navigate to the product detail page without a full page reload, ensuring a smooth user experience.</li>
          </ul>
          <p><strong>Common Questions:</strong></p>
          <p><strong>Q:</strong> How do I filter products by category?</p>
          <p><strong>A:</strong> Click the toggle button to open the sidebar and select a category (All, Tops, Bottoms, Gear). The product list will update to show only products in the selected category.</p>
          <p><strong>Q:</strong> How can I search for a specific product?</p>
          <p><strong>A:</strong> Use the search bar at the top of the screen. Type in the keywords related to the product you are looking for, and the product list will filter in real-time.</p>
          <p><strong>Q:</strong> What should I do if no products are displayed?</p>
          <p><strong>A:</strong> Ensure that your search term is correct and that you have not selected a category with no available products. Clear the search bar and select "All" in the category filter to reset the product list.</p>
          <p><strong>Troubleshooting:</strong></p>
          <p><strong>Problem:</strong> The product list does not update when I use the search bar or category filter.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and try refreshing the page. If the issue persists, it may be a temporary problem with the server. Contact support for further assistance.</p>
          <p><strong>Problem:</strong> Clicking on a product does not navigate to the product detail page.</p>
          <p><strong>Solution:</strong> This could be due to a temporary issue with the navigation system. Try refreshing the page. If the problem continues, report it to customer support.</p>`
      },
      {
        title: 'Product Item Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Product Item screen provides detailed information about a selected product, including its description, available sizes, quantity controls, and options to add to the cart or wishlist.</p>
          <p><strong>What You Can Do:</strong></p>
          <ol>
            <li>View Product Details</li>
            <li>Select Size</li>
            <li>Adjust Quantity</li>
            <li>Add to Cart</li>
            <li>Add to Wishlist</li>
          </ol>
          <p><strong>Detailed Help:</strong></p>
          <p><strong>1. View Product Details</strong></p>
          <ul>
            <li><strong>Description:</strong> The product item screen displays detailed information about the product, including a larger image, product name, description, price, and available sizes.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Product Image:</strong> Displays a larger view of the product.</li>
                <li><strong>Product Name:</strong> Shows the name of the product.</li>
                <li><strong>Product Description:</strong> Provides a detailed description of the product.</li>
                <li><strong>Price:</strong> Indicates the price of the product.</li>
              </ul>
            </li>
          </ul>
          <p><strong>2. Select Size</strong></p>
          <ul>
            <li><strong>Description:</strong> Allows you to select the desired size for the product from the available options.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Size Dropdown:</strong> Click to open a dropdown menu with available sizes. Select the desired size from the list.</li>
              </ul>
            </li>
          </ul>
          <p><strong>3. Adjust Quantity</strong></p>
          <ul>
            <li><strong>Description:</strong> Allows you to set the desired quantity of the product.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Quantity Input:</strong> Use the plus and minus buttons to adjust the quantity. The input field shows the current quantity.</li>
              </ul>
            </li>
          </ul>
          <p><strong>4. Add to Cart</strong></p>
          <ul>
            <li><strong>Description:</strong> Adds the selected product, along with the chosen size and quantity, to your shopping cart.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Add to Cart Button:</strong> Click to add the product to your cart. A confirmation message will be displayed.</li>
              </ul>
            </li>
          </ul>
          <p><strong>5. Add to Wishlist</strong></p>
          <ul>
            <li><strong>Description:</strong> Adds the product to your wishlist for future consideration.</li>
            <li><strong>Functionality:</strong>
              <ul>
                <li><strong>Wishlist Button:</strong> Click the heart icon to add the product to your wishlist. The heart icon will change to indicate the product has been added.</li>
              </ul>
            </li>
          </ul>
          <p><strong>Helpful Tips:</strong></p>
          <ul>
            <li>Ensure you select the correct size before adding the product to your cart or wishlist.</li>
            <li>Adjust the quantity to match your needs before adding to the cart.</li>
            <li>Check the product description for detailed information about the product, including material, care instructions, and sizing recommendations.</li>
          </ul>
          <p><strong>Common Questions:</strong></p>
          <p><strong>Q:</strong> How do I know what sizes are available?</p>
          <p><strong>A:</strong> Click the size dropdown to view a list of available sizes for the product.</p>
          <p><strong>Q:</strong> Can I change the quantity after adding the product to the cart?</p>
          <p><strong>A:</strong> Yes, you can adjust the quantity of the product in your cart before proceeding to checkout.</p>
          <p><strong>Q:</strong> How do I remove a product from my wishlist?</p>
          <p><strong>A:</strong> Click the heart icon on the product item screen again to remove the product from your wishlist.</p>
          <p><strong>Troubleshooting:</strong></p>
          <p><strong>Problem:</strong> The size dropdown does not show any options.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and try refreshing the page. If the issue persists, the product may be out of stock in all sizes. Contact support for further assistance.</p>
          <p><strong>Problem:</strong> The add to cart button is not working.</p>
          <p><strong>Solution:</strong> This could be due to a temporary issue with the server. Try refreshing the page. If the problem continues, report it to customer support.</p>`
      },
      {
        title: 'Wishlist Context-Sensitive Help',
        content: `
            <p><strong>Overview:</strong> The Wishlist component in the AV MERCH application allows users to save products they are interested in but are not ready to purchase immediately. This feature provides a convenient way to keep track of items for future reference.</p>
            <p><strong>Elements and Features:</strong></p>
            <p><strong>1. Header</strong></p>
            <ul>
                <li><strong>Back Icon:</strong>
                    <ul>
                        <li><strong>Description:</strong> The back arrow icon (bi-arrow-left-circle) allows you to return to the previous page, helping you navigate seamlessly.</li>
                        <li><strong>Functionality:</strong> Clicking this icon will navigate you back to the product list.</li>
                    </ul>
                </li>
                <li><strong>Title:</strong>
                    <ul>
                        <li><strong>Description:</strong> The title "AV MERCH" is displayed in the header.</li>
                        <li><strong>Functionality:</strong> Serves as a visual reference for the application name.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>2. Wishlist Content</strong></p>
            <ul>
                <li><strong>Wishlist Items Table:</strong>
                    <ul>
                        <li><strong>Description:</strong> Displays the list of items added to the wishlist, including product image, name, description, price, size, and action buttons.</li>
                        <li><strong>Functionality:</strong>
                            <ul>
                                <li><strong>Product Image:</strong> Shows the image of the product.</li>
                                <li><strong>Product Name:</strong> Displays the name of the product.</li>
                                <li><strong>Description:</strong> Provides a brief description of the product.</li>
                                <li><strong>Price:</strong> Shows the unit price of the product.</li>
                                <li><strong>Size:</strong> Displays the size of the product.</li>
                                <li><strong>Move to Cart Button:</strong> A button to move the item from the wishlist to the cart.</li>
                                <li><strong>Remove from Wishlist Icon:</strong> An icon to remove the item from the wishlist.</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li><strong>Empty Wishlist Message:</strong>
                    <ul>
                        <li><strong>Description:</strong> Displays a message indicating that the wishlist is empty when there are no items.</li>
                        <li><strong>Functionality:</strong> Helps inform the user that their wishlist does not contain any items.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>Helpful Tips:</strong></p>
            <ul>
                <li>Using the Wishlist: Save products you are interested in but not ready to purchase immediately.</li>
                <li>Review Regularly: Regularly check your wishlist to see if any items are back in stock or if there are any promotions available.</li>
            </ul>
            <p><strong>Technical Details:</strong></p>
            <ul>
                <li>Dynamic Updates: The wishlist updates in real-time as you add or remove items.</li>
                <li>Angular Integration: The component utilizes Angular's Router to navigate between pages without a full page reload, ensuring a smooth user experience.</li>
            </ul>
            <p><strong>Common Questions:</strong></p>
            <p><strong>Q:</strong> How do I move an item from the wishlist to the cart?</p>
            <p><strong>A:</strong> Click the "Move to Cart" button next to the item you wish to move.</p>
            <p><strong>Q:</strong> How do I remove an item from my wishlist?</p>
            <p><strong>A:</strong> Click the "x" icon next to the item you wish to remove.</p>
            <p><strong>Q:</strong> What happens if my wishlist is empty?</p>
            <p><strong>A:</strong> An empty wishlist message will be displayed, indicating that there are no items in your wishlist.</p>
            <p><strong>Troubleshooting:</strong></p>
            <p><strong>Problem:</strong> The wishlist items are not loading.</p>
            <p><strong>Solution:</strong> Ensure you are connected to the internet and try refreshing the page. If the issue persists, it may be a temporary problem with the server. Contact support for further assistance.</p>
            <p><strong>Problem:</strong> Clicking the "Move to Cart" button does not work.</p>
            <p><strong>Solution:</strong> This could be due to a temporary issue with the server or the internet connection. Try refreshing the page. If the problem continues, report it to customer support.</p>
        `
      },
      {
        title: 'Cart Context-Sensitive Help',
        content: `
            <p><strong>Overview:</strong> The Cart component in the AV MERCH application allows users to review and manage the items they plan to purchase. This feature provides a convenient way to view product details, adjust quantities, and proceed to checkout.</p>
            <p><strong>Elements and Features:</strong></p>
            <p><strong>1. Header</strong></p>
            <ul>
                <li><strong>Back Icon:</strong>
                    <ul>
                        <li><strong>Description:</strong> The back arrow icon (bi-arrow-left-circle) allows you to return to the previous page, helping you navigate seamlessly.</li>
                        <li><strong>Functionality:</strong> Clicking this icon will navigate you back to the product list.</li>
                    </ul>
                </li>
                <li><strong>Title:</strong>
                    <ul>
                        <li><strong>Description:</strong> The title "AV MERCH" is displayed in the header.</li>
                        <li><strong>Functionality:</strong> Serves as a visual reference for the application name.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>2. Cart Content</strong></p>
            <ul>
                <li><strong>Cart Items Table:</strong>
                    <ul>
                        <li><strong>Description:</strong> Displays the list of items added to the cart, including product image, name, quantity, price, total price, and action buttons.</li>
                        <li><strong>Functionality:</strong>
                            <ul>
                                <li><strong>Product Image:</strong> Shows the image of the product.</li>
                                <li><strong>Product Name:</strong> Displays the name of the product.</li>
                                <li><strong>Quantity:</strong> Allows you to adjust the quantity of the product.</li>
                                <li><strong>Increase Button:</strong> Increases the quantity of the product.</li>
                                <li><strong>Decrease Button:</strong> Decreases the quantity of the product.</li>
                                <li><strong>Price:</strong> Shows the unit price of the product.</li>
                                <li><strong>Total Price:</strong> Displays the total price for the quantity of the product.</li>
                                <li><strong>Remove Item Icon:</strong> An icon to remove the item from the cart.</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li><strong>Empty Cart Message:</strong>
                    <ul>
                        <li><strong>Description:</strong> Displays a message indicating that the cart is empty when there are no items.</li>
                        <li><strong>Functionality:</strong> Helps inform the user that their cart does not contain any items.</li>
                    </ul>
                </li>
                <li><strong>Checkout Button:</strong>
                    <ul>
                        <li><strong>Description:</strong> A button to proceed to the checkout page.</li>
                        <li><strong>Functionality:</strong> Navigates to the checkout page where you can review your order and complete the purchase.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>Helpful Tips:</strong></p>
            <ul>
                <li>Review Regularly: Regularly review your cart to ensure all items are correct before proceeding to checkout.</li>
                <li>Adjust Quantities: Adjust quantities or remove items directly from the cart page if necessary.</li>
            </ul>
            <p><strong>Technical Details:</strong></p>
            <ul>
                <li>Dynamic Updates: The cart updates in real-time as you add or remove items.</li>
                <li>Angular Integration: The component utilizes Angular's Router to navigate between pages without a full page reload, ensuring a smooth user experience.</li>
            </ul>
            <p><strong>Common Questions:</strong></p>
            <p><strong>Q:</strong> How do I change the quantity of an item in my cart?</p>
            <p><strong>A:</strong> Use the increase (bi-arrow-right-circle-fill) and decrease (bi-arrow-left-circle-fill) buttons next to the item quantity to adjust the quantity.</p>
            <p><strong>Q:</strong> How do I remove an item from my cart?</p>
            <p><strong>A:</strong> Click the "x" icon (bi-x-circle-fill) next to the item you wish to remove.</p>
            <p><strong>Q:</strong> What happens if my cart is empty?</p>
            <p><strong>A:</strong> An empty cart message will be displayed, indicating that there are no items in your cart.</p>
            <p><strong>Q:</strong> How do I proceed to checkout?</p>
            <p><strong>A:</strong> Click the "Checkout" button to navigate to the checkout page.</p>
            <p><strong>Troubleshooting:</strong></p>
            <p><strong>Problem:</strong> The cart items are not loading.</p>
            <p><strong>Solution:</strong> Ensure you are connected to the internet and try refreshing the page. If the issue persists, it may be a temporary problem with the server. Contact support for further assistance.</p>
            <p><strong>Problem:</strong> Clicking the "Checkout" button does not navigate to the checkout page.</p>
            <p><strong>Solution:</strong> This could be due to a temporary issue with the server or the internet connection. Try refreshing the page. If the problem continues, report it to customer support.</p>
        `
      },
      {
        title: 'Checkout Context-Sensitive Help',
        content: `
            <p><strong>Overview:</strong> The checkout screen is a crucial part of the AV MERCH application, where users finalize their purchases. It provides a detailed summary of the order, including all items, prices, and quantities, along with a secure payment option via PayFast. The design ensures a smooth and secure checkout experience.</p>
            <p><strong>Elements and Features:</strong></p>
            <p><strong>1. Navbar</strong></p>
            <ul>
                <li><strong>Description:</strong> A persistent navigation bar at the top, providing access to essential features.</li>
                <li><strong>Functionality:</strong> Allows quick navigation to wishlist, cart, and help sections.</li>
            </ul>
            <p><strong>2. Back Button</strong></p>
            <ul>
                <li><strong>Description:</strong> An arrow icon that takes you back to the previous page.</li>
                <li><strong>Functionality:</strong> Clicking the back button navigates to the previous page, typically the cart.</li>
                <li><strong>Helpful Tips:</strong>
                    <ul>
                        <li>Use the back button if you need to modify your cart before proceeding with the payment.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>3. Order Summary</strong></p>
            <ul>
                <li><strong>Description:</strong> A card displaying all items in the cart, their prices, quantities, and the total amount.</li>
                <li><strong>Functionality:</strong>
                    <ul>
                        <li><strong>Item List:</strong> Shows each product in the cart with its name, unit price, and quantity.</li>
                        <li><strong>Total Price:</strong> Displays the total cost of all items in the cart.</li>
                    </ul>
                </li>
                <li><strong>Helpful Tips:</strong>
                    <ul>
                        <li>Review the order summary to ensure all items and quantities are correct before proceeding to payment.</li>
                        <li>Check the total price to confirm it matches your expectations.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>4. Payment and Cancel Options</strong></p>
            <ul>
                <li><strong>Description:</strong> Provides options to either proceed with the payment using PayFast or cancel and return to the cart.</li>
                <li><strong>Functionality:</strong>
                    <ul>
                        <li><strong>Cancel Button:</strong> Clicking this button will take you back to the cart page.</li>
                        <li><strong>PayFast Payment:</strong> Initiates the payment process using the PayFast gateway.</li>
                    </ul>
                </li>
                <li><strong>Helpful Tips:</strong>
                    <ul>
                        <li>Use the cancel button if you need to make changes to your cart.</li>
                        <li>Ensure you have reviewed all items in the order summary before clicking the Pay Now button.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>Technical Details:</strong></p>
            <ul>
                <li>Dynamic Data: The order summary dynamically updates based on the items in your cart, reflecting real-time changes.</li>
                <li>Secure Payment: The PayFast integration ensures a secure transaction process.</li>
                <li>Navigation: Utilizes Angular's Router for smooth page transitions.</li>
            </ul>
            <p><strong>Common Questions:</strong></p>
            <p><strong>Q:</strong> How do I know the total amount I need to pay?</p>
            <p><strong>A:</strong> The total price is displayed at the bottom of the order summary. It automatically updates based on the items and quantities in your cart.</p>
            <p><strong>Q:</strong> What happens if I click the cancel button?</p>
            <p><strong>A:</strong> Clicking the cancel button will navigate you back to the cart page, allowing you to make any necessary changes to your cart before checking out again.</p>
            <p><strong>Q:</strong> How secure is the payment process?</p>
            <p><strong>A:</strong> The payment process uses PayFast, a secure and trusted payment gateway. All transactions are encrypted and securely processed.</p>
            <p><strong>Troubleshooting:</strong></p>
            <p><strong>Problem:</strong> The total amount doesn't seem correct.</p>
            <p><strong>Solution:</strong> Ensure all items and quantities in the cart are correct. If the issue persists, try refreshing the page or contact support for assistance.</p>
            <p><strong>Problem:</strong> The Pay Now button is not working.</p>
            <p><strong>Solution:</strong> Ensure you have a stable internet connection and try again. If the problem continues, it may be a temporary issue with the PayFast gateway. Contact support for further help.</p>
        `
      },
      {
        title: 'Order Context-Sensitive Help',
        content: `
            <p><strong>Overview:</strong> The order screen in the AV MERCH application displays all your past and current orders. It provides detailed information about each order, including order ID, order details, order date, total price, and status. This screen helps you track and manage your purchases effectively.</p>
            <p><strong>Elements and Features:</strong></p>
            <p><strong>1. Navbar</strong></p>
            <ul>
                <li><strong>Description:</strong> A persistent navigation bar at the top, providing access to essential features like wishlist, cart, and help.</li>
                <li><strong>Functionality:</strong> Allows quick navigation throughout the application without losing context.</li>
            </ul>
            <p><strong>2. Back Button</strong></p>
            <ul>
                <li><strong>Description:</strong> An arrow icon located in the header that allows you to return to the previous page.</li>
                <li><strong>Functionality:</strong> Clicking the back button navigates to the previous page you visited, typically the main shopping or account page.</li>
                <li><strong>Helpful Tips:</strong>
                    <ul>
                        <li>Use the back button if you want to return to your previous page without losing your current context.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>3. Orders Section</strong></p>
            <ul>
                <li><strong>Description:</strong> Displays a list of all your orders in a tabular format with detailed information.</li>
                <li><strong>Functionality:</strong>
                    <ul>
                        <li><strong>Order ID:</strong> A unique identifier for each order.</li>
                        <li><strong>Order Details:</strong> Displays the product names, quantities, and prices for each item in the order.</li>
                        <li><strong>Order Date:</strong> The date and time when the order was placed.</li>
                        <li><strong>Total Price:</strong> The total cost of the order.</li>
                        <li><strong>Status:</strong> The current status of the order, such as "Ready for Collection," "Overdue for Collection," "Collected," or "Late Collection."</li>
                    </ul>
                </li>
                <li><strong>Helpful Tips:</strong>
                    <ul>
                        <li>Regularly check your order status to know when your orders are ready for collection.</li>
                        <li>Review order details to confirm the correct items and quantities were ordered.</li>
                    </ul>
                </li>
            </ul>
            <p><strong>Technical Details:</strong></p>
            <ul>
                <li>Dynamic Data: The order list dynamically updates based on your orders, reflecting real-time changes.</li>
                <li>Status Update: The status of each order is updated based on backend data, ensuring you have the latest information.</li>
                <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
            </ul>
            <p><strong>Common Questions:</strong></p>
            <p><strong>Q:</strong> How do I know the status of my order?</p>
            <p><strong>A:</strong> The status column in the order table displays the current status of each order. Possible statuses include "Ready for Collection," "Overdue for Collection," "Collected," and "Late Collection."</p>
            <p><strong>Q:</strong> What should I do if my order is marked as "Overdue for Collection"?</p>
            <p><strong>A:</strong> If your order is overdue, it means it was not collected within the expected timeframe. Contact customer support for assistance or visit the collection point as soon as possible.</p>
            <p><strong>Q:</strong> How can I view the details of my past orders?</p>
            <p><strong>A:</strong> The order details column in the order table provides a summary of all items in your order, including product names, quantities, and prices.</p>
            <p><strong>Q:</strong> What happens if I click the back button?</p>
            <p><strong>A:</strong> Clicking the back button will navigate you to the previous page you visited. This helps you return to your shopping or account management quickly.</p>
            <p><strong>Troubleshooting:</strong></p>
            <p><strong>Problem:</strong> The order list is not displaying any orders.</p>
            <p><strong>Solution:</strong> Ensure you are logged in and connected to the internet. If the problem persists, try refreshing the page or contact support for assistance.</p>
            <p><strong>Problem:</strong> The order status is not updating.</p>
            <p><strong>Solution:</strong> Check your internet connection and try refreshing the page. If the issue continues, it may be a temporary problem with the server. Contact support for further help.</p>
            <p><strong>Problem:</strong> Clicking the back button does not return to the expected page.</p>
            <p><strong>Solution:</strong> This could be due to navigation issues. Try refreshing the page or using the main navigation bar to navigate to your desired page.</p>
        `
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
    this.currentPage = 1; // Reset to the first page after filtering
  }

  getPaginatedContent(): any[] {
    const startIndex = (this.currentPage - 1);
    const endIndex = startIndex + 1;
    return this.filteredContent.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return this.filteredContent.length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  // Method to export help content to PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    let y = 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    this.helpContent.forEach(item => {
      if (y + 10 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(14);
      doc.text(item.title, margin, y);
      y += 10;

      doc.setFontSize(12);

      const plainText = this.htmlToPlainText(item.content);
      const splitContent = doc.splitTextToSize(plainText, 180 - 2 * margin);

      splitContent.forEach((line: string) => {
        if (y + 7 > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 5;
      });

      y += 7; // Add space between sections
    });

    doc.save('help-guide.pdf');
  }

  // Method to convert HTML content to plain text
  htmlToPlainText(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
}
