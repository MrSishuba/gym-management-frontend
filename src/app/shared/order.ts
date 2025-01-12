export class ProductCategoryViewModel {
    product_Category_ID!: number;
    category_Name!: string;
    product_Type_ID?: number;
  }

export class ProductTypeViewModel {
  product_Type_ID!: number;
  type_Name!: string;
}

export class Product{
    product_ID!: number
    product_Name!: string
    product_Description!: string
    product_Img!: string
    quantity!: number
    unit_Price!: number
    purchase_Price!: number
    size!: string
    product_Category_ID!: number
    product_Type_ID!: number
    supplier_ID!: number
}

export class CartViewModel {
    product_ID!: number;
    quantity!: number;
}

export class CartItemViewModel {
    product_ID!: number;
    product_Name!: string;
    product_Description!: string;
    product_Img!: string;
    quantity!: number;
    unit_Price!: number;
    size!: string;
}

export class WishlistViewModel {
    product_ID!: number;
    size!: string;
}

export class WishlistItemViewModel {
    product_ID!: number;
    product_Name!: string;
    product_Description!: string;
    product_Img!: string;
    unit_Price!: number;
    size!: string;
}

export interface OrderViewModel {
    order_ID: number;
    member_ID: number;
    order_Date: string;
    total_Price: number;
    order_Status_ID: number;
    isCollected: boolean;
    orderLines: OrderLineViewModel[];
  }
  
  // OrderLineViewModel.ts
  export interface OrderLineViewModel {
    order_Line_ID: number;
    product_ID: number;
    product_Name: string;
    quantity: number;
    unit_Price: number;
  }

  //OverdueSettings.ts
  export interface OverdueSettings {
    overdueTimeValue: number;
    overdueTimeUnit: string;
  }
  