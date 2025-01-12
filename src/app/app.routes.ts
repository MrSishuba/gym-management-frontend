import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/authentication.guard';
import { GymManagerComponent } from './gym-manager/gym-manager.component';
import { BookingManagerComponent } from './booking-manager/booking-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { EmployeeHomeComponent } from './employee-home/employee-home.component';
import { OwnerHomeComponent } from './owner-home/owner-home.component';

import { ConfigureUserTypesComponent } from './configure-user-types/configure-user-types.component';
import { MemberManagerComponent } from './member-manager/member-manager.component';

import { WorkoutCategoryComponent } from './workout-category/workout-category.component';
import { AddWorkoutCategoryComponent } from './add-workout-category/add-workout-category.component';
import { EditWorkoutCategoryComponent } from './edit-workout-category/edit-workout-category.component';
import { WorkoutComponent } from './workout/workout.component';
import { AddWorkoutComponent } from './add-workout/add-workout.component';
import { EditWorkoutComponent } from './edit-workout/edit-workout.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { AddLessonPlanComponent } from './add-lesson-plan/add-lesson-plan.component';
import { EditLessonPlanComponent } from './edit-lesson-plan/edit-lesson-plan.component';
import { BookingComponent } from './booking/booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { BookingSlotComponent } from './booking-slot/booking-slot.component';
import { CreateBookingSlotComponent } from './create-booking-slot/create-booking-slot.component';
import { EditBookingSlotComponent } from './edit-booking-slot/edit-booking-slot.component';
import { GenerateAttendanceListComponent } from './generate-attendance-list/generate-attendance-list.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { InspectionComponent } from './inspection/inspection.component';
import { CreateInspectionComponent } from './create-inspection/create-inspection.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { AvailableBookingsComponent } from './available-bookings/available-bookings.component';
import { EqupimentManagerComponent } from './equpiment-manager/equpiment-manager.component';
import { InventoryManagerComponent } from './inventory-manager/inventory-manager.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';
import { WriteOffComponent } from './write-off/write-off.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { MemberReportComponent } from './member-report/member-report.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { InspectionReportComponent } from './inspection-report/inspection-report.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { MatIconModule } from '@angular/material/icon';
import { PaymentComponent } from './payment/payment.component';
import { RewardTypeComponent } from './reward/reward-type.component';
import { RewardComponent } from './reward/reward.component';
import { RewardsComponent } from './reward/rewards.component';
import { UsersComponent } from './user-manager/users.component';
import { ProductListComponent } from './order/product-list.component';
import { ProductItemComponent } from './order/product-item.component';
import { CartComponent } from './order/cart.component';
import { PaymentSuccessComponent } from './order/payment-success.component';
import { PaymentCancelComponent } from './order/payment-cancel.component';
import { WishlistComponent } from './order/wishlist.component';
import { CheckoutComponent } from './order/checkout.component';
import { ResetPasswordComponent } from './forgot-password/reset-password.component';
import { OrderComponent } from './order/order.component';
import { OrderManagementComponent } from './order/order-management.component';
import { DeletionSettingsComponent } from './user-manager/deletion-settings.component';
import { VATComponent } from './payment/vat.component';
import { DiscountComponent } from './payment/discount.component';
import { EmployeeManagerComponent } from './employee-manager/employee-manager.component';
import { HelpModalComponent } from './order/help-modal.component';
import { RegisterEmployeeComponent } from './employee-manager/register-employee.component';

