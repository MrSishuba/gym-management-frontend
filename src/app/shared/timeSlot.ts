import { Time } from "./Time";

export interface TimeSlot{
    timeSlotId:Number;
    time:Date;
    date:Date;
    availability:Boolean;
    employee_ID:Number;
    lesson_Plan_ID:Number;
}