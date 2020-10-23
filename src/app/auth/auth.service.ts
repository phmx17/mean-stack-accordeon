import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { AuthData } from "./auth-data.model"; // import interface

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}   

  getToken() {    // getter since token is private
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};  // assign to type defined in interface
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {  //  create observable
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};  // assign to type defined in interface
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      })
  };
}
