import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatNativeDateModule} from '@angular/material/core';
import { StorageServiceModule } from 'angular-webstorage-service';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GrdFilterPipe } from './grd-filter.pipe';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HomeComponent } from './components/home/home.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { StudentsComponent } from './components/students/students.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { SetupHomeworkComponent } from './components/setup-homework/setup-homework.component';
import { ReviewHomeworkComponent } from './components/review-homework/review-homework.component';
import { MarkHomeworkComponent } from './components/mark-homework/mark-homework.component';
import { AcademicProgressComponent } from './components/academic-progress/academic-progress.component';
import { ExtracurricularProgressComponent } from './components/extracurricular-progress/extracurricular-progress.component';
import { BehaviouralProgressComponent } from './components/behavioural-progress/behavioural-progress.component';
import { AcademicAssessmentComponent } from './components/academic-assessment/academic-assessment.component';
import { ReviewAcademicAssessmentComponent } from './components/review-academic-assessment/review-academic-assessment.component';
import { TeachingPlanComponent } from './components/teaching-plan/teaching-plan.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { LearningComponent } from './components/learning/learning.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { ExtracurricularAssessmentComponent } from './components/extracurricular-assessment/extracurricular-assessment.component';
import { BehaviouralAssessmentComponent } from './components/behavioural-assessment/behavioural-assessment.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewAcademicProgressComponent } from './components/view-academic-progress/view-academic-progress.component';
import { ViewExtracurricularProgressComponent } from './components/view-extracurricular-progress/view-extracurricular-progress.component';
import { ViewBehaviouralProgressComponent } from './components/view-behavioural-progress/view-behavioural-progress.component';
import { LoginComponent } from './components/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { MyAlertDialogComponent } from './components/shared/my-alert-dialog/my-alert-dialog.component';
import { MyChatComponent } from './components/my-chat/my-chat.component';
import {NeedAuthGuard} from './auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FaqComponent } from './components/faq/faq.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { ParenthomeworkAttachmentsComponent } from './components/parenthomework-attachments/parenthomework-attachments.component';
import { AttachmentDialogComponent } from './components/shared/attachment-dialog/attachment-dialog.component';
import { MatVideoModule } from 'mat-video';
import { VideoDialogComponent } from './components/shared/video-dialog/video-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { LinkyModule } from 'ngx-linky';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SideMenuComponent,
    StudentsComponent,
    MessagesComponent,
    AttendanceComponent,
    HomeworkComponent,
    SetupHomeworkComponent,
    ReviewHomeworkComponent,
    MarkHomeworkComponent,
    AcademicProgressComponent,
    ExtracurricularProgressComponent,
    BehaviouralProgressComponent,
    AcademicAssessmentComponent,
    ReviewAcademicAssessmentComponent,
    TeachingPlanComponent,
    TimetableComponent,
    LearningComponent,
    AssessmentComponent,
    ExtracurricularAssessmentComponent,
    BehaviouralAssessmentComponent,
    CalendarComponent,
    ViewAcademicProgressComponent,
    ViewExtracurricularProgressComponent,
    ViewBehaviouralProgressComponent,
    LoginComponent,
    GrdFilterPipe,
    StudentProfileComponent,
    SubHeaderComponent,
    MyAlertDialogComponent,
    MyChatComponent,
    ConfirmationDialogComponent,
    SettingsComponent,
    ChangePasswordComponent,
    FaqComponent,
    TermsConditionsComponent,
    NotificationSettingsComponent,
    ParenthomeworkAttachmentsComponent,
    AttachmentDialogComponent,
    VideoDialogComponent,
    

  ],
  imports: [
    // BrowserModule.withServerTransition({appId: 'fundercat'}),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    LinkyModule,
    HttpClientModule,
    StorageServiceModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    InternationalPhoneNumberModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaterialTimepickerModule,
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
    NeedAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
