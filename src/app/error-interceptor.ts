import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
 
  constructor(private dialog: MatDialog) {};

  // intercept method; every outgoing http request will have this attached to it
  intercept(req: HttpRequest<any>, next: HttpHandler) {   // HttpRequest is of static type; intercept <any> outgoing requests
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {  // will catch any errors thrown by http
        let errorMessage = 'Unfortunately an unknown error occured';  // default custom message
        if (error.error.message) {
          errorMessage = error.error.message;
          this.dialog.open(ErrorComponent, {data: { message: errorMessage }});

        }
        return throwError(error);
      })
    );
  };
};