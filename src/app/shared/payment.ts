// vat.model.ts
export interface VAT {
    vaT_ID: number;
    vaT_Percentage: number;
    vaT_Date: Date;
  }
  
  // discount.model.ts
  export interface Discount {
    discount_ID: number;
    discount_Code: string;
    discount_Percentage: number;
    discount_Date: Date;
    end_Date: Date;
  }

  export interface PaymentViewModel {
    payment_ID: number;
    amount: number;
    payment_Date: string;
    order_ID: number;
    contract_ID: number;
    payment_Type_ID: number;
  }