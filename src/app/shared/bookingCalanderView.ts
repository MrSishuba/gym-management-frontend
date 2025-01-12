import { Time } from "./Time";

export interface TmeSlotCalanderViewModel{

    timeSlotId:Number;
    slotTime:Time;
    slotDate:Date;
    availability:Boolean;
    description:String;
    programName:String;
    employee_Name:String;
    numberOfBookings:Number;
}