import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { TransportComponent } from './components/transport/transport.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FacilityComponent } from './components/facility/facility.component';
import { FeeComponent } from './components/fee/fee.component';
import { LearningComponent } from './components/learning/learning.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ClassComponent } from './components/class/class.component';
import { StudentsComponent } from './components/students/students.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { TeacherPerformanceReportComponent } from './components/teacher-performance-report/teacher-performance-report.component';
import { TransportAttendanceComponent } from './components/transport-attendance/transport-attendance.component';
import { GenerateReportsComponent } from './components/generate-reports/generate-reports.component';
import { GeneralReportsComponent } from './components/general-reports/general-reports.component';
import { FeeOverviewComponent } from './components/fee-overview/fee-overview.component';
import { CalendarEventManagementComponent } from './components/calendar-event-management/calendar-event-management.component';
import { SetupSchoolCalendarComponent } from './components/setup-school-calendar/setup-school-calendar.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { ViewSchoolCalendarComponent } from './components/view-school-calendar/view-school-calendar.component';
import { SchoolCurriculumManagementComponent } from './components/school-curriculum-management/school-curriculum-management.component';
import { BehaviouralAssessmentComponent } from './components/behavioural-assessment/behavioural-assessment.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { ViewFacilityComponent } from './components/view-facility/view-facility.component';
import { BehaviouralMatrixComponent } from './components/behavioural-matrix/behavioural-matrix.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { ExtracurricularAssessmentComponent } from './components/extracurricular-assessment/extracurricular-assessment.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentInvoiceComponent } from './components/student-invoice/student-invoice.component';
import { StudentReceiptsComponent } from './components/student-receipts/student-receipts.component';
import { GeneralAssessmentComponent } from './components/general-assessment/general-assessment.component';
import { TeacherRolesComponent } from './components/teacher-roles/teacher-roles.component';
import { NonTeachersComponent } from './components/non-teachers/non-teachers.component';
import { ClassManagementComponent } from './components/class-management/class-management.component';
import { SchoolCurriculumComponent } from './components/school-curriculum/school-curriculum.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { TeachingStaffComponent } from './components/teaching-staff/teaching-staff.component';
import { NonteachingstaffManagementComponent } from './components/nonteachingstaff-management/nonteachingstaff-management.component';
import { StaffRolesComponent } from './components/staff-roles/staff-roles.component';
import { FeeManagementComponent } from './components/fee-management/fee-management.component';
import { AdminFeesComponent } from './components/admin-fees/admin-fees.component';
import { SchoolProfileComponent } from './components/school-profile/school-profile.component';
import { ManageFeesComponent } from './components/manage-fees/manage-fees.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { EditTeacherComponent } from './components/edit-teacher/edit-teacher.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { TermsComponent } from './components/terms/terms.component';
import { TeacherDetailsComponent } from './components/teacher-details/teacher-details.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { CreateMailboxComponent } from './components/create-mailbox/create-mailbox.component';
import { StudentPerformanceComponent } from './components/student-performance/student-performance.component';
import { SchoolPerformanceComponent } from './components/school-performance/school-performance.component';
import { StaffDetailsComponent } from './components/staff-details/staff-details.component';
import { EditMailboxComponent } from './components/edit-mailbox/edit-mailbox.component';
import { DiscountComponent } from './components/discount/discount.component';
import { TuitionfeeComponent } from './components/tuitionfee/tuitionfee.component';
import { OtherfeeComponent } from './components/otherfee/otherfee.component';
import { MyChatComponent } from './components/my-chat/my-chat.component';
import { FeeStructureComponent } from './components/fee-structure/fee-structure.component';
import { AddTuitionfeeComponent } from './components/add-tuitionfee/add-tuitionfee.component';
import { AddStudentFeesComponent } from './components/add-student-fees/add-student-fees.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { StudentHomeworkComponent } from './components/students/student-homework/student-homework.component';
import { ListHomeworkComponent } from './components/list-homework/list-homework.component';
import { ReviewHomeworkComponent } from './components/review-homework/review-homework.component';
import { SetupFeeStructureComponent } from './components/setup-fee-structure/setup-fee-structure.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { TakeAttendanceComponent } from './components/take-attendance/take-attendance.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { FaqComponent } from './components/faq/faq.component';
import { ViewHomeworkComponent } from './components/students/view-homework/view-homework.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { StudentAttendanceComponent } from './components/student-attendance/student-attendance.component';
import { NeedAuthGuard } from './auth.guard';
import { HomeworkAttachmentsComponent } from './components/homework-attachments/homework-attachments.component';
import { StudentMessageComponent } from './components/student-message/student-message.component';
import { StudentMsgListComponent } from './components/student-msg-list/student-msg-list.component';
import { ClassBroadcastListComponent } from './components/class-broadcast-list/class-broadcast-list.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'reset-password/:type/:id', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-message', component: StudentMessageComponent, canActivate: [NeedAuthGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'transport', component: TransportComponent, canActivate: [NeedAuthGuard] },
  { path: 'timetable', component: TimetableComponent, canActivate: [NeedAuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [NeedAuthGuard] },
  { path: 'facility', component: FacilityComponent, canActivate: [NeedAuthGuard] },
  { path: 'fee', component: FeeComponent, canActivate: [NeedAuthGuard] },
  { path: 'learning', component: LearningComponent, canActivate: [NeedAuthGuard] },
  { path: 'my-messages', component: MessagesComponent, canActivate: [NeedAuthGuard] },
  { path: 'class-management', component: ClassComponent, canActivate: [NeedAuthGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [NeedAuthGuard] },
  { path: 'teachers', component: TeachersComponent, canActivate: [NeedAuthGuard] },
  { path: 'teacher-roles', component: TeacherRolesComponent, canActivate: [NeedAuthGuard] },
  { path: 'transport-attendance', component: TransportAttendanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'teacher-performance-report', component: TeacherPerformanceReportComponent, canActivate: [NeedAuthGuard] },
  { path: 'generate-report', component: GenerateReportsComponent, canActivate: [NeedAuthGuard] },
  { path: 'general-performance-report', component: GeneralReportsComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-performance-report', component: StudentPerformanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'school-performance-report', component: SchoolPerformanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'fee-overview', component: FeeOverviewComponent, canActivate: [NeedAuthGuard] },
  { path: 'calendar-event-management', component: CalendarEventManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'setup-school-term', component: SetupSchoolCalendarComponent, canActivate: [NeedAuthGuard] },
  { path: 'event-management', component: EventManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'view-school-calendar', component: ViewSchoolCalendarComponent, canActivate: [NeedAuthGuard] },
  { path: 'school-curriculum-management', component: SchoolCurriculumManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'behavioural-assessment', component: BehaviouralAssessmentComponent, canActivate: [NeedAuthGuard] },
  { path: 'view-facility', component: ViewFacilityComponent, canActivate: [NeedAuthGuard] },
  { path: 'assessment', component: AssessmentComponent, canActivate: [NeedAuthGuard] },
  { path: 'behavioural-matrix', component: BehaviouralMatrixComponent, canActivate: [NeedAuthGuard] },
  { path: 'subjects', component: SubjectsComponent, canActivate: [NeedAuthGuard] },
  { path: 'extracurricular-assessment', component: ExtracurricularAssessmentComponent, canActivate: [NeedAuthGuard] },
  { path: 'role-management', component: RoleManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-invoice', component: StudentInvoiceComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-profile', component: StudentProfileComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-receipts', component: StudentReceiptsComponent, canActivate: [NeedAuthGuard] },
  { path: 'general-assessment', component: GeneralAssessmentComponent, canActivate: [NeedAuthGuard] },
  { path: 'non-teachers', component: NonTeachersComponent, canActivate: [NeedAuthGuard] },
  { path: 'manage-class', component: ClassManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'school-curriculum-management', component: SchoolCurriculumComponent, canActivate: [NeedAuthGuard] },
  { path: 'employee-management', component: EmployeeManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'teaching-staff', component: TeachingStaffComponent, canActivate: [NeedAuthGuard] },
  { path: 'staff-management', component: NonteachingstaffManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'staff-roles', component: StaffRolesComponent, canActivate: [NeedAuthGuard] },
  { path: 'fee-management', component: FeeManagementComponent, canActivate: [NeedAuthGuard] },
  { path: 'admin-fee', component: AdminFeesComponent, canActivate: [NeedAuthGuard] },
  { path: 'school-profile', component: SchoolProfileComponent, canActivate: [NeedAuthGuard] },
  { path: 'manage-fees', component: ManageFeesComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-fees', component: StudentFeesComponent, canActivate: [NeedAuthGuard] },
  { path: 'edit-teacher', component: EditTeacherComponent, canActivate: [NeedAuthGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [NeedAuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [NeedAuthGuard] },
  { path: 'terms', component: TermsComponent, canActivate: [NeedAuthGuard] },
  { path: 'teacher-details', component: TeacherDetailsComponent, canActivate: [NeedAuthGuard] },
  { path: 'mailbox', component: MailboxComponent, canActivate: [NeedAuthGuard] },
  { path: 'create-mailbox', component: CreateMailboxComponent, canActivate: [NeedAuthGuard] },
  { path: 'staff-details', component: StaffDetailsComponent, canActivate: [NeedAuthGuard] },
  { path: 'edit-mailbox', component: EditMailboxComponent, canActivate: [NeedAuthGuard] },
  { path: 'confirm', component: ConfirmationDialogComponent, canActivate: [NeedAuthGuard] },
  { path: 'discount', component: DiscountComponent, canActivate: [NeedAuthGuard] },
  { path: 'fee-structure', component: FeeStructureComponent, canActivate: [NeedAuthGuard] },
  { path: 'tuitionfee', component: TuitionfeeComponent, canActivate: [NeedAuthGuard] },
  { path: 'otherfee', component: OtherfeeComponent, canActivate: [NeedAuthGuard] },
  { path: 'add-tuitionfee', component: AddTuitionfeeComponent, canActivate: [NeedAuthGuard] },
  { path: 'add-student-fee', component: AddStudentFeesComponent, canActivate: [NeedAuthGuard] },
  { path: 'setup-fee-structure', component: SetupFeeStructureComponent, canActivate: [NeedAuthGuard] },
  { path: 'my-chat', component: MyChatComponent, canActivate: [NeedAuthGuard] },
  { path: 'homework', component: HomeworkComponent, canActivate: [NeedAuthGuard] },
  { path: 'list-homework', component: ListHomeworkComponent, canActivate: [NeedAuthGuard] },
  { path: 'review-homework', component: ReviewHomeworkComponent, canActivate: [NeedAuthGuard] },
  { path: 'take-attendance', component: TakeAttendanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-attendance', component: StudentAttendanceComponent, canActivate: [NeedAuthGuard] },
  { path: 'student-homework', component: StudentHomeworkComponent, canActivate: [NeedAuthGuard]},
  { path: 'terms-conditions', component: TermsConditionsComponent, canActivate: [NeedAuthGuard]},
  { path: 'faq', component: FaqComponent, canActivate: [NeedAuthGuard]},
  { path: 'view-homework', component: ViewHomeworkComponent, canActivate: [NeedAuthGuard]},
  { path: 'notification-settings', component: NotificationSettingsComponent, canActivate: [NeedAuthGuard]},
  { path: 'homework-attachments', component: HomeworkAttachmentsComponent, canActivate: [NeedAuthGuard]},
  { path: 'student-messageList', component: StudentMsgListComponent, canActivate: [NeedAuthGuard]},
  { path: 'class-broadcastList', component: ClassBroadcastListComponent, canActivate: [NeedAuthGuard]},
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