import { ProductManagementComponent } from './products/product-management.component';
import { SettingsComponent } from './settings/settings.component';
import { SupplierOrderComponent } from './supplier-order/supplier-order.component';
import { SupplierHubComponent } from './supplier-hub/supplier-hub.component';
import { AddSupplierOrderComponent } from './add-supplier-order/add-supplier-order.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { PolicyComponent } from './policy/policy.component';
import { ShiftTimetableComponent } from './shift-timetable/shift-timetable.component';
import { EmployeeShiftComponent } from './employee-shift/employee-shift.component';
import { SignedContractsComponent } from './signed-contracts/signed-contracts.component';
import { ContractManagerComponent } from './contract-manager/contract-manager.component';
import { ContractComponent } from './contract/contract.component';
import { AllSignedContractsComponent } from './all-signed-contracts/all-signed-contracts.component';
import { RegisterComponent } from './register/register.component';
import { UploadContractComponent } from './upload-contract/upload-contract.component';
import { ContractStatisticsComponent } from './contract-statistics/contract-statistics.component';
import { ContractHistoryComponent } from './contract-history/contract-history.component';
import { DeleteContractFileComponent } from './delete-contract-file/delete-contract-file.component';
import { Component } from '@angular/core';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { ApproveContractComponent } from './approve-contract/approve-contract.component';
import { ContractSecurityComponent } from './contract-security/contract-security.component';
import { AuditTrailReportComponent } from './audit-trail-report/audit-trail-report.component';
import { MemberSubscriptionManagerComponent } from './member-subscription-manager/member-subscription-manager.component';
import { UnapprovedContractRecordComponent } from './unapproved-contract-record/unapproved-contract-record.component';
import { UnapprovedUploadedContractComponent } from './unapproved-uploaded-contract/unapproved-uploaded-contract.component';
import { ContractSettingsComponent } from './contract-settings/contract-settings.component';
import { MemberPaymentsComponent } from './member-payments/member-payments.component';
import { SimulateTimeComponent } from './simulate-time/simulate-time.component';
import { RequestContractTerminationComponent } from './request-contract-termination/request-contract-termination.component';
import { MemberTerminationRequestsComponent } from './member-termination-requests/member-termination-requests.component';
import { MemberManagerNavigationComponent } from './member-manager-navigation/member-manager-navigation.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { OverdueSettingsComponent } from './order/overdue-settings.component';
import { ProductCategoryComponent } from './products/product-category.component';
import { ProductManagerComponent } from './products/product-manager.component';
import { ProductTypeComponent } from './products/product-type.component';

import { OwnerHelpPageComponent } from './owner-help-page/owner-help-page.component';
import { EmployeeHelpPageComponent } from './employee-help-page/employee-help-page.component';
import { MemberHelpPageComponent } from './member-help-page/member-help-page.component';
import { AffiliationsComponent } from './affiliations/affiliations.component';
import { CodeOfConductComponent } from './code-of-conduct/code-of-conduct.component';
import { ValuesSystemComponent } from './values-system/values-system.component';
import { WorkEthicsComponent } from './work-ethics/work-ethics.component';
import { GuestManagerComponent } from './guest-manager/guest-manager.component';
import { ActivateFreeTrialComponent } from './activate-free-trial/activate-free-trial.component';
import { IssuedFreeTrialsComponent } from './issued-free-trials/issued-free-trials.component';
import { ChatComponent } from './chat/chat.component';
import { AdminSurveyComponent } from './admin-survey/admin-survey.component';
import { SurveyComponent } from './survey/survey.component';
import { AdminComponent } from './admin/admin.component';
import { WeeklyNewsComponent } from './weekly-news/weekly-news.component';




