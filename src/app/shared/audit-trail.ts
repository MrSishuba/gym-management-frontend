export interface AuditTrail {
    audit_Trail_ID: number;
    transaction_Type: string;
    critical_Data: string;
    changed_By: string;
    table_Name: string;
    timestamp: Date;
  }