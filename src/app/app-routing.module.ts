import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { StudentsComponent } from './components/students/students.component';
import { MessagesComponent } from './components/messages/messages.component';
import { HomeworkComponent } from './components/homework/homework.component';
import { SetupHomeworkComponent } from './components/setup-homework/setup-homework.component';
import { ReviewHomeworkComponent } from './components/review-homework/review-homework.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { TeachingPlanComponent } from './components/teaching-plan/teaching-plan.component';
import { MarkHomeworkComponent } from './components/mark-homework/mark-homework.component';
import { LearningComponent } from './components/learning/learning.component';
import { AcademicProgressComponent } from './components/academic-progress/academic-progress.component';
import { ExtracurricularProgressComponent } from './components/extracurricular-progress/extracurricular-progress.component';
import { BehaviouralProgressComponent } from './components/behavioural-progress/behavioural-progress.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { AcademicAssessmentComponent } from './components/academic-assessment/academic-assessment.component';
import { ExtracurricularAssessmentComponent } from './components/extracurricular-assessment/extracurricular-assessment.component';
import { BehaviouralAssessmentComponent } from './components/behavioural-assessment/behavioural-assessment.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewAcademicProgressComponent } from './components/view-academic-progress/view-academic-progress.component';
import { ViewBehaviouralProgressComponent } from './components/view-behavioural-progress/view-behavioural-progress.component';
import { ViewExtracurricularProgressComponent } from './components/view-extracurricular-progress/view-extracurricular-progress.component';
import { LoginComponent } from './components/login/login.component';
import { MyChatComponent } from './components/my-chat/my-chat.component';
import { FaqComponent } from './components/faq/faq.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { ParenthomeworkAttachmentsComponent } from './components/parenthomework-attachments/parenthomework-attachments.component';
import { NeedAuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: HomeComponent,canActivate: [NeedAuthGuard] },
  { path: 'attendance', component: AttendanceComponent,canActivate: [NeedAuthGuard] },
  { path: 'students', component: StudentsComponent,canActivate: [NeedAuthGuard] },
  { path: 'student-profile', component: StudentProfileComponent,canActivate: [NeedAuthGuard] },
  { path: 'messages', component: MessagesComponent,canActivate: [NeedAuthGuard] },
  { path: 'homework', component: HomeworkComponent,canActivate: [NeedAuthGuard] },
  { path: 'setup-homework', component: SetupHomeworkComponent,canActivate: [NeedAuthGuard] },
  { path: 'review-homework', component: ReviewHomeworkComponent,canActivate: [NeedAuthGuard] },
  { path: 'timetable', component: TimetableComponent,canActivate: [NeedAuthGuard] },
  { path: 'teaching-plan', component: TeachingPlanComponent,canActivate: [NeedAuthGuard] },
  { path: 'mark-homework', component: MarkHomeworkComponent,canActivate: [NeedAuthGuard] },
  { path: 'learning', component: LearningComponent,canActivate: [NeedAuthGuard] },
  { path: 'academic-progress', component: AcademicProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'extracurricular-progress', component: ExtracurricularProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'behavioural-progress', component: BehaviouralProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'assessment', component: AssessmentComponent,canActivate: [NeedAuthGuard] },
  { path: 'behavioural-assessment', component: BehaviouralAssessmentComponent,canActivate: [NeedAuthGuard] },
  { path: 'extracurricular-assessment', component: ExtracurricularAssessmentComponent,canActivate: [NeedAuthGuard] },
  { path: 'academic-assessment', component: AcademicAssessmentComponent,canActivate: [NeedAuthGuard] },
  { path: 'calendar', component: CalendarComponent,canActivate: [NeedAuthGuard] },
  { path: 'my-chat', component: MyChatComponent,canActivate: [NeedAuthGuard] },
  { path: 'faq', component: FaqComponent,canActivate: [NeedAuthGuard] },
  { path: 'settings', component: SettingsComponent,canActivate: [NeedAuthGuard] },
  { path: 'terms-conditions', component: TermsConditionsComponent,canActivate: [NeedAuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent,canActivate: [NeedAuthGuard] },
  { path: 'notification-settings', component: NotificationSettingsComponent,canActivate: [NeedAuthGuard] },
  { path: 'view-academic-progress', component: ViewAcademicProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'view-behavioural-progress', component: ViewBehaviouralProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'view-extracurricular-progress', component: ViewExtracurricularProgressComponent,canActivate: [NeedAuthGuard] },
  { path: 'parenthomework-attachments', component: ParenthomeworkAttachmentsComponent,canActivate: [NeedAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
