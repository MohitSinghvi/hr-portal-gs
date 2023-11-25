import { Component, Input, OnInit } from '@angular/core';
import { HrmService } from '../services/hrm.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  profile: any;
  titles: any;
  departments: any;
  compensations: any;
  
  @Input()
  emp_no: any;



  
  loadDepartment() {

    if(!this.departments){
      if(!this.emp_no){
        this.emp_no = localStorage.getItem('emp_no');;
      }
      this.hrmService.getEmpDepartment(this.emp_no).subscribe(
        (result: any)=>{
          this.departments = result?.body;
          console.log(result);
        },
        ()=>{
  
        }
      );
    }
  }
  loadCompensation() {
    if(!this.compensations){
      if(!this.emp_no){
        this.emp_no = localStorage.getItem('emp_no');;
      }
      this.hrmService.getSalary(this.emp_no).subscribe(
        (result: any)=>{
          this.compensations = result?.body;
          console.log(result);
        },
        ()=>{
  
        }
      );
    } 
  }

  loadTitle() {
    if(!this.titles){
      if(!this.emp_no){
        this.emp_no = localStorage.getItem('emp_no');;
      }
      this.hrmService.getTitles(this.emp_no).subscribe(
        (result: any)=>{
          this.titles = result?.body;
          console.log(result);
        },
        ()=>{
  
        }
      );
    }
  }

  constructor(public hrmService: HrmService){

  }

  loadProfile() {
    if(!this.profile){
      if(!this.emp_no){
        this.emp_no = localStorage.getItem('emp_no');;
      }
      this.hrmService.getEmployeeProfile(this.emp_no).subscribe(
        (result: any)=>{
          this.profile = result[0];
          console.log(result);
        },
        ()=>{
  
        }
      );
    }
  }


  ngOnInit(): void {
    this.loadProfile();
  }

}
