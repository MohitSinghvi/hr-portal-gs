import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HrmService } from './services/hrm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'hr-portal';
  token: any;
  emp_no: any;
  loaded = false;
  isAdmin = false;
  name : any;
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, public hrmService: HrmService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
    this.emp_no = localStorage.getItem("emp_no");
    this.name = localStorage.getItem("name");

    this.auth.idTokenClaims$.subscribe(
      (res)=>{
        if(res != null) {
          // this.auth.loginWithRedirect();
          this.token = res?.__raw;
          this.hrmService.setToken(this.token);
        }
       
        
      },
      (error)=>{
      }
    );

    if(!localStorage.getItem('emp_no')){
      this.auth.user$.subscribe(
        (res: any)=>{
          this.emp_no = res?.nickname;
          if(this.emp_no){
            localStorage.setItem('emp_no', this.emp_no);
            localStorage.setItem('name', res?.name);
          }
          this.loaded = true;
          this.hrmService.getEmployeeProfile(localStorage.getItem('emp_no')).subscribe(
            (res: any)=>{
              this.isAdmin = res[0]?.is_admin==1? true: false;
            },(err) =>{

            }
          )
        },
        (error)=>{
        }
      )      
    } else {
      this.loaded = true;
      this.hrmService.getEmployeeProfile(localStorage.getItem('emp_no')).subscribe(
        (res: any)=>{
          this.isAdmin = res[0]?.is_admin==1? true: false;
        },(err) =>{

        }
      )
    }
  }


  logout(){
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
    localStorage.removeItem("emp_no");
  }

}
