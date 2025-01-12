export interface SupplierOrder {
    supplier_Order_ID: number;
    date: Date;
    supplier_Order_Details: string;
    total_Price: number;
    supplier_ID: number;
    supplier_Name: string;
    status: number;
    orderLines: SupplierOrderLine[];
  }

  export interface SupplierOrderLine {
    supplier_Order_Line_ID: number;
    supplier_Quantity: number;
    purchase_Price: number;
    product_ID: number;
    product_Name: string;
  }