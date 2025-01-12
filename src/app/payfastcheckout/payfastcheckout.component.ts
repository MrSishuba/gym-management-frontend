import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { environment } from '../../environments/environment';
declare function payfast_do_onsite_payment(param1 : any, callback: any): any;



@Component({
  selector: 'app-payfastcheckout',
  standalone: true,
  imports: [],
  templateUrl: './payfastcheckout.component.html',
  styleUrl: './payfastcheckout.component.css'
})
export class PayfastcheckoutComponent {
  constructor(private httpComms: HttpClient, private pageRouter : Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {

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

  async doOnsitePayment() {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10033427")
    onSiteUserData.set("merchant_key", "mu83ipbgas9p7")

    onSiteUserData.set('return_url', window.location.origin + '/success')
    onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    // onSiteUserData.set("email_address", 'test@user.com');

    // onSiteUserData.set("amount", this.cartManager.getTotalCostOfSubcriptionsInCart().toString());
    // onSiteUserData.set("item_name", this.cartManager.getCartOrderName());

    // onSiteUserData.set('passphrase', 'HelloWorldHello');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);

    let formData = new FormData();
    onSiteUserData.forEach((val, key) => {
      formData.append(key, val);
    }); 
    
    let response = await fetch(environment.payfastOnsiteEndpoint, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });
    
    let respJson = await response.json();
    let uuid = respJson['uuid'];
    payfast_do_onsite_payment({'uuid': uuid},  (res: any) => {
      if (res == true) {
        this.pageRouter.navigate(['/success'])
      }
      else {
        this.pageRouter.navigate(['/cancel'])
      }
    });
  }
}
