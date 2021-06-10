import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
@Component({
  selector: 'app-fee-overview',
  templateUrl: './fee-overview.component.html',
  styleUrls: ['./fee-overview.component.css']
})
export class FeeOverviewComponent implements OnInit {
  options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: true,
      headers: ["FirstName", "LastName", "UserID"]
    };
  feeArr: any = [];
  User: any = {};
  stdName:any  = '';
  resdata: any = {};
  fees: any = [];
  terms: any = [];
  termForm: FormGroup;
  otherfees: any = [];
  receiptArr:any = [];
  balanceArr:any = [];
  classId: any = '';
  streamId: any = '';
  termId: any = '';
  total: any = 0;
  receivedTotal: any = 0;
  balanceTotal: any = 0;
  payments: any = [];
  balance: any = [];
  classes: any = [];
  currentTerm: any = 0;
  cTerm: any = [];
  searchTxt;
  constructor(
    private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,private _location: Location) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.getTerms();
    this.getClass();
    console.log(this.currentTerm);
    this.termForm = this.formBuilder.group({
      termId: ['']
    });
  }

  backClicked() {
    this._location.back();
  }
  
  getCurrentTerm(terms) {
    return terms.filter(this.checkTerm);
  }


  checkTerm(element, index, array) {
    var currentDay = dateToStr(new Date());
    if (element.FromdtStr <= currentDay && element.TodtStr >= currentDay) {
      return element;
    }

    function dateToStr(dt) {
      var nY = dt.getFullYear();
      var nM = '';
      var nDa = '';
      if (dt.getMonth() < 10) {
        nM = '0' + dt.getMonth();
      } else {
        nM = dt.getMonth();
      }
      if (dt.getDate() < 10) {
        nDa = '0' + dt.getDate();
      } else {
        nDa = dt.getDate();
      }
      var cD = nY + '' + nM + '' + nDa;
      return parseInt(cD);
    }
  }

  changeTerm(termId, ev) {
    this.termId = termId;
    this.getFees();
  }

  changeClass(streamId, ev) {
    this.classId = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-class');
    this.streamId = streamId;
    this.getFees();
  }

  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.terms = this.resdata.data;
        this.cTerm = this.getCurrentTerm(this.terms);
        if (this.cTerm.length > 0)
          this.currentTerm = this.cTerm[0]._id;
        this.termForm.controls.termId.setValue(this.currentTerm);
        this.termId = this.currentTerm;
        this.getFees();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  filterFee(element) {
    var pymnt = [];
    var ck = element.filter(this.checkBalance);
    var i = 1;
    var len = ck.length;
    ck.forEach(elements => {
      elements.paymentId.forEach(el => {
        el['studentCode'] = elements.studentId.studentId;
        el['studentName'] = elements.studentId.studentName;
        pymnt.push(el);
      });
      i++;
    });
    return pymnt;
  }

  filterBalance(element) {
    var pymnt = [];
    var ck = element.filter(this.checkStatus);
    var i = 1;
    var len = ck.length;
    return ck;
  }

  checkStatus(element, index, array) {
    if (element.balance > 0) {
      return element;
    }
  }

  checkBalance(element, index, array) {
    if (element.paymentStatus == 1) {
      return element;
    }
  }

  getClass() {
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

  getFees() {
    this.ajaxService.getMethod({ classId: this.classId, termId: this.termId, streamId: this.streamId }, 'api/fees/list-all-invoice').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        this.payments = this.filterFee(this.fees);
        console.log(this.payments);
        this.balance = this.filterBalance(this.fees);
        this.total = this.fees.reduce((sum, item) => sum + item.amount, 0);
        this.receivedTotal = this.payments.reduce((sum, item) => sum + item.amountPaid, 0);
        this.balanceTotal = (this.total - this.receivedTotal) < 0 ? 0 : this.total - this.receivedTotal;
        //  console.log(this.payments);
      } else {
        console.log('false');
      }
    }, err => {

      console.log(err);
    });
  }

  getStudentName(stName){
    this.stdName = stName;
  }

  exportData(type){ 
    if(type=='invoice'){
      this.feeArr = [];
      this.feeArr.push({first:'No',second:'Date',third:'Invoice No.',fourth:'Student ID',fifth:'studentName',sixth:'Amount'});
      if(this.fees.length>0){
        var i = 1;
        var inv = 0;
        this.fees.forEach(element => {
          this.feeArr.push({first:i,second:element.createdAt,third:element.invoiceNo,fourth:element.studentId.studentId,fifth:element.studentId.studentName,sixth:element.amount});
          i++;
          inv = inv+element.amount;
        });
        this.feeArr.push({first:'',second:'',third:'',fourth:'',fifth:'Total Invoiced',sixth:inv});
        new Angular5Csv(this.feeArr, 'Invoice');
      }
    }else if(type=='receipt'){
      this.receiptArr = [];
      this.receiptArr.push({first:'No',second:'Date',third:'Receipt No.',fourth:'Student ID',fifth:'studentName',sixth:'Amount'});
      if(this.fees.length>0){
        var j = 1;
        var rec = 0;
        this.payments.forEach(element => {
          this.receiptArr.push({first:j,second:element.createdAt,third:element.receiptNo,fourth:element.studentCode,fifth:element.studentName,sixth:element.amountPaid});
          j++;
          rec = rec+element.amountPaid;
        });
        this.receiptArr.push({first:'',second:'',third:'',fourth:'',fifth:'Total Received',sixth:rec});
        new Angular5Csv(this.receiptArr, 'Receipt');
      }
    }else if(type=='balance'){
      this.balanceArr = [];
      this.balanceArr.push({first:'No',fourth:'Student ID',fifth:'studentName',sixth:'Amount'});
      if(this.balance.length>0){
        var k = 1;
        var bbal= 0;
        this.balance.forEach(element => {
          this.balanceArr.push({first:k,fourth:element.studentId.studentId,fifth:element.studentId.studentName,sixth:element.balance});
          k++;
          bbal = bbal+element.balance;
        });
        this.balanceArr.push({first:'',fourth:'',fifth:'Total Balance',sixth:bbal});
        new Angular5Csv(this.balanceArr, 'Balance');
      }
    }
      
  }
  

}
