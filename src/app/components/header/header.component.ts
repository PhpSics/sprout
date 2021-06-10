import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  User: any = {};
  siteUrl :any = '';
  Url:any = environment.baseUrl;
  defImgSrc:any = environment.defaultUserImage;
  constructor(private router: Router,private local: LocalstorageService,
    private dataService: DataService) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.siteUrl = environment.siteUrl;
  }

  logout(){
    this.local.storeData('loginData', null);
    this.router.navigate(['/']);
  }

  inc(){
    console.log(this.dataService.inc+1)
    this.dataService.inc = this.dataService.inc+1;
    console.log(this.dataService.inc)
  }

}
