import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { Product, ProductCategoryViewModel, ProductTypeViewModel } from '../shared/order';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MasterSideNavBarComponent } from '../master-side-nav-bar/master-side-nav-bar.component';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, MasterSideNavBarComponent, SideNavBarComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  userTypeID: number | null = null;
  products: Product[] = [];
  filterProduct: any[] = [];
  productTypes: ProductTypeViewModel[] = [];
  productCategories: ProductCategoryViewModel[] = []
  allCategories: ProductCategoryViewModel[] = [];
  filteredCategories: ProductCategoryViewModel[] = [];
  searchTerm: string = '';
  selectedProduct: Product | null = null;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  helpContent: any[] = [];
  filteredContent: any[] = [];

  constructor(private productService: ProductService, private fb: FormBuilder, private location: Location, private snackBar: MatSnackBar) {
    this.addProductForm = this.fb.group({
      product_Name: ['', Validators.required],
      product_Description: ['', Validators.required],
      product_Img: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit_Price: [1, [Validators.required, Validators.min(1)]],
      purchase_Price: [0, [Validators.required, Validators.min(1)]],
      size: ['', Validators.required],
      product_Category_ID: [1, [Validators.required, Validators.min(1)]],
      supplier_ID: ['', [Validators.required, Validators.min(1)]],
      product_Type_ID: ['', Validators.required]
    });

    this.editProductForm = this.fb.group({
      product_Name: ['', Validators.required],
      product_Description: ['', Validators.required],
      product_Img: [null],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit_Price: [1, [Validators.required, Validators.min(1)]],
      purchase_Price: [0, [Validators.required, Validators.min(1)]],
      size: [''],
      product_Category_ID: [1, [Validators.required, Validators.min(1)]],
      supplier_ID: ['', Validators.required],
      product_Type_ID: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userTypeId = JSON.parse(localStorage.getItem('User') || '{}').userTypeId;
    this.userTypeID = userTypeId;
    console.log('User Type ID',userTypeId);

    this.loadProducts();
    this.loadProductTypes();
    this.loadAllCategories();

    console.log('Add Product Form:', this.addProductForm);
    console.log('Edit Product Form:', this.editProductForm);
    console.log('Product Types:', this.productTypes);

    // Initialize help content
    this.helpContent = [
      {
        title: 'Product Management Page Context-Sensitive Help',
        content: `
          <p><strong>Overview:</strong> The Product Management page allows you to view, search, and manage products for your application. You can add new products, view details, edit existing products, delete them, and search for specific products.</p>
          <p><strong>Page Components:</strong></p>`
      },
      {
        title: '1. Search Bar',
        content: `
          <ul>
            <li><strong>Purpose:</strong> To find specific products in the list.</li>
            <li><strong>Usage:</strong> Enter search criteria such as product name, category, or ID. The table will update in real-time based on the search input.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Use specific keywords to narrow down your search results.</li>
                <li>Clear the search field to view all products.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '2. Add Product Button',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Navigate to the page where you can add a new product.</li>
            <li><strong>Usage:</strong> Click this button to access the form for adding a new product.</li>
            <li><strong>Helpful Tips:</strong>
              <ul>
                <li>Click this button to open the Add Product modal where you can input details for the new product.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '3. Products Table',
        content: `
          <ul>
            <li><strong>Purpose:</strong> Displays a list of products with their details and available actions.</li>
            <li><strong>Usage:</strong>
              <ul>
                <li><strong>Photo:</strong> Displays the product image.</li>
                <li><strong>Name:</strong> Name of the product.</li>
                <li><strong>Price:</strong> Unit price of the product.</li>
                <li><strong>Category:</strong> Category of the product (e.g., Tops, Bottoms, Gear).</li>
                <li><strong>Quantity:</strong> Available quantity of the product.</li>
                <li><strong>Description:</strong> Brief description of the product.</li>
                <li><strong>Actions:</strong> Includes buttons to view product details, edit product information, and delete the product.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '4. Actions and Buttons',
        content: `
          <ul>
            <li><strong>View Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Opens a modal with detailed information about the selected product.</li>
                <li><strong>Usage:</strong> Click the “View” button to see details such as product name, description, price, category, and image.</li>
              </ul>
            </li>
            <li><strong>Edit Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Navigate to the page where you can edit the product's details.</li>
                <li><strong>Usage:</strong> Click the “Edit” button to access the form for updating the product’s information.</li>
              </ul>
            </li>
            <li><strong>Delete Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Delete the selected product from the list.</li>
                <li><strong>Usage:</strong> Click the “Delete” button to remove the product. A confirmation dialog will appear to confirm the deletion.</li>
              </ul>
            </li>
            <li><strong>Add Product Button:</strong>
              <ul>
                <li><strong>Purpose:</strong> Navigate to the page where you can add a new product.</li>
                <li><strong>Usage:</strong> Click the “Add Product” button to open the form for adding a new product to the list.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: '5. Modals',
        content: `
          <ul>
            <li><strong>View Product Details Modal:</strong>
              <ul>
                <li><strong>Purpose:</strong> Display detailed information about the selected product.</li>
                <li><strong>Usage:</strong> The modal shows the product's name, description, price, category, quantity, and image. Click "Close" to exit the modal.</li>
              </ul>
            </li>
            <li><strong>Add Product Modal:</strong>
              <ul>
                <li><strong>Purpose:</strong> Allows users to add a new product.</li>
                <li><strong>Form Fields:</strong>
                  <ul>
                    <li><strong>Product Name:</strong> Enter the name of the product.</li>
                    <li><strong>Description:</strong> Provide a brief description of the product.</li>
                    <li><strong>Image:</strong> Upload a product image.</li>
                    <li><strong>Quantity:</strong> Enter the available quantity of the product.</li>
                    <li><strong>Price:</strong> Enter the unit price of the product.</li>
                    <li><strong>Category:</strong> Select the product category.</li>
                  </ul>
                </li>
                <li><strong>Buttons:</strong>
                  <ul>
                    <li><strong>Add Product:</strong> Submit the form to add the product.</li>
                    <li><strong>Cancel:</strong> Close the modal without saving.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>Edit Product Modal:</strong>
              <ul>
                <li><strong>Purpose:</strong> Allows users to edit an existing product.</li>
                <li><strong>Form Fields:</strong> Similar to the Add Product modal, but with pre-filled values from the selected product.</li>
                <li><strong>Buttons:</strong>
                  <ul>
                    <li><strong>Save Changes:</strong> Submit the form to save changes to the product.</li>
                    <li><strong>Cancel:</strong> Close the modal without saving changes.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>Delete Product Confirmation Modal:</strong>
              <ul>
                <li><strong>Purpose:</strong> Confirm the deletion of a product.</li>
                <li><strong>Confirmation Message:</strong> Displays a message asking for confirmation to delete the selected product.</li>
                <li><strong>Buttons:</strong>
                  <ul>
                    <li><strong>Delete:</strong> Proceed with deletion.</li>
                    <li><strong>Cancel:</strong> Close the modal without deleting.</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>`
      },
      {
        title: 'Technical Details:',
        content: `
          <ul>
            <li>Dynamic Data: The products list is dynamically updated based on data retrieved from the backend.</li>
            <li>Navigation: Utilizes Angular's Router for smooth transitions between different sections of the application.</li>
          </ul>`
      },
      {
        title: 'Common Questions:',
        content: `
          <p><strong>Q:</strong> How do I search for a product?</p>
          <p><strong>A:</strong> Enter search terms in the "Search Bar" input field. The table will filter products based on the name, category, or ID matching the search criteria.</p>
          <p><strong>Q:</strong> How can I view a product’s details?</p>
          <p><strong>A:</strong> Click the “View” button next to the product in the table. This will open a modal with detailed information about the product.</p>
          <p><strong>Q:</strong> What should I do if the product list is not updating after adding, editing, or deleting a product?</p>
          <p><strong>A:</strong> Ensure that you have refreshed the product list by calling the appropriate method to fetch the updated list. Verify that the changes are reflected in the product data.</p>
          <p><strong>Q:</strong> How do I delete a product?</p>
          <p><strong>A:</strong> Click the “Delete” button for the product you want to remove. A confirmation dialog will appear. Confirm the deletion to remove the product from the list.</p>`
      },
      {
        title: 'Troubleshooting:',
        content: `
          <p><strong>Problem:</strong> The product list is not loading.</p>
          <p><strong>Solution:</strong> Ensure you are connected to the internet and logged in. If the problem persists, try refreshing the page or contact technical support.</p>
          <p><strong>Problem:</strong> Unable to update product information.</p>
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

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filterProduct = products;
      console.log(products)
    });
  }

  loadProductTypes(): void {
    this.productService.getProductTypes().subscribe({
      next: (types: ProductTypeViewModel[]) => {
        this.productTypes = types; // Assign fetched product types
      },
      error: (error) => {
        console.error('Error fetching product types', error);
      }
    });
  }
  
  loadCategoriesByType(productTypeId: number | null): void {
    if (productTypeId) {
      this.productService.getCategoriesByType(productTypeId).subscribe({
        next: (categories: ProductCategoryViewModel[]) => {
          this.filteredCategories = categories;
          this.addProductForm.patchValue({ product_Category_ID: null });
        },
        error: (error) => {
          console.error('Error fetching categories', error);
        }
      });
    } else {
      this.loadAllCategories();
    }
  }
  
  loadAllCategories(): void {
    this.productService.getAllProdCategories().subscribe({
      next: (categories: ProductCategoryViewModel[]) => {
        this.filteredCategories = categories;
        this.addProductForm.patchValue({ product_Category_ID: null });
      },
      error: (error) => {
        console.error('Error fetching all categories', error);
      }
    });
  }
  
  filterCategoriesByType(selectedType: string): void {
    const selectedTypeId = this.productTypes.find(type => type.type_Name === selectedType)?.product_Type_ID;
  
    if (selectedTypeId) {
      this.filteredCategories = this.products
        .filter(product => product.product_Type_ID === selectedTypeId)
        .map(product => ({
          product_Category_ID: product.product_Category_ID,
          category_Name: this.getCategoryNameById(product.product_Category_ID) // Ensure this returns a string
        }));
    } else {
      this.filteredCategories = this.products.map(product => ({
        product_Category_ID: product.product_Category_ID,
        category_Name: this.getCategoryNameById(product.product_Category_ID)
      })); // Show all categories if no type is selected
    }
  }
  
  onProductTypeChange(event: any): void {
    const selectedTypeId = event.target.value;
    if (selectedTypeId) {
      this.loadCategoriesByType(selectedTypeId);
    } else {
      this.filteredCategories = []; // Clear categories if no type is selected
    }
  }  
  
  getCategoryNameById(categoryId: number): string {
    const category = this.productCategories.find(cat => cat.product_Category_ID === categoryId);
    return category ? category.category_Name : 'Unknown Category';
  }
  
  getTypeNameById(typeId: number): string {
    const type = this.productTypes.find(type => type.product_Type_ID === typeId);
    return type ? type.type_Name : 'Unknown Type';
  }  

  filteredProducts(): void {
    if (!this.searchTerm) {
      this.filterProduct = this.products;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filterProduct = this.products.filter(product =>
        product.product_Name.toLowerCase().includes(term) ||
        product.unit_Price.toString().includes(term) ||
        product.quantity.toString().includes(term) ||
        product.product_Description.toLowerCase().includes(term)
      );
    }
  }

  openAddModal(): void {
    this.addProductForm.reset({ product_Category_ID: 1, quantity: 1, unit_Price: 1, purchase_Price: 1, supplier_ID: 1 }); // Reset with default values
    $('#addProductModal').modal('show');
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
  
    // Initialize supplier_ID with a default value if it's missing in the selected product
    this.editProductForm.patchValue({
      ...product,
      supplier_ID: product.supplier_ID || 1 // Set default value if supplier_ID is missing
    });
  
    console.log("Selected Product for editing:", this.selectedProduct);
    $('#editProductModal').modal('show');
  }
  

  openViewModal(product: Product): void {
    this.selectedProduct = product;
    $('#viewModal').modal('show');
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    $('#deleteModal').modal('show');
  }

  onAddFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addProductForm.patchValue({ product_Img: file });
    }
  }

  onEditFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editProductForm.patchValue({ product_Img: file });
    }
  }

  addProduct(): void {
    if (this.addProductForm.valid) {
      const formData = new FormData();
      Object.keys(this.addProductForm.value).forEach(key => {
        formData.append(key, this.addProductForm.value[key]);
      });

      // Log Product Type ID
      const productTypeId = this.addProductForm.value.productType;
      console.log("Product Type ID to Submit:", productTypeId);

      const formDataEntries = Array.from(formData as any);
      console.log("Form Data to Submit:", formDataEntries);


      this.productService.addProduct(formData).subscribe(() => {
        console.log("addData:", formData);
        this.loadProducts();
        $('#addProductModal').modal('hide');
        this.snackBar.open('Product Added Successfully', 'Close', { duration: 5000 });
      });
    }
  }

  editProduct(): void {
    console.log("Save Changes button clicked");
    if (this.editProductForm.valid && this.selectedProduct) {
        const formData = new FormData();

        // Collect the form values
        const formValue = this.editProductForm.value;

        // If no new image is provided, use the existing image
        let productImg = this.selectedProduct.product_Img; // Default to existing image

        // Check if a new image is selected
        if (this.editProductForm.get('product_Img')?.value) {
            const newImageFile = this.editProductForm.get('product_Img')?.value;
            productImg = newImageFile; // Update to new image file
            formData.append('product_Img', newImageFile);
        } else {
            // If no new image, append the existing image path
            formData.append('product_Img', productImg);
        }

        // Append other fields to FormData
        Object.keys(formValue).forEach(key => {
            if (key !== 'product_Img') {
                formData.append(key, formValue[key]);
            }
        });

        // Log Product Type ID
        const productTypeId = formValue.product_Type_ID;
        console.log("Product Type ID to Submit:", productTypeId);

        // Log the form data (workaround for FormData.entries())
        formData.forEach((value, key) => {
            console.log(`Form Data Key: ${key}, Value:`, value);
        });

        this.productService.updateProduct(this.selectedProduct.product_ID, formData).subscribe({
            next: () => {
                console.log("Product edited successfully.");
                this.loadProducts();
                $('#editProductModal').modal('hide');
                this.snackBar.open('Product Edited Successfully', 'Close', { duration: 5000 });
            },
            error: (err) => {
                console.error("Error editing product:", err); // Log error if update fails
            }
        });
    } else {
        console.warn("Form is invalid or no product selected:", {
            formValid: this.editProductForm.valid,
            selectedProduct: this.selectedProduct
        });
    }
}


  deleteProduct(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.product_ID).subscribe(() => {
        this.loadProducts();
        $('#deleteModal').modal('hide');
        this.snackBar.open('Product Deleted Successfully', 'Close', { duration: 5000 });
      });
    }
  }

  getAvailableSizesForProduct(product: Product): string[] {
    return ['XS', 'S', 'M', 'L', 'XL'];
  }

  goBack(): void {
    this.location.back();
  }
}
