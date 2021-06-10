import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-tuitionfee',
  templateUrl: './tuitionfee.component.html',
  styleUrls: ['./tuitionfee.component.css']
})
export class TuitionfeeComponent implements OnInit {
  User:any = {};
  resdata:any = {};
  classes:any = [];
  terms:any =[];
  disabled:boolean = true;
  termId:any ='';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,private dataService: DataService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.getClass();
    this.getTerms();
  }

  getClass(){
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class/classtream').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.classes = this.resdata.data;
        // console.log(this.class);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.terms = this.resdata.data;
        //console.log(this.terms);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  isDisabled(){
    return this.disabled;
  }
  
  changeTerm(val,ev){
    this.termId = '';
    if(val!=''){
      this.disabled = false;
      this.termId = val;
    }
    else this.disabled = true;
    this.dataService.showfdt = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-fstr');
    this.dataService.showtdt = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-tstr');
    this.dataService.showTermName = ev.target.options[ev.target.options.selectedIndex].text;
  }

  showAlert(){
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: "Please select term"
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  viewFees(termName,className,streamName,cNames) {
    this.dataService.showTerm = termName;
    this.dataService.showClass = className;
    this.dataService.showStream = streamName;
    this.dataService.showcName = cNames;
    this.router.navigate(['/add-tuitionfee']);
  }
}
