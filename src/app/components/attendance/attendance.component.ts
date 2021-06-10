import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { NgForm } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild(NgForm) myForm: NgForm
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('content') content: ElementRef;
  index: any = 0;
  resdata: any = {};
  submitted: boolean = false;
  data: any = [];
  DateArray: any = [];
  classes: any = [];
  User: any = {};
  streams: any = [];
  subjects: any = [];
  attendance: any = [];
  classId: any = '';
  streamId: any = '';
  subjectId: any = '';
  show: boolean = false;
  curDate: any = new Date();
  chart: any;
  year: any = '';
  month: any = '';
  reasons: any = [];
  model: any = {};
  errorMessage: any = '';
  reasonVal: any = '';
  monthNames: any = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];
  curmnt: any = new Date().getMonth();
  curmonthName: any = '';
  monthly_avg: any = 0;
  daily_avg: any = 0;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.year = this.curDate.getFullYear();
    var d = this;
    this.month = this.curDate.getMonth() + 1;
    this.curmonthName = this.monthNames[this.curDate.getMonth()];
    if (this.month < 10)
      this.month = '0' + this.month;
    this.getClass();
    this.getSubject();
    this.model = {
      studentId: '',
      date: '',
      reason: '',
      reasons: '',
      classId: this.classId,
      stream: this.streamId,
      subjectId: this.subjectId,
      fromName: this.User.userName,
      fromImage: this.User.userImage,
      teacherId: '',
      studentName: ''
    }
    this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        datasets: [
          {
            label: "Absenties%",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#0182e3",
            borderColor: "#0182e3",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#0182e3",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#0182e3",
            pointHoverBorderColor: "#0182e3",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            spanGaps: false,
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'ATTENDANCE REPORT'
        },
        onClick: function (points, evt, yy) {
          console.log(evt);
          if (evt.length > 0) {
            d.index = evt[0]._index;
            d.getReasons(evt[0]._index);
          }
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItems, data) {
              //Return value for title
              return '';
            },
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ':';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
            }
          }
        },
        legend: {
          display: false
        },
        bezierCurve: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Date',
            },
            ticks: {
              userCallback: function (item, index) {
                if (!(index % 5)) return item;
              },
              autoSkip: false
            },

          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Absent Percentage',
            },
            display: true
          }],
        },

      }
    });
    this.getAttendance(this.curDate);

  }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.classes = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeClass(id) {
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
        this.classId = id;
        this.streamId = '';
        this.show = false;
        this.getAttendance(this.curDate);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getSubject() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/subject').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.subjects = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeStream(id) {
    this.streamId = id;
    this.show = true;
    this.getAttendance(this.curDate);
  }

  changeSubject(id) {
    this.subjectId = '';
    this.getAttendance(this.curDate);
  }

  getAttendance(date) {
    var dateVal = this.datetostr(date);
    var mrt = dateVal.toString().slice(0, 6);
    var mltc = parseInt(mrt);
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, classId: this.classId, stream: this.streamId, subjectId: this.subjectId, month: mltc }, 'api/attendance/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.attendance = this.resdata.data;
        var total = this.resdata.totalCount;
        this.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var label = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        var dataVal = this.data;
        var mAvg = 0;
        this.attendance.forEach(element => {
          var dateF = this.formatDate(new Date(element.date));
          var index = label.indexOf(dateF);
          if (index > -1) {
            var percentage = (element.absent / total) * 100;
            dataVal[index] = Math.floor(percentage);
            mAvg += Number(element.absent / total);
            // console.log('avg' + (element.absent / total));
            // console.log('mavg'+mAvg);
          }
        });
        // console.log('mavg' + mAvg);
        this.monthly_avg = Math.floor((mAvg / this.attendance.length) * 100);
        if (Number.isNaN(this.monthly_avg))
          this.monthly_avg = 0;
        var dval = new Date().getDate();
        this.daily_avg = this.data[dval];
        this.drawChart();
        // console.log(this.attendance)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeReason(index) {
    this.model.date = this.reasons[index].createdAt;
    this.model.studentId = this.reasons[index].studentId._id;
    this.model.classId = this.reasons[index].classId;
    this.model.stream = this.reasons[index].stream;
    this.model.subjectId = '';
    this.model.studentName = this.reasons[index].studentId.studentName;
    this.model.teacherId = this.reasons[index].teacherId;
  }

  datetostr(dt) {
    var nY = dt.getFullYear();
    var nM; var nDa;
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

  getReasons(index) {
    this.daily_avg = this.data[index];
    if (index < 10)
      index = '0' + index;
    var date = this.year + '-' + this.month + '-' + index + 'T00:00:00.000Z';
    this.ajaxService.getMethod({ classId: this.classId, stream: this.streamId, subjectId: this.subjectId, date: date, schoolId: this.User.schoolId }, 'api/attendance/day').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.reasons = this.resdata.data;
        console.log(this.reasons)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
    console.log(date)
  }

  drawChart() {
    this.chart.data.datasets[0].data = this.data;
    this.chart.chart.update();
  }

  formatDate(today) {
    var dd = today.getDate();
    if (dd < 10) {
      dd = dd;
    }
    return dd;
  }

  onSubmit() {
    this.submitted = true;
    this.ajaxService.putUpMethod('api/attendance/reason', this.model).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.submitted = false;
          this.myForm.resetForm();
          this.model = {
            studentId: '',
            date: '',
            reason: '',
            reasons: '',
            classId: this.classId,
            stream: this.streamId,
            subjectId: this.subjectId,
            fromName: this.User.userName,
            fromImage: this.User.userImage,
            teacherId: '',
            studentName: ''
          }
          this.reasonVal = '';
          this.getReasons(this.index)
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  changeMe(val) {
    this.reasonVal = val;
    if (val != 'Other')
      this.model.reason = val;
    else
      this.model.reason = '';
  }

  nextClick() {
    var mnth = this.curmnt;
    var year = this.year;
    if (mnth == 11) {
      year++;
      mnth = 0;
    }
    else {
      mnth++;
    }
    this.curmonthName = this.monthNames[mnth];
    this.year = year;
    this.month = mnth + 1;
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    this.curmnt = mnth;
    var datVal = this.year + '.' + this.month + '.01';
    var sampleDate = new Date(datVal);
    this.getAttendance(sampleDate);
  }

  previousClick() {
    var mnth = this.curmnt;
    var year = this.year;
    if (mnth == 0) {
      year--;
      mnth = 11;
    }
    else {
      mnth--;
    }
    this.curmonthName = this.monthNames[mnth];
    this.year = year;
    this.month = mnth + 1;
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    this.curmnt = mnth;
    var datVal = this.year + '.' + this.month + '.01';
    var sampleDate = new Date(datVal);
    this.getAttendance(sampleDate);
  }

  downloadPDF1() {
    var data = document.getElementById('canvas');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var newCanvasImg = canvas.toDataURL("image/jpeg", 1.0);
      //creates PDF from img
      var doc = new jspdf('landscape');
      doc.setFontSize(20);
      doc.text(15, 15, "Super Cool Chart");
      doc.addImage(newCanvasImg, 'JPEG', 10, 10, 280, 150);

      // doc.addHtml('<p>hi</p>');
      doc.save('new-canvas.pdf');
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  public downloadPDF() {
    var data = document.getElementById('canvas');
    var c = this;
    html2canvas(data).then(canvas => {
      var newCanvasImg = canvas.toDataURL("image/jpeg", 1.0);
      var doc = new jspdf('landscape');
      doc.setFontSize(20);
      doc.text(15, 15, "Super Cool Chart");
      doc.addImage(newCanvasImg, 'JPEG', 10, 10, 280, 150);
      // doc.save('new-canvas.pdf');
      doc.addPage();
      const specialElementHandlers = {
        '#editor': function (element, renderer) {
          return true;
        }
      };

      const content = this.content.nativeElement;

      doc.fromHTML(content.innerHTML, 40, 0, {
        width: 100,
        'elementHandlers': specialElementHandlers
      },
        function (bla) { doc.save('attendanceReport'+c.curmonthName+c.year+'.pdf'); }, 0);
    });

    // const doc = new jspdf('landscape');

    // const specialElementHandlers = {
    //   '#editor': function (element, renderer) {
    //     return true;
    //   }
    // };

    // const content = this.content.nativeElement;

    // doc.fromHTML(content.innerHTML, 15, 15, {
    //   width: 100,
    //   'elementHandlers': specialElementHandlers
    // },
    //   function (bla) { doc.save('saveInCallback.pdf'); },1000);
  }

  downloadPDFs() {
    let element = document.getElementById("#content");
    html2canvas(element).then(function (canvas) {
      // Convert the canvas to blob
      canvas.toBlob(function (blob) {
        // To download directly on browser default 'downloads' location
        let link = document.createElement("a");
        link.download = "image.png";
        link.href = URL.createObjectURL(blob);
        link.click();

        // To save manually somewhere in file explorer
        // window.saveAs(blob, 'image.png');

      }, 'image/png');
    });
  }
}
