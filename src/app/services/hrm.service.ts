import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HrmService {

  baseUrl = "http://localhost:8000/";
  token: any;

  requestOptions: any;


  constructor(public httpClient: HttpClient) {
    this.setHeaders();
  }

  setToken(token: any){
    if(token) {
      this.token = token;
      localStorage.setItem('token', this.token);

     
      this.setHeaders();
    } else {
      this.setHeaders();
    }
  }

  setHeaders(){
    const headers = new HttpHeaders();
    

      this.requestOptions = {
        headers: headers.append('token', localStorage.getItem('token') || '')
      };
    
  }

  getToken(token: any) {
    return this.token;
  } 



  getEmployees(pageNo?: any){
    this.setHeaders();
    let appendString = "";
    if(pageNo){
      appendString = '?pageNo='+ pageNo;
    }
    return this.httpClient.get(this.baseUrl+'employees' + appendString, this.requestOptions);
  }

  addUpdateEmployee(body: any, emp_no?: any){
    if(emp_no){
      body['emp_no'] = emp_no
    }
    return this.httpClient.post(this.baseUrl+'employee', body, this.requestOptions);
  }

  getDepartments(pageNo?: any){
    return this.httpClient.get(this.baseUrl+'departments', this.requestOptions);
  }

  getDepartment(dept_no?: any){
    let appendString = '';
    if(dept_no){
      appendString = dept_no;
    }
    return this.httpClient.get(this.baseUrl+'department/'+appendString, this.requestOptions);
  }

  addUpdateDepartment(body?: any){
    return this.httpClient.post(this.baseUrl+'department',body, this.requestOptions);
  }

  getEmployeeProfile(empNo?: any){
    return this.httpClient.get(this.baseUrl+'employee/'+empNo, this.requestOptions);
  }

  getEmpDepartment(empNo?: any){
    return this.httpClient.get(this.baseUrl+'employee/'+empNo+'/departments', this.requestOptions);
  }

  getSalary(empNo: any){
    return this.httpClient.get(this.baseUrl+'employee/'+empNo+'/salaries', this.requestOptions);
  }

  getTitles(empNo: any){
    return this.httpClient.get(this.baseUrl+'employee/'+empNo+'/titles', this.requestOptions);
  }
}
