import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductCategoryViewModel, ProductTypeViewModel } from '../shared/order';
import { ProductCategories } from '../shared/productCategories';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient) {}

  apiUrl: string = "https://localhost:7185/api/";  

  //products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}Product/GetAllProducts`, this.httpOptions);
  }

  getProductById(product_id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}Product/GetProductById/${product_id}`, this.httpOptions);
  }

  addProduct(product: FormData): Observable<Product> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<Product>(`${this.apiUrl}Product/PostProduct`, product, httpOptionsWithAuth);
  }

  updateProduct(product_id: number, product: FormData): Observable<Product> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    
    return this.http.put<Product>(`${this.apiUrl}Product/PutProduct/${product_id}`, product, httpOptionsWithAuth);
  }

  deleteProduct(product_id: number): Observable<void> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    
    return this.http.delete<void>(`${this.apiUrl}Product/DeleteProduct/${product_id}`, httpOptionsWithAuth);
  }


  getProductCategories(){
    return this.http.get<ProductCategories[]>(`https://localhost:7185/api/ProductCategory`, this.httpOptions);
  }

  //product category
  addProdCategory(prodCategory: ProductCategoryViewModel): Observable<ProductCategoryViewModel> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<ProductCategoryViewModel>(`${this.apiUrl}ProductCategory/addProdCategory`, prodCategory, httpOptionsWithAuth);
  }

  getAllProdCategories(): Observable<ProductCategoryViewModel[]> {
    return this.http.get<ProductCategoryViewModel[]>(`${this.apiUrl}ProductCategory/getAllProdCategories`, this.httpOptions);
  }

  getProdCategoryById(id: number): Observable<ProductCategoryViewModel> {
    return this.http.get<ProductCategoryViewModel>(`${this.apiUrl}ProductCategory/getProdCategoryById/${id}`, this.httpOptions);
  }  

  getCategoriesByType(productTypeId: number): Observable<ProductCategoryViewModel[]> {
    return this.http.get<ProductCategoryViewModel[]>(`${this.apiUrl}ProductCategory/getCategoriesByType/${productTypeId}`, this.httpOptions);
  } 

  updateProdCategory(productCategoryID: number, updatedCategory: ProductCategoryViewModel): Observable<void> {
    const body = {
        category_Name: updatedCategory.category_Name,
        product_Type_ID: updatedCategory.product_Type_ID
    };

    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        })
    };

    return this.http.put<void>(`${this.apiUrl}ProductCategory/updateProdCategory/${productCategoryID}`, body, httpOptionsWithAuth);
}


  deleteProdCategory(id: number): Observable<void> {

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<void>(`${this.apiUrl}ProductCategory/deleteProdCategory/${id}`, httpOptionsWithAuth);
  }

  //product type
  getProductTypes(): Observable<ProductTypeViewModel[]> {
    return this.http.get<ProductTypeViewModel[]>(`${this.apiUrl}ProductType/getAllProdTypes`, this.httpOptions);
  } 

  getProdTypeById(id: number): Observable<ProductCategoryViewModel> {
    return this.http.get<ProductCategoryViewModel>(`${this.apiUrl}ProductType/getProdTypeById/${id}`, this.httpOptions);
  }

  addProdType(prodType: ProductTypeViewModel): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post(`${this.apiUrl}ProductType/addProdType`, prodType, httpOptionsWithAuth);
  }

  updateProdType(id: number, typeName: string): Observable<any> {
    const body = { Type_Name: typeName };

    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        })
    };

    return this.http.put(`${this.apiUrl}ProductType/updateProdType/${id}`, body, httpOptionsWithAuth);
}


  deleteProdType(id: number): Observable<any> {

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.apiUrl}ProductType/deleteProdType/${id}`, httpOptionsWithAuth);
  }

}
