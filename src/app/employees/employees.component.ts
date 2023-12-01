import { Component, OnInit } from '@angular/core';
import { HrmService } from '../services/hrm.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbAlertModule, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit{
  model: NgbDateStruct;
  departments = [];
  managers = [];
  loggedInUser: string | null;
  birth_date = '';
  profile: any;
  editMode = false;
  viewEmpNo: any;
  showViewPopup: boolean = false;
  onSubmit() {

  }
  profileForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    birth_date: new FormControl(),
    dept_no: new FormControl(),
    title: new FormControl(''),
    salary: new FormControl(''),
  });

closePopup() {
  this.showPopup = false;
  this.profileForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    birth_date: new FormControl(),
    dept_no: new FormControl(),
    title: new FormControl(''),
    salary: new FormControl(''),
  });
// throw new Error('Method not implemented.');
}
openPopup(editMode?: any) {
  this.showPopup = true;
  if(editMode){
    this.editMode = editMode;
  }
// throw new Error('Method not implemented.');
}

  list: any = [];
  count = 0;
  pageCount = 0;
  iterator: any;
  showCondensedPagination= false;
  currentPage = 1;
  employeeSubscription: any;

  showPopup = false;
  constructor(public hrmService: HrmService){

  }

  ngOnInit(){
    this.loggedInUser = localStorage.getItem('emp_no');
    this.employeeSubscription = this.hrmService.getEmployees().subscribe(
      (result: any) =>{
        this.list = result?.result;
        this.count = result?.count;
        this.pageCount = Math.ceil(this.count/10);
        if(this.pageCount> 5) {
          this.showCondensedPagination = true;
          this.iterator = new Array(Math.abs(5));
        } else {
          this.iterator = new Array(this.pageCount);
        }
        
      }, (error)=>{

      }
    )

    this.hrmService.getDepartments().subscribe(
      (res: any)=>{
        this.departments = res?.result;
      },(error) =>{
        
      }
    )
  }

  getEmployees(pageNo: any){
    if(pageNo>=1){
      this.currentPage = pageNo;
      if(this.employeeSubscription){
        this.employeeSubscription.unsubscribe();
      }
      this.hrmService.getEmployees(pageNo).subscribe(
        (result: any) =>{
          this.list = result?.result;
          this.count = result?.count;
          this.pageCount = Math.ceil(this.count/10);
          if(this.pageCount> 5) {
            this.showCondensedPagination = true;
            this.iterator = new Array(Math.abs(5));
          } else {
            this.iterator = new Array(this.pageCount);
          }
          
        }, (error)=>{

        }
      )
    }
    
  }

  getEmployeeProfile(emp_no: any){
    this.hrmService.getEmployeeProfile(emp_no).subscribe(
      (result: any)=>{
        this.profile = result[0];
        this.profileForm.patchValue(this.profile);
        const birthDate = this.profile.birth_date.split('T')[0].split('-');

        this.model = {
          year: +birthDate[0],
          month: +birthDate[1],
          day: +birthDate[2]
        }

        console.log(result);
      },
      ()=>{

      }
    );
  }

  appendZeroIfOneDigit(str: any) {
    if(str.length == 1) {
      str = '0'+str;
    }
    return str;
  }



  submit() {
    this.profileForm.value.birth_date = this.model.year + '-' + this.appendZeroIfOneDigit(''+this.model.month) + '-' + this.appendZeroIfOneDigit(''+this.model.day);
    const body = this.profileForm.value;


    if(this.editMode){
      if(body){
        if(body?.salary == this.profile?.salary){
          delete body.salary;
        }
        if(body?.title == this.profile?.title){
          delete body.title;
        }
        if(body?.dept_no == this.profile?.dept_no){
          delete body.dept_no;
        }

        if(body?.first_name == this.profile?.first_name && body?.last_name == this.profile?.last_name && body?.birth_date == this.profile?.birth_date?.split('T')[0] && body?.gender == this.profile?.gender){
          delete body.first_name;
          delete body.last_name;
          delete body.birth_date;
          delete body.gender;
        }
        if(Object.keys(body).length == 0){
          this.closePopup();
          return;
        }
      }
    }
    
    this.hrmService.addUpdateEmployee(body, this.profile?.emp_no).subscribe(
      (result)=>{
        console.log("Success");
        alert("Employee Changes Successful");
        this.getEmployees(this.currentPage);
        this.closePopup();
      },(error) => {
        console.log("Failure");
      }
    )
    console.log(this.profileForm.value);
  }

  changeBirthDate(birth_date : any){
    this.birth_date = birth_date;
  }

  openEditEmployeeForm(emp_no: any) {
    this.getEmployeeProfile(emp_no);
    this.openPopup(true);
  } 

  viewEmployeeDetails(emp_no: any){
    this.showViewPopup = true;
    this.viewEmpNo = emp_no;
  }

  closeViewPopup(){
    this.showViewPopup = false;
    this.viewEmpNo = null;
  }



}
