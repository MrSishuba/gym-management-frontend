import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { environment } from '../../environments/environment';
import { OrderService } from '../Services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../Services/userprofile.service';
import { CartItemViewModel, OrderViewModel } from '../shared/order';
import { PaymentViewModel } from '../shared/payment';
import { PaymentService } from '../Services/payment.service';
import { Subscription } from 'rxjs';

declare global {
  interface Window {
    payfast_do_onsite_payment: (param1: any, callback: any) => any;
  }
}

  @Component({
    selector: 'app-payfast',
    standalone: true,
    imports: [],
    templateUrl: './payfast.component.html',
    styleUrl: './payfast.component.css'
  })
  export class PayfastComponent implements OnInit {
    memberId!: number;
    finalAmount: number = 0;
    private finalAmountSubscription!: Subscription;

    constructor(private router : Router, private orderService : OrderService, private paymentService : PaymentService , private userService: UserService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
      
    }

    ngOnInit(): void {
      this.fetchMemberId();
      this.finalAmountSubscription = this.paymentService.getFinalAmount().subscribe(amount => {
        this.finalAmount = amount;
        console.log("Retrieved final amount from subscription:", this.finalAmount); // Debugging line
        this.cdr.detectChanges(); // Force change detection
      });
    }

    ngOnDestroy(): void {
      if (this.finalAmountSubscription) {
        this.finalAmountSubscription.unsubscribe();
      }
    }

    getSignature(data : Map<string, string>) : string {
      let tmp = new URLSearchParams();
      data.forEach((v, k)=> {
        tmp.append(k, v)
      });
      let queryString = tmp.toString();
      let sig = Md5.hashStr(queryString);
      return sig;
    }

    async doOnSitePayment() {
      await this.fetchMemberId();

      let onSiteUserData = new Map<string, string>();
      onSiteUserData.set("merchant_id", "10033427")
      onSiteUserData.set("merchant_key", "mu83ipbgas9p7")

      onSiteUserData.set('return_url', window.location.origin + '/orders')
      onSiteUserData.set('cancel_url', window.location.origin + '/checkout')

      // Gather required user data from orderService or other sources
      const userData = this.orderService.getUserData();
      onSiteUserData.set("email_address", userData.email);
      
      // Set amount and item_name
      onSiteUserData.set('amount', this.finalAmount.toFixed(2)); // Use the final amount from shared service
      onSiteUserData.set('item_name', 'Cart Purchase');

      // Optional passphrase for added security
      onSiteUserData.set('passphrase', 'HelloWorldHello'); // Use if you have a passphrase

      let signature = this.getSignature(onSiteUserData);
      onSiteUserData.set('signature', signature);

      let formData = new FormData();
      onSiteUserData.forEach((val, key) => {
        formData.append(key, val);
      });

      fetch(environment.payfastOnsiteEndpoint, {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      })
      .then(response => response.json())
      .then(respJson => {
          let uuid = respJson['uuid'];
          window.payfast_do_onsite_payment({ 'uuid': uuid }, (res: any) => {
            if (res == true) {
              this.createOrder().then((orderResponse) => {
                this.createPayment(orderResponse);
                this.snackBar.open('Payment Successful', 'Close', { duration: 5000 });
              });         
            } else {
              this.snackBar.open('Payment Failed', 'Close', { duration: 5000 });              
            }
          });
        })
        .catch(error => {
          this.snackBar.open('Payment Failed', 'Close', { duration: 5000 }); 
          console.error('Error processing payment:', error);
          this.router.navigate(['/checkout']);
        });
      }

      //order
      private fetchMemberId() {
        const user = localStorage.getItem('User');
        if (user) {
          const userData = JSON.parse(user);
          this.memberId = userData.userId;
      
          // Optional: Fetch and validate member details if needed
          this.userService.getMemberByUserId(this.memberId).subscribe({
            next: (member) => {
              if (member && member.member_ID) {
                this.memberId = member.member_ID;
                console.log('Member ID:', this.memberId); // Check if this logs the correct ID
              } else {
                console.error('Member ID is undefined in the response');
                this.snackBar.open('Failed to retrieve member information', 'Close', { duration: 5000 });
              }
            },
            error: (error) => {
              console.error('Error fetching member:', error);
              this.snackBar.open('Failed to retrieve member information', 'Close', { duration: 5000 });
            }
          });
        } else {
          this.snackBar.open('User not logged in', 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        }
      }

      private createOrder(): Promise<OrderViewModel> {
        return new Promise((resolve, reject) => {
          if (this.memberId === undefined) {
            this.snackBar.open('Member ID is not available', 'Close', { duration: 5000 });
            reject('Member ID is not available');
          } else {
            this.orderService.getCartItems().subscribe({
              next: (cartItems) => {
                const order = this.prepareOrderDetails(cartItems);
                this.orderService.createOrder(order).subscribe({
                  next: (orderResponse) => {
                    this.snackBar.open('Order Created Successfully', 'Close', { duration: 5000 });
                    resolve(orderResponse);
                  },
                  error: (error) => {
                    console.error('Error creating order:', error);
                    this.snackBar.open('Failed to create order', 'Close', { duration: 5000 });
                    reject(error);
                  }
                });
              },
              error: (error) => {
                console.error('Error fetching cart items:', error);
                this.snackBar.open('Failed to fetch cart items', 'Close', { duration: 5000 });
                reject(error);
              }
            });
          }
        });
      }
      
    private prepareOrderDetails(cartItems: CartItemViewModel[]): OrderViewModel {
      const order: OrderViewModel = {
        order_ID: 0, // ID will be generated by backend
        member_ID: this.memberId,
        order_Date: new Date().toISOString(),
        total_Price: this.finalAmount, // Use the final amount from shared service
        order_Status_ID: 1, // Ready for Collection
        isCollected: false,
        orderLines: cartItems.map(item => ({
          order_Line_ID: 0, // ID will be generated by backend
          product_ID: item.product_ID,
          product_Name: item.product_Name,
          quantity: item.quantity,
          unit_Price: item.unit_Price
        }))
      };
    
      console.log('Prepared order details:', order);
      return order;
    }

    private createPayment(order: OrderViewModel) {
      this.fetchContractId(this.memberId).then(contractId => {
        const paymentData: PaymentViewModel = {
          payment_ID: 0,
          amount: order.total_Price, // Ensure this reflects VAT and discounts
          payment_Date: new Date().toISOString(),
          order_ID: order.order_ID,
          contract_ID: contractId, // Set the fetched contract ID here
          payment_Type_ID: 1 // Default to 1
        };
    
        this.paymentService.createPayment(paymentData).subscribe({
          next: (response) => {
            console.log('Payment record created successfully:', response);
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            console.error('Error creating payment record:', error);
          }
        });
      }).catch(error => {
        console.error('Error fetching contract ID:', error);
        this.snackBar.open('Failed to create payment due to missing contract ID', 'Close', { duration: 5000 });
      });
    } 

    private fetchContractId(memberId: number): Promise<number> {
      return new Promise((resolve, reject) => {
        this.paymentService.getContractByMemberId(memberId).subscribe({
          next: (contract: any) => {
            if (contract && contract.contract_ID) {
              resolve(contract.contract_ID);
            } else {
              reject('Contract ID not found');
            }
          },
          error: (error) => {
            console.error('Error fetching contract ID:', error);
            reject('Failed to fetch contract ID');
          }
        });
      });
    }
  }