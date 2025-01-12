import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItemViewModel, CartViewModel, OrderViewModel, OverdueSettings, Product, WishlistItemViewModel, WishlistViewModel } from '../shared/order';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  cartItemsCountSource = new BehaviorSubject<number>(0);
  cartItemsCount = this.cartItemsCountSource.asObservable();

  wishlistItemsCountSource = new BehaviorSubject<number>(0);
  wishlistItemsCount = this.wishlistItemsCountSource.asObservable();
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient) {
    this.loadCartItems();
    this.loadWishlistItems();
  }

  apiUrl: string = "https://localhost:7185/api/";

  //navbar count
  loadCartItems(): void {
    this.getCartItems().subscribe({
      next: (items) => {
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartItemsCountSource.next(totalCount);
      },
      error: (err) => {
        console.error('Error loading cart items', err);
      }
    });
  }

  loadWishlistItems(): void {
    this.getWishlistItems().subscribe({
      next: (items) => {
        this.wishlistItemsCountSource.next(items.length);
      },
      error: (err) => {
        console.error('Error loading wishlist items', err);
      }
    });
  }

  //products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}Order/GetAllProducts`, this.httpOptions);
  }

  getProductById(product_id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}Order/GetProductById/${product_id}`, this.httpOptions);
  }

  //cart
  getCartItems(): Observable<CartItemViewModel[]> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<CartItemViewModel[]>(`${this.apiUrl}Order/GetCart`, httpOptionsWithAuth);
  }

  addToCart(cartViewModel: { product_ID: number; quantity: number; size: string }): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${this.apiUrl}Order/AddToCart`, cartViewModel, httpOptionsWithAuth).pipe(
      tap(() => this.loadCartItems())
    );
  }

  updateCart(cartViewModel: CartViewModel): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put<any>(`${this.apiUrl}Order/UpdateCart`, cartViewModel, httpOptionsWithAuth).pipe(
      tap(() => this.loadCartItems())
    );
  }

  removeFromCart(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json' // Specify response type as text
    };
    return this.http.delete<any>(`${this.apiUrl}Order/RemoveFromCart/${productId}`, httpOptionsWithAuth).pipe(
      tap(() => this.loadCartItems())
    );
  }

  //wishlist
  getWishlistItems(): Observable<WishlistItemViewModel[]> {
    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<WishlistItemViewModel[]>(`${this.apiUrl}Order/GetWishlist`, httpOptionsWithAuth);
  }

  addToWishlist(wishlistViewModel: WishlistViewModel): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<any>(`${this.apiUrl}Order/AddToWishlist`, wishlistViewModel, httpOptionsWithAuth).pipe(
      tap(() => this.loadWishlistItems())
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json' // Specify response type as text
    };
    return this.http.delete<any>(`${this.apiUrl}Order/RemoveFromWishlist/${productId}`, httpOptionsWithAuth).pipe(
      tap(() => this.loadWishlistItems())
    );
  }

  moveFromWishlistToCart(product_ID: number): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json' // Specify response type as text
    };
    return this.http.post<any>(`${this.apiUrl}Order/MoveFromWishlistToCart`, { product_ID, quantity: 1 }, httpOptionsWithAuth);
  }

  //order
  createOrder(order: OrderViewModel): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    console.log('Creating order with payload:', order);

    return this.http.post<any>(`${this.apiUrl}Order/CreateOrder`, order, httpOptionsWithAuth);
  }

  getMemberOrders(): Observable<OrderViewModel[]> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<OrderViewModel[]>(`${this.apiUrl}Order/GetMemberOrders`, httpOptionsWithAuth);
  }

  getOrders(): Observable<OrderViewModel[]> {
    return this.http.get<OrderViewModel[]>(`${this.apiUrl}Order/GetOrders`, this.httpOptions);
  }

  collectOrder(orderId: number): Observable<void> {
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<void>(`${this.apiUrl}Order/CollectOrder/${orderId}`, null, httpOptionsWithAuth);
  }

  orderCollect(orderId: number): Observable<void> {    
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<void>(`${this.apiUrl}Order/OrderCollect/${orderId}`, null, httpOptionsWithAuth);
  }

  //overdue-settings
  getOverdueSettings(): Observable<OverdueSettings> {
    return this.http.get<OverdueSettings>(`${this.apiUrl}OverdueSettings/GetOverdueSettings`);
  }
  
  updateOverdueSettings(settings: OverdueSettings): Observable<any> {  
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<any>(`${this.apiUrl}OverdueSettings/UpdateOverdueSettings`, settings, httpOptionsWithAuth);
  }

  //payfast
  getTotalAmount(): Observable<number> {
    return this.getCartItems().pipe(
      map(items => items.reduce((sum, item) => sum + (item.unit_Price * item.quantity), 0))
    );
  }

  getUserData(): any {
    // Replace this with your actual implementation to get user data
    return {
      email: 'user@example.com'
    };
  }
}
