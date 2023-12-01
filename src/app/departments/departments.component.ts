import { Component } from '@angular/core';
import { HrmService } from '../services/hrm.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {

  list: any = [];
  count = 0;
  pageCount = 0;
  iterator: any;
  showCondensedPagination= false;
  currentPage = 1;

  showPopup = false;

  managers : any;
  departmentInfo: any;


  departmentForm = new FormGroup({
    dept_name: new FormControl(''),
    manager_no: new FormControl(''),
  });

  selectedDept = null;


  constructor(public hrmService: HrmService){

  }

  ngOnInit(){
    this.getAllDepartments();
  }

  getAllDepartments(){
    this.hrmService.getDepartments().subscribe(
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

  getEmployees(pageNo: any){
      this.currentPage = pageNo;
      this.hrmService.getEmployees(pageNo).subscribe(
        (result: any) =>{
          this.managers = result?.result;
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

  openEditDepartmentForm(dept_no?: any) {
    this.showPopup = true;
    this.selectedDept = dept_no;
    if(!this.managers || this.managers.length == 0) {
      this.getEmployees(1);
    }
    this.getDepartment(dept_no);
  }

  closePopup() {
    this.showPopup = false;
    this.selectedDept = null;
    this.departmentInfo = null;
  }

  onSubmit() {
    console.log(this.departmentForm.value);
    this.addUpdateDepartment(this.departmentForm.value);
  }

  addUpdateDepartment(body: any){
    if(this.selectedDept){
      body['dept_no'] = this.selectedDept
      if(body['dept_name'] == this.departmentInfo?.dept_name) {
        delete body.dept_name;
      }

      if(this.departmentInfo.manager_no == body['manager_no']) {
        delete body.manager_no;
      }
      if(!body['dept_name'] && !body['manager_no']){
        this.closePopup();
        return;
      }
    }
    this.hrmService.addUpdateDepartment(body).subscribe(
      (res) =>{
        this.closePopup();
        alert("Department Changes Successful");
        this.getAllDepartments();

      },
      (err) =>{

      }
    )
  }

  getDepartment(dept_no: any){
    this.hrmService.getDepartment(dept_no).subscribe(
      (res: any) =>{
        let found = false;
        if(this.managers){
          for(const manager of this.managers){
            if(manager['emp_no'] == res[0].manager_no) {
              found = true;
            }
          }
          if(!found) {
            this.managers.push({emp_no: res[0].manager_no, first_name : res[0].manager.split(" ")[0],  last_name: res[0].manager.split(" ")[1] });
          }
        }
        this.departmentInfo = res[0];
        
        this.departmentForm.patchValue(res[0]);
      },
      (err) =>{

      }
    )
  }
  

}
