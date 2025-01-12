export interface InventoryReport {
    name: string;
    description: string;
    unitPrice: number;
    quantityInStock: number;
    totalStockValue: number;
    quantityWrittenOff: number;
    totalWriteOffValue: number;
    quantityOrdered: number;
    totalValue: number;
  }
  