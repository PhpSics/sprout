import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'angular-webstorage-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { GrdFilterPipe } from './grd-filter.pipe';
import { SearchPipe } from './search.pipe';
import { DatePipe } from '@angular/common';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import {NeedAuthGuard} from './auth.guard';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {DataTableModule} from "angular-6-datatable";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonfunctionService } from './services/commonfunction.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
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
import { MyMessagesComponent } from './components/my-messages/my-messages.component';
import { TransportAttendanceComponent } from './components/transport-attendance/transport-attendance.component';
import { TeacherPerformanceReportComponent } from './components/teacher-performance-report/teacher-performance-report.component';
import { GenerateReportsComponent } from './components/generate-reports/generate-reports.component';
import { GeneralReportsComponent } from './components/general-reports/general-reports.component';
import { FeeOverviewComponent } from './components/fee-overview/fee-overview.component';
import { CalendarEventManagementComponent } from './components/calendar-event-management/calendar-event-management.component';
import { SetupSchoolCalendarComponent } from './components/setup-school-calendar/setup-school-calendar.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { ViewSchoolCalendarComponent } from './components/view-school-calendar/view-school-calendar.component';
import { SchoolCurriculumManagementComponent } from './components/school-curriculum-management/school-curriculum-management.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { GeneralAssessmentComponent } from './components/general-assessment/general-assessment.component';
import { BehaviouralAssessmentComponent } from './components/behavioural-assessment/behavioural-assessment.component';
import { ViewFacilityComponent } from './components/view-facility/view-facility.component';
import { BehaviouralMatrixComponent } from './components/behavioural-matrix/behavioural-matrix.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { ExtracurricularAssessmentComponent } from './components/extracurricular-assessment/extracurricular-assessment.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentInvoiceComponent } from './components/student-invoice/student-invoice.component';
import { StudentReceiptsComponent } from './components/student-receipts/student-receipts.component';
import { TeacherRolesComponent } from './components/teacher-roles/teacher-roles.component';
import { NonTeachersComponent } from './components/non-teachers/non-teachers.component';
import { SchoolComponent } from './components/school/school.component';
import { ClassManagementComponent } from './components/class-management/class-management.component';
import { SchoolCurriculumComponent } from './components/school-curriculum/school-curriculum.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { TeachingStaffComponent } from './components/teaching-staff/teaching-staff.component';
import { NonteachingstaffManagementComponent } from './components/nonteachingstaff-management/nonteachingstaff-management.component';
import { StaffRolesComponent } from './components/staff-roles/staff-roles.component';
import { FeeManagementComponent } from './components/fee-management/fee-management.component';
import { AdminFeesComponent } from './components/admin-fees/admin-fees.component';
import { EcurricularGroupManagementComponent } from './components/ecurricular-group-management/ecurricular-group-management.component';
import { SchoolProfileComponent } from './components/school-profile/school-profile.component';
import { ManageFeesComponent } from './components/manage-fees/manage-fees.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { EditTeacherComponent } from './components/edit-teacher/edit-teacher.component';
import { TeacherDetailsComponent } from './components/teacher-details/teacher-details.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { TermsComponent } from './components/terms/terms.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { CreateMailboxComponent } from './components/create-mailbox/create-mailbox.component';
import { EditMailboxComponent } from './components/edit-mailbox/edit-mailbox.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { StudentPerformanceComponent } from './components/student-performance/student-performance.component';
import { SchoolPerformanceComponent } from './components/school-performance/school-performance.component';
import { StaffDetailsComponent } from './components/staff-details/staff-details.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { SetupFeeStructureComponent } from './components/setup-fee-structure/setup-fee-structure.component';
import { TuitionfeeComponent } from './components/tuitionfee/tuitionfee.component';
import { OtherfeeComponent } from './components/otherfee/otherfee.component';
import { DiscountComponent } from './components/discount/discount.component';
import { FeeStructureComponent } from './components/fee-structure/fee-structure.component';
import { MyAlertDialogComponent } from './components/shared/my-alert-dialog/my-alert-dialog.component';
import { AddTuitionfeeComponent } from './components/add-tuitionfee/add-tuitionfee.component';
import { AddStudentFeesComponent } from './components/add-student-fees/add-student-fees.component';
import { MyChatComponent } from './components/my-chat/my-chat.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { ReviewHomeworkComponent } from './components/review-homework/review-homework.component';
import { ListHomeworkComponent } from './components/list-homework/list-homework.component';
import { TakeAttendanceComponent } from './components/take-attendance/take-attendance.component';
import { StudentAttendanceComponent } from './components/student-attendance/student-attendance.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { StudentHomeworkComponent } from './components/students/student-homework/student-homework.component';
import { FaqComponent } from './components/faq/faq.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { ViewHomeworkComponent } from './components/students/view-homework/view-homework.component';
import { HomeworkAttachmentsComponent } from './components/homework-attachments/homework-attachments.component'; 
import { AttachmentDialogComponent } from './components/shared/attachment-dialog/attachment-dialog.component';
import { VideoDialogComponent } from './components/shared/video-dialog/video-dialog.component';
import { MatVideoModule } from 'mat-video';
import { MatProgressSpinnerModule } from '@angular/material';
import { StudentMessageComponent } from './components/student-message/student-message.component';
import { LinkyModule } from 'ngx-linky';
import { StudentMsgListComponent } from './components/student-msg-list/student-msg-list.component';
import { ClassBroadcastListComponent } from './components/class-broadcast-list/class-broadcast-list.component';
// import {Ng2TelInputModule} from 'ng2-tel-input';
  import { from } from 'rxjs';
 
