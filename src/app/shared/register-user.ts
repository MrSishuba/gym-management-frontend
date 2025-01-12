// export interface RegisterUser {
//     email: string;
//     password: string;
// }

export interface RegisterUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  PhoneNumber: string;
  Date_of_Birth: string;
  Id_Number: string;
  Physical_Address: string;
  Photo: File;
  User_Status_ID: number;
  User_Type_ID: number;
}

export interface RegisterMember {
  name: string;
  surname: string;
  email: string;
  password: string;
  PhoneNumber: string;
  Date_of_Birth: string;
  Id_Number: string;
  Physical_Address: string;
  Photo: File;
  User_Status_ID: number;
  User_Type_ID: number;
  Contract_ID: number;
}

export interface RegisterEmployee {
  Name: string;
  Surname: string;
  Email: string;
  Physical_Address: string;
  PhoneNumber: string;
  Photo: File;  // Add this line to include the photo field
  Password: string;
  Id_Number: string;
  Date_of_Birth: string;
  User_Status_ID: number;
  User_Type_ID: number;
  Employment_Date: Date;
  Hours_Worked: number;
  Employee_Type_ID: number;
  Shift_ID?: number;
}