import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonPlanService } from '../Services/lesson-plan.service';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { LessonPlan } from '../shared/lessonPlan';
import { LessonPlanViewModel } from '../shared/lessonPlanViewModel';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-lesson-plan',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf],
  templateUrl: './lesson-plan.component.html',
  styleUrl: './lesson-plan.component.css'
})
export class BookingsComponent implements OnInit{

  plans:LessonPlan[]=[];
  //plan:LessonPlanViewModel[] =[]

  plan:LessonPlanViewModel={
    lessonPlan_ID:0,
    lessonPlanName:"",
    workoutID:[],
    workouts:[],
    program_Description:''
  }
  filteredlessonPlans: LessonPlan[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  constructor (private lessonPlanService:LessonPlanService, private elementRef: ElementRef){}

  ngOnInit(): void {
    this.GetLessonPlans()
    console.log(this.plans)
  }
  GetLessonPlans()
  {
    this.lessonPlanService.GetPlans().subscribe(result => {
      let lessonPlanList:any[] = result;
    
      lessonPlanList.forEach((element) => {
        this.plans.push(element)
        this.filteredlessonPlans.push(element)
        
      });
      
    })
  }

  GetLessonPlansWithWorkouts(id:Number)
  {
    this.lessonPlanService.GetPlanWithWorkouts(id).subscribe(result => {
     
     this.plan = result.value[0];
     
    this.open();
     console.log('Plan',this.plan)
    })
  }

  filterlessonPlans(): void {
    if (!this.searchTerm) {
      this.filteredlessonPlans = this.plans;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredlessonPlans = this.filteredlessonPlans.filter(plan =>
        plan.program_Name.toLowerCase().includes(term) ||
        plan.lesson_Plan_ID.toString().includes(term)
      );
    }
  }
  open(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.modal');
  if (modalElement) {
    modalElement.style.display = 'block'; // Hide the modal
  }
  this.showModal = true;
}

  close(){
    //hide the div with the modal class
    const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.modal');
  if (modalElement) {
    modalElement.style.display = 'none'; // Hide the modal
  }
  this.showModal = false;


  }
  deleteLessonPlan(id:Number){
    this.lessonPlanService.DeletePlan(id).subscribe((result: LessonPlan) =>{
      console.log('Category deleted!');
    },(error: HttpErrorResponse) => {
      // Handle error
      console.log('Error:', error.error)
     
    });
  }
}
