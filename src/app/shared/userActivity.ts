export interface UserActivity {
    userId: string;
    userName: string;
    changed_By:string;
    totalChanges: number;
    transactionTypes: { [key: string]: number }; // e.g., { "CREATE": 5, "UPDATE": 3 }
  }
  