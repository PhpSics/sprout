import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-student-fees',
  templateUrl: './student-fees.component.html',
  styleUrls: ['./student-fees.component.css']
})
export class StudentFeesComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  resdata: any = {};
  studentName = '';
  studentImage = '';
  Url: any = environment.baseUrl;
  studentClass = '';
  terms: any = [];
  fees: any = [];
  cTerm: any = [];
  tName: any = '';
  discounts: any = [];
  disList: any = [];
  disList1: any = [];
  model: any = { termId: '', term2Id: '', term3Id: '' };
  receiptArr: any = [];
  feeArr: any = [];
  totalAmount: any = 0;
  totalBalance: any;
  totalPaid: any = 0;
  termId: any = '';
  termName: any = '';
  payForm: FormGroup;
  disForm: FormGroup;
  submitted = false;
  errorMessage: any = '';
  staffSettings: any = {};
  discountAmount: any = 0;
  invoiceId: any = '';
  dTotalAmount: any = 0;
  discountStr: any = '';
  pPay: any = false;
  currentTerm: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    if (this.dataService.studentId === undefined) {
      this.router.navigate(['/students']);
    } else {
      this.studentName = this.dataService.studentName;
      this.studentImage = this.dataService.studentImage;
      this.studentClass = this.dataService.studentClass;
    }
    this.disForm = this.formBuilder.group({
      invoiceId: [this.invoiceId],
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
      studentId: [this.dataService.studentId],
      discount: [this.discountStr],
      amount: [this.discountAmount],
      discountId: []
    });
    this.payForm = this.formBuilder.group({
      schoolId: [this.User.schoolId],
      termId: [this.termId],
      termName: [this.termName],
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
      studentId: [this.dataService.studentId],
      amountPaid: ['', [Validators.required]],
      paidDate: ['', [Validators.required]]
    });
    this.staffSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'discountName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.getDiscounts();
    this.getTerms();
  }

  get f() { return this.payForm.controls; }

  getDiscounts() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/list-discount').subscribe(
      (val) => {
        this.resdata = val;
        if (this.resdata.status === true) {
          this.discounts = this.resdata.data;
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  onSelectAll(items: any, type) {
    if (type === 'staff') {
      this.disList = [];
      items.forEach(element => {
        this.disList.push(element._id);
      });

    }
  }

  onItemSelect(items: any, type) {
    if (type === 'staff') {
      this.disList.push(items._id);
      this.calculateDiscount();
    }
  }

  calculateDiscount() {
    const self = this; let amnt = 0;
    this.discountAmount = this.dTotalAmount;
    this.disList.forEach(elements => {
      this.discounts.forEach(element => {
        if (element._id === elements) {
          if (element.discountAmount !== 0) {
            amnt = self.discountAmount - element.discountAmount;
            if (amnt < 0) {
              amnt = 0;
              this.disList1.push(self.discountAmount);
            } else {
              this.disList1.push(element.discountAmount);
            }
            self.discountAmount = amnt.toFixed(0);
            this.disForm.controls.amount.setValue(self.discountAmount);
          }
          if (element.discountPercent !== 0) {
            amnt = Math.ceil(self.discountAmount - ((self.discountAmount * element.discountPercent) / 100));
            if (amnt < 0) {
              amnt = 0;
              this.disList1.push(self.discountAmount);
            } else {
              this.disList1.push((self.discountAmount * element.discountPercent) / 100);
            }
            amnt = Number(amnt.toFixed(0));
            self.discountAmount = amnt;
            this.disForm.controls.amount.setValue(self.discountAmount);
          }
        }
      });
    });
  }
  onItemDeselect(items: any, type) {
    if (type === 'staff') {
      const index2 = this.disList.indexOf(items._id);
      if (index2 > -1) {
        this.disList.splice(index2, 1);
        this.calculateDiscount();
        // console.log(this.disList1[index2]);
        // this.discountAmount += this.disList1[index2];
        // this.disList1.splice(index2, 1);
      }
    }
  }

  onDeSelectAll(items: any, type) {
    if (type === 'staff') {
      this.disList = [];
      this.discountAmount = this.dTotalAmount;
    }
  }
  saveDiscount() {
    this.submitted = true;
    if (this.disForm.invalid) {
      return;
    }
    this.disForm.value.discount = this.disList.join(',');
    this.ajaxService.postMethod('api/fees/student-discount', this.disForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status === true) {
          this.submitted = false;
          const dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
            width: '350px',
            data: 'Discount Added'
          });
          dialogRef1.afterClosed().subscribe(result => {
          });
          this.changeTerms(this.payForm.value.termId);
          this.changeTerm1(this.termId, this.termName);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }
  savePayment() {
    this.submitted = true;
    if (this.payForm.invalid) {
      return;
    }
    // if(this.payForm.value.amountPaid>this.totalBalance){
    //   const dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
    //     width: '350px',
    //     data: "Balance amount to pay:"+this.totalBalance
    //   });
    //   dialogRef1.afterClosed().subscribe(result => {
    //   });
    //   return;
    // }
    this.payForm.value.amountPaid = Number(this.payForm.value.amountPaid);
    this.ajaxService.postMethod('api/fees/add-payment', this.payForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status === true) {
          this.payForm.reset({
            schoolId: this.User.schoolId, termId: this.termId,
            fromName: this.User.userName,
            fromImage: this.User.userImage,
            studentId: this.dataService.studentId
          });
          this.submitted = false;
          this.changeTerms(this.termId);
          this.changeTerm1(this.termId, this.termName);
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  changeTerms(termId) {
    let isCurrent = 'false';
    if(this.currentTerm==termId){
      isCurrent = 'true';
    }
    this.ajaxService.getMethod({ termId: termId, studentId: this.dataService.studentId,isCurrent:isCurrent }, 'api/fees/get-student-invoice').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status === true) {
        this.fees = this.resdata.data;
        this.dTotalAmount = this.discountAmount;
        if (!this.isEmpty(this.fees)) {
          this.totalPaid = this.fees.paidAmount;
          this.invoiceId = this.fees._id;
        } else {
          this.totalPaid = 0;
        }
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  // call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  getCurrentTerm(terms) {
    return terms.filter(this.checkTerm);
  }

  checkTerm(element, index, array) {
    // console.log('Hey');
    const currentDay = dateToStr(new Date());
    // console.log(element.FromdtStr +'<=' + currentDay + '&&' + element.TodtStr + '>=' + currentDay);
    if (element.FromdtStr <= currentDay && element.TodtStr >= currentDay) {
      // console.log('Wow');
      return element;
    }

    function dateToStr(dt) {
      const nY = dt.getFullYear();
      let nM = '';
      let nDa = '';
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
      const cD = nY + '' + nM + '' + nDa;
      return parseInt(cD);
    }
  }

  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status === true) {
        this.terms = this.resdata.data;
        this.cTerm = this.getCurrentTerm(this.terms);
        console.log('Terms');
        console.log(this.cTerm);
        if (this.cTerm.length > 0) {
          this.currentTerm = this.cTerm[0]._id;
          this.tName = this.cTerm[0].termName;
        }
        // this.termForm.controls.termId.setValue(this.currentTerm);
        this.termId = this.currentTerm;
        this.changeTerm1(this.termId, this.tName);
        // this.changeTerm1(this.termId,this.tName,2);
        this.model.termId = this.termId;
        this.model.term2Id = this.termId;
        this.model.term3Id = this.termId;
        console.log(this.termId);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  showAlert() {
    const dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: 'Please select term'
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
    return;
  }

  showsAlert() {
    const dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: 'No balance to pay!'
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
    return;
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  changeTerm(termId, event, etype = 0) {
    this.disForm.controls.discountId.setValue([]);
    // if (etype == 3) {
    this.termId = termId;
    this.payForm.controls.termId.setValue(termId);
    this.termName = event.target.options[event.target.options.selectedIndex].getAttribute('data-text');
    // }
    let isCurrent = 'false';
    if(this.currentTerm==termId){
      isCurrent = 'true';
    }
    this.payForm.controls.termName.setValue(this.termName);
    this.ajaxService.getMethod({ termId: termId, studentId: this.dataService.studentId,isCurrent:isCurrent }, 'api/fees/get-student-invoice').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status === true) {
        this.fees = this.resdata.data;
        // this.totalBalance = this.resdata.balance;
        this.disList = [];
        this.disList1 = [];
        if (!this.isEmpty(this.fees)) {
          this.totalAmount = this.fees.feeId.reduce((sum, item) => sum + item.amount, 0);
          this.discountAmount = this.fees.amount;
          this.disForm.controls.invoiceId.setValue(this.fees._id);
          this.disForm.controls.amount.setValue(this.fees.amount);
          this.dTotalAmount = this.fees.amount;
          this.disForm.controls.discountId.setValue(this.fees.discounts);
          // if (etype == 2)
          this.totalBalance = this.fees.balance;
          // if (etype == 3)
          this.totalPaid = this.fees.paidAmount;
          if (this.totalBalance === 0) {
            this.pPay = true;
          } else {
            this.pPay = false;
          }
        } else {
          this.pPay = true;
          this.dTotalAmount = 0;
          this.discountAmount = 0;
          this.totalAmount = 0;
          // if (etype == 2)
          this.totalBalance = this.resdata.balance;
          // if (etype == 3)
          this.totalPaid = 0;
        }
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeTerm1(termId, termName, etype = 0) {
    this.totalBalance = 0;
    this.totalPaid = 0;
    this.disForm.controls.discountId.setValue([]);
    // if (etype == 3) {
    this.termId = termId;
    this.payForm.controls.termId.setValue(termId);
    this.payForm.controls.termName.setValue(termName);
    this.termName = termName;
    let isCurrent = 'false';
    if(this.currentTerm==termId){
      isCurrent = 'true';
    }
    // }
    this.ajaxService.getMethod({ termId: termId, studentId: this.dataService.studentId,isCurrent:isCurrent }
                              , 'api/fees/get-student-invoice').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status === true) {
        this.fees = this.resdata.data;
        this.totalBalance = this.resdata.balance;
        this.disList = [];
        this.disList1 = [];
        if (!this.isEmpty(this.fees)) {
          this.totalAmount = this.fees.feeId.reduce((sum, item) => sum + item.amount, 0);
          this.discountAmount = this.fees.amount;
          this.disForm.controls.invoiceId.setValue(this.fees._id);
          this.disForm.controls.amount.setValue(this.fees.amount);
          this.dTotalAmount = this.fees.amount;
          this.disForm.controls.discountId.setValue(this.fees.discounts);
          // if (etype == 2)
          // this.totalBalance = this.fees.balance;
          // if (etype == 3)
          this.totalPaid = this.fees.paidAmount;
          if (this.fees.balance === 0) {
            this.pPay = true;
          } else {
            this.pPay = false;
          }
        } else {
          this.pPay = true;
          this.dTotalAmount = 0;
          this.discountAmount = 0;
          this.totalAmount = 0;
          // if (etype == 2)
          // this.totalBalance = 0;
          // if (etype == 3)
          // this.totalPaid = 0;
        }
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  openDialog(fname, fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this data?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname === 'delete') {
          this.deleteReceipt(fid);
        }
        // DO SOMETHING
      }
    });
  }

  deleteReceipt(id) {
    this.ajaxService.getMethod({ paymentId: id }, 'api/fees/delete-receipt').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status === true) {
        this.changeTerms(this.termId);
      } else {

      }
    }, err => {

      console.log(err);
    });
  }

  exportData(type) {
    if (type === 'receipt') {
      this.receiptArr = [];
      this.receiptArr.push({ first: 'No', second: 'Date', third: 'Receipt No.', sixth: 'Amount' });
      if (this.fees.paymentId.length > 0) {
        let j = 1;
        let rec = 0;
        this.fees.paymentId.forEach(element => {
          this.receiptArr.push({ first: j, second: element.createdAt, third: element.receiptNo, sixth: element.amountPaid });
          rec = rec + element.amountPaid;
          j++;
        });
        this.receiptArr.push({ first: '', second: '', third: 'Total Received', sixth: rec });
        new Angular5Csv(this.receiptArr, 'Receipt_' + this.studentName);
      }
    } else if (type === 'invoice') {
      this.feeArr = [];
      this.feeArr.push({ first: 'No', second: 'Fee Type', third: 'Fee Amount' });
      if (this.fees.feeId.length > 0) {
        let i = 1;
        let gf = 0;
        this.fees.feeId.forEach(element => {
          let feename = '';
          if (element.feeType === 'tution') {
            feename = element.feeName;
          } else { feename = element.groupName; }
          gf = gf + element.amount;
          this.feeArr.push({ first: i, second: feename, third: element.amount });
          i++;
        });
        this.feeArr.push({ first: '', second: 'Total Fee', third: gf });
        this.feeArr.push({ first: '', second: 'Total Fee Less Discount', third: this.discountAmount });
        new Angular5Csv(this.feeArr, 'Invoice_' + this.studentName);
      }
    }
  }

}
