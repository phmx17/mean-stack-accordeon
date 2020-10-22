import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model"; // import interface

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};  // assign to type defined in interface
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {  //  create observable
        console.log(response);
      });
  }
}
