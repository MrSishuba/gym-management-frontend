export interface RegisterMemberViewModel {
    Membership_Status_ID: number;
    Name: string;
    Surname: string;
    Email: string;
    Physical_Address: string;
    PhoneNumber: string;
    Photo: File; // Assuming you will handle file as a `File` type
    Password: string;
    ID_Number: string;
    Date_of_Birth: string; // Ensure format is 'yyyy-MM-dd'
    User_Status_ID: number;
    User_Type_ID: number;
  }