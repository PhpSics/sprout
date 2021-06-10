import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.css']
})
export class FeeStructureComponent implements OnInit {
  User: any = {};
  resdata: any = {};
  fees: any = [];
  terms: any = [];
  otherfees: any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.getTerms();
    this.getFees();
    this.getOtherFees();
  }

  changeTerm(termId){
    this.getFees(termId);
    this.getOtherFees(termId);
  }

  getFees(termId='') {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, termId: termId }, 'api/fees/list-tution-fee').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        // console.log(this.fees);
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

  getOtherFees(termId='') {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, termId: termId }, 'api/fees/list-groups').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.otherfees = this.resdata.data;
        // console.log(this.otherfees);
      } else {
        console.log('false');
      }
    }, err => {

      console.log(err);
    });
  }

}
