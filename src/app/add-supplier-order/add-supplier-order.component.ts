import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../Services/supplier.service';
import { SupplierOrderService } from '../Services/supplier-order.service';
import { CommonModule } from '@angular/common';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-add-supplier-order',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './add-supplier-order.component.html',
  styleUrl: './add-supplier-order.component.css'
})
export class AddSupplierOrderComponent implements OnInit{

  userTypeID: number | null = null;
  currentDate: Date = new Date(); // Current date  
  productCategories: any[] = [];
  products: any[] = [];
  orderForm: FormGroup;
  supplierId!: number;
  supplierName: string = ''; 

  searchTerm: string = '';
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private supplierOrderService: SupplierOrderService, private supplierService: SupplierService, private fb: FormBuilder, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) {
    this.orderForm = this.fb.group({
      productCategory: ['', Validators.required],
      product: ['', Validators.required],
      supplierQuantity: ['', [Validators.required, Validators.min(1)]],
      purchasePrice: [{ value: '', disabled: true }, Validators.required],
      totalPrice: [{ value: '', disabled: true }, Validators.required],
      orderDetails: ['', Validators.required]
    });

    this.orderForm.get('supplierQuantity')?.valueChanges.subscribe(() => this.updateTotalPrice());
    this.orderForm.get('purchasePrice')?.valueChanges.subscribe(() => this.updateTotalPrice());
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;

    this.route.params.subscribe(params => {
      this.supplierId = +params['supplierId']; // Retrieve the supplier ID from the route parameters
      this.loadSupplierDetails(); 
    });
    
    this.supplierOrderService.getProductCategories().subscribe(categories => {
      this.productCategories = categories;
    });

    // Initialize help content
    this.helpContent = [
      {
        title: 'Add Supplier Order Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Add Supplier Order page allows you to place a new order with a selected supplier. You can choose the product category, select a product, specify the quantity, and provide additional details about the order. The page calculates the total price automatically based on the product's unit price and the specified quantity.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Date Display',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Shows the current date for the order.</li>
            <li><strong>Usage:</strong> Provides a timestamp for when the order is being placed.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>The current date helps to document when the order was created, ensuring accurate records.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Product Category Selection',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Choose a category to filter products.</li>
            <li><strong>Usage:</strong> Select a category from the dropdown menu. The product list will update to show products belonging to the chosen category.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Selecting a category helps you to find products more efficiently by narrowing down the choices.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Product Selection',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Choose a specific product from the selected category.</li>
            <li><strong>Usage:</strong> Select a product from the dropdown menu. The purchase price for the selected product will be displayed and updated.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Ensure you select the correct product to avoid errors in the order details.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. Quantity Input',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Specify the number of units to order.</li>
            <li><strong>Usage:</strong> Enter the quantity in the input field. The total price will be recalculated based on this quantity.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Enter a quantity greater than 0 to ensure the order is valid.</li>
                <li>The total price will update automatically as you change the quantity.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Order Details',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Add any additional information about the order.</li>
            <li><strong>Usage:</strong> Enter details such as special instructions or notes regarding the order.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Provide clear and concise instructions to avoid any misunderstandings.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '6. Purchase Price per Item',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Display the price of each unit of the selected product.</li>
            <li><strong>Usage:</strong> This field is automatically filled based on the selected product and cannot be edited.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Verify the purchase price before placing the order to ensure accuracy.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '7. Total Price',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Show the total cost of the order.</li>
            <li><strong>Usage:</strong> This field is automatically calculated based on the purchase price and quantity and cannot be edited.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>The total price reflects the cost based on the quantity and unit price. Double-check this amount before submitting the order.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '8. Place Order Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Submit the order.</li>
            <li><strong>Usage:</strong> Click this button to place the order. It will only be enabled if all required fields are correctly filled.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Ensure all fields are complete and accurate before clicking this button.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '9. Cancel Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Cancel the order placement and return to the previous page.</li>
            <li><strong>Usage:</strong> Click this button to navigate back to the supplier list without placing an order.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use this button if you decide not to place the order and want to return to the previous page.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Actions and Buttons',
        content: `
          <p><strong>Select Product Category:</strong> Filter products based on category by selecting a category from the dropdown. The product list will update accordingly.</p>
          <p><strong>Select Product:</strong> Choose a product from the filtered list to see and confirm its purchase price. The total price is updated based on your input.</p>
          <p><strong>Input Quantity:</strong> Specify how many units of the product you want to order by entering a number greater than 0. The total price will be calculated automatically.</p>
          <p><strong>Add Order Details:</strong> Provide any additional information relevant to the order by entering details or instructions in the textarea.</p>
          <p><strong>Place Order Button:</strong> Finalize and submit the order by ensuring all fields are filled correctly and clicking this button. You will receive a confirmation message or error notification based on the outcome.</p>
          <p><strong>Cancel Button:</strong> Exit the form and return to the supplier list by clicking this button to discard any changes and go back to the previous page.</p>`
      },
      {
        title: 'Common Questions',
        content: `
          <p><strong>Q:</strong> How do I filter products by category?</p>
          <p><strong>A:</strong> Select a category from the "Select Product Category" dropdown. The list of products will update to show only those in the selected category.</p>
          <p><strong>Q:</strong> What happens when I select a product?</p>
          <p><strong>A:</strong> The purchase price of the selected product will be displayed. The total price will be calculated based on the entered quantity.</p>
          <p><strong>Q:</strong> How is the total price calculated?</p>
          <p><strong>A:</strong> The total price is computed by multiplying the unit purchase price by the quantity entered. This field updates automatically when the quantity or product changes.</p>
          <p><strong>Q:</strong> What should I do if I encounter an error while placing an order?</p>
          <p><strong>A:</strong> Check for error messages displayed after clicking "Place Order." Ensure all required fields are correctly filled. If the issue persists, contact support for assistance.</p>
          <p><strong>Q:</strong> Can I change the product or quantity after selecting them?</p>
          <p><strong>A:</strong> Yes, you can change the product category, product, or quantity. The form will update the purchase price and total price accordingly.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The product list is not updating after selecting a category.</p>
          <p><strong>Solution:</strong> Ensure you have a stable internet connection. Try refreshing the page or contacting support if the issue persists.</p>
          <p><strong>Problem:</strong> The total price is not updating.</p>
          <p><strong>Solution:</strong> Check if the quantity and product fields are correctly filled. Refresh the page if needed or contact support for assistance.</p>`
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

  loadSupplierDetails(): void {
    this.supplierService.GetSupplier(this.supplierId).subscribe(supplier => {
      this.supplierName = supplier.name; // Assign the supplier's name
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = parseInt(selectElement.value, 10);
    if (!isNaN(categoryId)) {
      this.supplierOrderService.getProductsByCategory(categoryId).subscribe(products => {
        this.products = products;
        console.log('Products loaded:', this.products);
        this.orderForm.get('product')?.setValue('');
      });
    }
  }

  onProductChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const productId = parseInt(selectElement.value, 10);
    if (!isNaN(productId)) {
      console.log('Selected product ID:', productId); // Debugging
      const selectedProduct = this.products.find(p => p.product_ID === productId);
      if (selectedProduct) {
        this.orderForm.get('purchasePrice')?.setValue(selectedProduct.purchase_Price);
        this.updateTotalPrice();
      } else {
        console.error('Product not found:', productId); // Debugging
      }
    }
  }
  

  updateTotalPrice(): void {
    const purchasePrice = this.orderForm.get('purchasePrice')?.value || 0;
    const supplierQuantity = this.orderForm.get('supplierQuantity')?.value || 0;
    this.orderForm.get('totalPrice')?.setValue(purchasePrice * supplierQuantity);
  }

  placeOrder(): void {
    const selectedProductId = +this.orderForm.value.product; // Ensure it's a number
    console.log('Selected product ID for order:', selectedProductId);

    const selectedProduct = this.products.find(p => p.product_ID === selectedProductId);  
    if (!selectedProduct) {
      console.error('No valid product selected');
      return; // Exit the method if no valid product is selected
    }

    const order = {
      Date: new Date(),
      Supplier_Order_Details: this.orderForm.value.orderDetails,
      Supplier_ID: this.supplierId, 
      Supplier_Name: this.supplierName,
      Owner_ID: 1,
      Status: 1, // Set the status to pending
      OrderLines: [
        {
          Product_ID: selectedProduct.product_ID,
          Product_Name: selectedProduct.product_Name,
          Supplier_Quantity: this.orderForm.value.supplierQuantity,
          Purchase_Price: selectedProduct.purchase_Price
        }
      ],
      Total_Price: this.orderForm.value.totalPrice
    };

    this.supplierOrderService.placeSupplierOrder(order).subscribe({
      next: (response) => {
        console.log('Order placed successfully', response);
        this.snackBar.open('Order Placed Successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/supplier-order']);
      },
      error: (error) => {
        console.error('Error placing order', error);
        this.snackBar.open('Error Placing Order', 'Close', { duration: 5000 });
      }
    });    
  }
}
