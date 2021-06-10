import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  User: any = {};
  Url: any = environment.baseUrl;
  ImgUrl:any = environment.defaultUserImage;
  schoolName: any = {};
  
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,private router: Router,
    private dataService: DataService) {
     }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData'); 
    console.log(this.User)
    this.schoolName = this.User.schooldetails[0].schoolName
   
    console.log(this.schoolName)
  }

  logout(){
    this.local.storeData('AdminloginData', null);
    this.router.navigate(['/']);
  }

}