export const routes: Routes = [

  {path: '', pathMatch: 'full', redirectTo: 'landing-page' },
  {path: 'register-employee', component: RegisterEmployeeComponent },
  {path:'login', component: LoginComponent },
  {path:'policy',component:PolicyComponent},
  {path:'Home/:id', component: HomeComponent},
  {path:'EmployeeHome/:id', component: EmployeeHomeComponent},
  {path:'code-of-conduct',component:CodeOfConductComponent},
  {path:'values-system',component:ValuesSystemComponent},
  {path:'work-ethics',component:WorkEthicsComponent},
  {path:'OwnerHome/:id', component: OwnerHomeComponent},
  {path:'landing-page',component:LandingPageComponent},
  {path:'affiliations',component:AffiliationsComponent},
  {path:'ProfilePage/:id', component: ProfilePageComponent},
  {path:'employee-shift',component:EmployeeShiftComponent},
  {path:'shift-timetable',component:ShiftTimetableComponent},
  {path:'all-signed-contracts',component:AllSignedContractsComponent},
  {path:'signed-contracts',component:SignedContractsComponent},
  {path:'contract-manager',component:ContractManagerComponent},
  {path:'contract',component:ContractComponent},
  {path:'all-signed-contracts',component:AllSignedContractsComponent},
  {path:'upload-contract',component:UploadContractComponent},
  {path:'signed-contracts',component:SignedContractsComponent},
  {path:'contract-statistics',component:ContractStatisticsComponent},
  {path:'contract-history',component:ContractHistoryComponent},
  {path:'delete-contract-file',component:DeleteContractFileComponent},
  {path:'create-contract',component:CreateContractComponent},
  {path:'approve-contract',component:ApproveContractComponent},
  {path:'unapproved-contract-record',component:UnapprovedContractRecordComponent}, 
  {path:'unapproved-uploaded-contract',component:UnapprovedUploadedContractComponent}, 
  {path:'contract-security',component:ContractSecurityComponent},
  {path:'member-subscription-manager',component:MemberSubscriptionManagerComponent},
  {path:'request-contract-termination',component:RequestContractTerminationComponent},
  {path:'member-termination-requests',component:MemberTerminationRequestsComponent},
  {path:'member-manager-navigation',component:MemberManagerNavigationComponent},
  {path:'contract-settings',component:ContractSettingsComponent},
  {path:'simulate-time',component:SimulateTimeComponent},
  {path:'member-payments',component:MemberPaymentsComponent},
  {path:'ChangePasswordPage', component: ChangePasswordComponent},
  {path:'ForgotPasswordPage', component: ForgotPasswordComponent},
  {path:'reset-password', component: ResetPasswordComponent },
  {path:'register', component: RegisterComponent},
  {path:'gym-manager', component: GymManagerComponent},
  {path:'user-manager', component: UserManagerComponent },
  {path:'member-manager', component: MemberManagerComponent },
  {path:'employee-manager', component: EmployeeManagerComponent },
  {path:'users', component: UsersComponent },
  {path:'guest-manager',component:GuestManagerComponent},
  {path:'activate-free-trial',component:ActivateFreeTrialComponent},
  {path:'issued-free-trials',component:IssuedFreeTrialsComponent},
  {path:'ConfigureUserTypes',component:ConfigureUserTypesComponent},
  {path:'deletion-settings', component:DeletionSettingsComponent },
  {path:'settings', component:SettingsComponent },
  {path:'audit-trail', component:AuditTrailComponent },
  { path: 'booking-manager', component: BookingManagerComponent},
  { path: 'equipment-manager', component: EqupimentManagerComponent},
  { path: 'equipment', component: EquipmentComponent},
  { path: 'add-equipment', component: AddEquipmentComponent},
  { path: 'edit-equipment', component: EquipmentComponent},
  { path: 'inspection', component: InspectionComponent},
  {path:  'create-inspection', component: CreateInspectionComponent}, 
  { path: 'workout', component: WorkoutComponent},
  { path: 'add-workout', component: AddWorkoutComponent},
  { path: 'edit-workout', component: EditWorkoutComponent},
  { path: 'workout-category', component: WorkoutCategoryComponent},
  { path: 'add-workout-category', component: AddWorkoutCategoryComponent},
  { path: 'edit-workout-category', component: EditWorkoutCategoryComponent},
  { path: 'lesson-plan', component: LessonPlanComponent},
  { path: 'add-lesson-plan', component: AddLessonPlanComponent},
  { path: 'edit-lesson-plan', component: EditLessonPlanComponent},
  {path: 'supplier', component: SupplierComponent},  
  {path: 'add-supplier', component: AddSupplierComponent},  
  {path: 'edit-supplier', component: EditSupplierComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'inventory-manager', component: InventoryManagerComponent},
  {path: 'available-bookings', component: AvailableBookingsComponent},
   {path: 'home', component: HomeComponent},
  { path: 'booking', component: BookingComponent},
  { path: 'create-booking', component: CreateBookingComponent},
  { path: 'edit-booking', component: EditBookingComponent},
  { path: 'booking-slot', component: BookingSlotComponent},
  { path: 'create-booking-slot', component: CreateBookingSlotComponent},
  { path: 'edit-booking-slot', component: EditBookingSlotComponent},
  { path: 'generate-attendance-list', component: GenerateAttendanceListComponent},
  { path: 'booking-report', component: BookingReportComponent},
  { path: 'sales-report', component: SalesReportComponent},
  { path: 'member-report', component: MemberReportComponent},
  { path: 'financial-report', component: FinancialReportComponent},
  { path: 'inspection-report', component: InspectionReportComponent},
  { path: 'inventory-report', component: InventoryReportComponent},
  { path: 'inventory', component: InventoryComponent},
  {path: 'add-inventory', component: AddInventoryComponent},
  {path: 'write-off', component: WriteOffComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'owner-help-page',component:OwnerHelpPageComponent},
  {path:'employee-help-page',component:EmployeeHelpPageComponent},
  {path:'member-help-page',component:MemberHelpPageComponent},

  { path: 'EmployeeHome/booking-manager', component: EmployeeHomeComponent},
  { path: 'EmployeeHome/equipment-manager', component: EmployeeHomeComponent},
  { path: 'EmployeeHome/member-manager', component: EmployeeHomeComponent},
  { path: 'booking-manager/EmployeeHome', component: BookingManagerComponent},
  { path: 'equipment-manager/EmployeeHome', component: EqupimentManagerComponent},
  { path: 'member-manager/EmployeeHome', component: MemberManagerComponent},
  { path: 'Home/available-bookings', component: HomeComponent},
  { path: 'Gym-manager/dashboard', component: GymManagerComponent},
  { path: 'gym-manager/user-manager', component: GymManagerComponent},
  { path: 'user-manager/gym-manager', component: UserManagerComponent},


  { path: 'booking-manager/workouts', component: BookingManagerComponent},
  { path: 'booking-manager/lesson-plan', component: BookingManagerComponent},
  { path: 'booking-manager/booking-slot', component: BookingManagerComponent},

  { path: 'equipment-manager/equipment', component: EqupimentManagerComponent},
  { path: 'equipment-manager/inspection', component: EqupimentManagerComponent},
  
  { path: 'equipment/equipment-manager', component: EquipmentComponent},
  { path: 'inspection/equipment-manager', component: InspectionComponent},

  {path: 'lesson-plan/workout', component: LessonPlanComponent},  
  {path: 'lesson-plan/add-lesson-plan', component: LessonPlanComponent},  
  {path: 'add-lesson-plan/lesson-plan', component: AddLessonPlanComponent},

  {path: 'workout/workout-category', component: WorkoutComponent},  
  {path: 'workout/lesson-plan', component: WorkoutComponent}, 

  {path: 'lesson-plan/equipment', component: LessonPlanComponent},  
  {path: 'equipment/lesson-plan', component: EquipmentComponent}, 
  
  {path: 'equipment/add-equipment', component: EquipmentComponent}, 
  {path: 'add-equipment/equipment', component: AddEquipmentComponent},
  
  {path: 'equipment/edit-equipment', component: EquipmentComponent}, 
  {path: 'edit-equipment/equipment', component: EditEquipmentComponent},
  {path: 'edit-equipment/:equipment_ID', component: EditEquipmentComponent}, 
 
  {path: 'equipment/create-inspection', component: EquipmentComponent}, 
  {path: 'create-inspection/equipment', component: CreateInspectionComponent},
 // {path: 'inspection/create-inspection', component: InspectionComponent},
  //{path: 'inspection/:equipment', component: InspectionComponent},
  {path: 'create-inspection/:Equipment', component: CreateInspectionComponent}, 
  {path: 'equipment-manager/inspection', component: EqupimentManagerComponent}, 
  {path: 'inspection/equipment-manager', component: InspectionComponent}, 
  {path: 'inspection/:Equipment', component: InspectionComponent}, 

  {path: 'inventory-manager/supplier', component: InventoryManagerComponent}, 
  {path: 'supplier/inventory-manager', component: SupplierComponent},
  
  {path: 'inventory-manager/inventory', component: InventoryManagerComponent}, 
  {path: 'inventory/inventory-manager', component: InventoryComponent},
  {path: 'inventory/inspection', component: InventoryComponent},
  {path: 'inventory/add-inventory', component: InventoryComponent},
  {path: 'add-inventory/inventory', component: AddInventoryComponent},
  {path: 'inventory/edit-inventory', component: InventoryComponent},
  {path: 'edit-inventory/inventory', component: EditInventoryComponent},
  {path: 'edit-inventory/:inventoryID', component: EditInventoryComponent},
  {path: 'inventory/create-inspection', component: InventoryComponent},
  {path: 'create-inspection/inventory', component: CreateInspectionComponent}, 
  {path: 'create-inspection/:Inventory', component: CreateInspectionComponent}, 
  {path: 'inventory-manager/inspection', component: InventoryManagerComponent}, 
  {path: 'inspection/inventory-manager', component: InspectionComponent}, 
  {path: 'inspection/:Inventory', component: InspectionComponent}, 

  
 // {path: 'inspection/', component: InspectionComponent}, 
  {path: 'create-inspection/inspection', component: CreateInspectionComponent},
  {path: 'inventory/write-off', component: InventoryComponent},  
  {path: 'write-off/inventory', component: WriteOffComponent}, 
  {path: 'write-off/:inventory_ID', component: WriteOffComponent}, 

  {path: 'supplier/add-supplier', component: SupplierComponent},
  {path: 'add-supplier/supplier', component: AddSupplierComponent},
  {path: 'supplier/edit-supplier', component: SupplierComponent},
  {path: 'edit-supplier/supplier', component: EditSupplierComponent},
  {path: 'edit-supplier/:supplier_ID', component: EditSupplierComponent},
  {path: 'supplier-hub', component: SupplierHubComponent },
  {path: 'supplier-order', component: SupplierOrderComponent },
  { path: 'add-supplier-order/:supplierId', component: AddSupplierOrderComponent },

  {path: 'workout-category/workout', component: WorkoutCategoryComponent}, 
  {path: 'workout-category/add-workout-category', component: WorkoutCategoryComponent}, 
  {path: 'workout-category/edit-workout-category', component: WorkoutCategoryComponent}, 
  {path: 'edit-workout-category/:workout_Category_ID', component: EditWorkoutCategoryComponent}, 
  {path: 'edit-workout-category/workout-category', component: EditWorkoutCategoryComponent}, 

  {path: 'workout/edit-workout', component: WorkoutComponent}, 
  {path: 'edit-workout/:workout_ID', component: EditWorkoutComponent}, 
  {path: 'edit-workout/workout', component: EditWorkoutComponent}, 

  {path: 'lesson-plan/edit-lesson-plan', component: LessonPlanComponent}, 
  {path: 'edit-lesson-plan/:lesson_Plan_ID', component: EditLessonPlanComponent}, 
  {path: 'edit-lesson-plan/lesson-plan', component: EditLessonPlanComponent}, 
  
  {path: 'add-workout-category/workout-category', component: AddWorkoutCategoryComponent}, 
  {path: 'workout/add-workout', component: WorkoutComponent}, 
  {path: 'add-workout/workout', component: AddWorkoutComponent}, 

  {path: 'booking-slot/booking-manager', component: BookingManagerComponent},
  {path: 'booking-slot/create-booking-slot', component: BookingSlotComponent},
  {path: 'create-booking-slot/booking-slot', component: CreateBookingSlotComponent},
  {path: 'booking-slot/edit-booking-slot', component: BookingSlotComponent},
  {path: 'edit-booking-slot/booking-slot', component: EditBookingSlotComponent},
  {path: 'edit-booking-slot/:bookingSlotID', component: EditBookingSlotComponent},
  {path: 'booking-slot/generate-attendance-list', component: BookingSlotComponent},
  {path: 'generate-attendance-list/booking-slot', component: GenerateAttendanceListComponent},
  {path: 'generate-attendance-list/:timeSlotId', component: GenerateAttendanceListComponent},

  
  {path: 'home/available-bookings', component: HomeComponent},
  {path: 'available-bookings/home', component: AvailableBookingsComponent},
  {path: 'available-bookings/create-booking', component: AvailableBookingsComponent},
  {path: 'create-booking/home', component: CreateBookingComponent},
  {path: 'create-booking/:lesson_Plan_ID/:lessonPlanName', component: CreateBookingComponent},
  {path: 'booking/edit-booking', component: BookingComponent},
  {path: 'edit-booking/booking', component: EditBookingComponent},
  {path: 'edit-booking/:booking_ID/:timeSlot_ID/:lessonPlanID', component: EditBookingComponent},


  {path: 'payment', component: PaymentComponent},
  {path: 'vat', component: VATComponent},
  {path: 'discount', component: DiscountComponent},

  {path: 'reward-type', component: RewardTypeComponent},
  {path: 'rewards', component:RewardsComponent},
  {path: 'reward', component:RewardComponent},

  {path: 'product-list', component:ProductListComponent},
  {path: 'product-item/:product_id', component:ProductItemComponent},
  {path: 'cart', component:CartComponent},
  {path: 'wishlist', component:WishlistComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'order-manager', component: OrderManagementComponent },
  { path: 'overdue-settings', component: OverdueSettingsComponent },
  { path: ' ', component: HelpModalComponent },
  
  
  { path: 'product-manager', component: ProductManagerComponent },
  { path: 'product-management', component: ProductManagementComponent },
  { path: 'product-category', component: ProductCategoryComponent },
  { path: 'product-type', component: ProductTypeComponent },
  
  { path: 'payment-success', component:PaymentSuccessComponent },
  { path: 'payment-cancel', component:PaymentCancelComponent },
  

  
  { path: 'gym-manager/dashboard', component: GymManagerComponent},
  { path: 'dashboard/gym-manager', component: DashboardComponent},

  { path: 'dashboard/booking-report', component: DashboardComponent},
  { path: 'booking-report/dashboard', component: BookingReportComponent},
  { path: 'booking-report/:One Month', component: BookingReportComponent},
  { path: 'booking-report/:Three Months', component: BookingReportComponent},
  { path: 'booking-report/:Six Months', component: BookingReportComponent},
  { path: 'booking-report/:Year', component: BookingReportComponent},

  { path: 'dashboard/sales-report', component: DashboardComponent},
  { path: 'sales-report/dashboard', component: SalesReportComponent},
  { path: 'sales-report/:One Month', component: SalesReportComponent},
  { path: 'sales-report/:Three Months', component: SalesReportComponent},
  { path: 'sales-report/:Six Months', component: SalesReportComponent},
  { path: 'sales-report/:Year', component: SalesReportComponent},
  
  { path: 'dashboard/member-report', component: DashboardComponent},
  { path: 'member-report/dashboard', component: MemberReportComponent},
  { path: 'member-report/:One Month', component: MemberReportComponent},
  { path: 'member-report/:Three Months', component: MemberReportComponent},
  { path: 'member-report/:Six Months', component: MemberReportComponent},
  { path: 'member-report/:Year', component: MemberReportComponent},

  { path: 'dashboard/financial-report', component: DashboardComponent},
  { path: 'financial-report/dashboard', component: FinancialReportComponent},
  { path: 'financial-report/:One Month', component: FinancialReportComponent},
  { path: 'financial-report/:Three Months', component: FinancialReportComponent},
  { path: 'financial-report/:Six Months', component: FinancialReportComponent},
  { path: 'financial-report/:Year', component: FinancialReportComponent},

  { path: 'dashboard/inspection-report', component: DashboardComponent},
  { path: 'inspection-report/dashboard', component: InspectionReportComponent},
  { path: 'inspection-report/:One Month', component: InspectionReportComponent},
  { path: 'inspection-report/:Three Months', component: InspectionReportComponent},
  { path: 'inspection-report/:Six Months', component: InspectionReportComponent},
  { path: 'inspection-report/:Year', component: InspectionReportComponent},

  { path: 'dashboard/audit-trail-report', component: DashboardComponent},
  { path: 'audit-trail-report/dashboard', component: AuditTrailReportComponent},
  { path: 'audit-trail-report/:One Month', component: AuditTrailReportComponent},
  { path: 'audit-trail-report/:Three Months', component: AuditTrailReportComponent},
  { path: 'audit-trail-report/:Six Months', component: AuditTrailReportComponent},
  { path: 'audit-trail-report/:Year', component: AuditTrailReportComponent},


  { path: 'dashboard/inventory-report', component: DashboardComponent},
  { path: 'inventory-report/dashboard', component: InventoryReportComponent},
  { path: 'inventory-report/:One Month', component: InventoryReportComponent},
  { path: 'inventory-report/:Three Months', component: InventoryReportComponent},
  { path: 'inventory-report/:Six Months', component: InventoryReportComponent},
  { path: 'inventory-report/:Year', component: InventoryReportComponent},
  {path:'chat',component:ChatComponent},
  {path:'survey',component:SurveyComponent},
  {path:'admin-survey',component:AdminSurveyComponent},
  {path:'admin',component:AdminComponent},
  {path:'weekly-news',component:WeeklyNewsComponent}
  
  

];