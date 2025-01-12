import { Time } from "./Time";

export interface BookingViewModel{

    booking_ID:Number;
    lessonPlanName:String;
    lessonPlanID:Number;
    date:Date;
    time:Time;
    timeSlot_ID:Number;
    instructorName:string;
}