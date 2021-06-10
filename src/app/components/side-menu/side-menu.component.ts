import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  route_url: any = '';
  homeMenu : any = ['/my-messages','/attendance','/transport','/teacher-performance-report','/class-management'
                    ,'/students','/admin-fee','/teachers','/timetable','/general-performance-report',
                  '/student-performance-report','/school-performance-report'];
  empMenu : any = ['/edit-teacher','/teacher-details','/staff-details'];
  homeActive : boolean = false;
  empActive : boolean = false;
  showMe:boolean = true;

  constructor(private router: Router,private local: LocalstorageService) { 
    router.events.subscribe((url:any) =>'');
    this.route_url = router.url;
    if (this.homeMenu.includes(this.route_url)) {
      this.homeActive = true;
    }
    if (this.empMenu.includes(this.route_url)) {
      this.empActive = true;
    }
   }

  ngOnInit() {
  }

  logout(){
    this.local.storeData('AdminloginData', null);
    this.router.navigate(['/']);
  }

  clickMe(){
    console.log('hey');
    this.showMe = !this.showMe;
  }

}
