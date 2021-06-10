import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-teacher-roles',
  templateUrl: './teacher-roles.component.html',
  styleUrls: ['./teacher-roles.component.css']
})
export class TeacherRolesComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('f') myForm;
  User: any = {};
  roleForm: FormGroup;
  resdata: any = {};
  roles: any = [];
  permission: any = [];
  schoolId: any = '';
  submitted = false;
  searchText;
  errorMessage: any = '';
  disabled:boolean= true;
  prmsn:any = [];
  prmsn1:any = {};
  model: any = {};
  roleName:'';
  pData:any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');    
    this.schoolId = this.User.schoolId;
    this.model['schoolId'] = this.schoolId;
    this.getRoles();
    this.getPermissions();
  }
  onSubmit() {
    let pm = this.permission;
    console.log(pm);
    var t = [];var len = 0;var g=false;
    pm.forEach(element => {
      var b = {};var h = [];var k = 1;    
      b['Permission'] = [];
      len = element.Permission.length;
      g = false; 
      var hl = 0;
      element.Permission.forEach(em => {
        if(em.isChecked){
          var ls = {};
          b['catagory'] = element.Catagory;
          console.log(em.permissionName)
          ls['permissionName'] = em.permissionName;
          b['Permission'].push(ls);
          g = true;
          hl++;
        }
        if(len==k && g==true){
          t.push(b);
        }
        k++;
      });
    });
    this.model['permissionList']=t;
    console.log(this.model);
    // return;
    this.ajaxService.postMethod('api/permission/user', this.model).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.myForm.resetForm({schoolId:this.User.schoolId});
          this.submitted = false;
          this.getRoles();
          this.closeModal();
          this.schoolId = this.User.schoolId;
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }



  get roleM(): FormArray { return this.roleForm.get('roleM') as FormArray; }

  getPermissions(){
    this.ajaxService.getMethod({}, 'api/permission').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        let pm = this.resdata.data;
        var k = 1;
        pm.forEach(element => {
          var b = [];var h = [];          
          b['Catagory'] = element.Catagory;
          b['_id'] = element._id;
          b['Permission'] = [];
          element.Permission.forEach(em => {
            //console.log(em.permissionName);
            em['permissionName'] = em.permissionName;
            em['_id'] = 'perm'+k;
            em['isChecked'] = false;
            b['Permission'].push(em);
            k++;
          });
          this.permission.push(b);
        });
         //console.log(this.permission);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  getRoles(){
    this.ajaxService.getMethod({ schoolId: this.User.schoolId}, 'api/teacher/getteacherrole').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.roles = this.resdata.data;
        // console.log(this.roles);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  deleteRole(roleId) {
    this.ajaxService.getMethod({ roleId: roleId }, 'api/teacher/deleterole').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getRoles();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  openDialog(fname, fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteRole(fid);
        // DO SOMETHING
      }
    });
  }

  clickCheckBox(event,category){
    if(event.currentTarget.checked==true){
      this.prmsn1['catagory'] = category;
      let j = [];
      let k = {};
      k['pname'] = event.currentTarget.value;
      j.push(k);
      this.prmsn1['catagory'][0]['Permission'] = j;
    }else{
      let ind = this.prmsn['permission'].indexOf(event.currentTarget.value);
      this.prmsn.splice(ind,1);
    }
    this.prmsn.push(this.prmsn1);
    console.log(this.prmsn);

  }

  viewRole(roleId){
    this.ajaxService.getMethod({ roleId: roleId }, 'api/permission/role').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.pData = this.resdata.data[0];
        this.roleName = this.pData.roleId.roleName;
      } else {
      }
    }, err => {

      console.log(err);
    });
  }
}