//import {NgxIntlTelInputModul} from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SideMenuComponent,
    AttendanceComponent,
    TransportComponent,
    TimetableComponent,
    SettingsComponent,
    FacilityComponent,
    FeeComponent,
    LearningComponent,
    MessagesComponent,
    ClassComponent,
    StudentsComponent,
    TeachersComponent,
    MyMessagesComponent,
    TransportAttendanceComponent,
    TeacherPerformanceReportComponent,
    GenerateReportsComponent,
    GeneralReportsComponent,
    FeeOverviewComponent,
    CalendarEventManagementComponent,
    SetupSchoolCalendarComponent,
    EventManagementComponent,
    ViewSchoolCalendarComponent,
    SchoolCurriculumManagementComponent,
    AssessmentComponent,
    GeneralAssessmentComponent,
    BehaviouralAssessmentComponent,
    ViewFacilityComponent,
    BehaviouralMatrixComponent,
    SubjectsComponent,
    ExtracurricularAssessmentComponent,
    RoleManagementComponent,
    StudentProfileComponent,
    StudentInvoiceComponent,
    StudentReceiptsComponent,
    TeacherRolesComponent,
    NonTeachersComponent,
    SchoolComponent,
    ClassManagementComponent,
    SchoolCurriculumComponent,
    EmployeeManagementComponent,
    TeachingStaffComponent,
    NonteachingstaffManagementComponent,
    StaffRolesComponent,
    FeeManagementComponent,
    AdminFeesComponent,
    EcurricularGroupManagementComponent,
    SchoolProfileComponent,
    ManageFeesComponent,
    StudentFeesComponent,
    EditTeacherComponent,
    TeacherDetailsComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    TermsComponent,
    MailboxComponent,
    CreateMailboxComponent,
    EditMailboxComponent,
    StudentPerformanceComponent,
    SchoolPerformanceComponent,
    StaffDetailsComponent,
    ConfirmationDialogComponent,
    SetupFeeStructureComponent,
    TuitionfeeComponent,
    OtherfeeComponent,
    DiscountComponent,
    FeeStructureComponent,
    MyAlertDialogComponent,
    AddTuitionfeeComponent,
    AddStudentFeesComponent,
    GrdFilterPipe,
    SearchPipe,
    MyChatComponent,
    HomeworkComponent,
    ReviewHomeworkComponent,
    ListHomeworkComponent,
    TakeAttendanceComponent,
    StudentAttendanceComponent,
    ResetPasswordComponent,
    StudentHomeworkComponent,
    FaqComponent,
    TermsConditionsComponent,
    NotificationSettingsComponent,
    ViewHomeworkComponent,
    HomeworkAttachmentsComponent,
    AttachmentDialogComponent,
    VideoDialogComponent,
    StudentMessageComponent,
    StudentMsgListComponent,
    ClassBroadcastListComponent
  ],
  imports: [
    
    
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule,
    InternationalPhoneNumberModule,
    // Ng2SearchPipeModule,
    MatAutocompleteModule,
    DataTableModule,
    LinkyModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatVideoModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    MyAlertDialogComponent,
    AttachmentDialogComponent,
    VideoDialogComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    CommonfunctionService,
    DatePipe,
    NeedAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
