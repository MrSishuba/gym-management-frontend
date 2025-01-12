import { Time } from "./Time";
export interface BookingSlotViewModel{
    timeSlotId:Number;
    slotDate:Date;
    slotTime:Time;
    programName:String;
    employee_Name:String;
    numberOfBookings:number;
}