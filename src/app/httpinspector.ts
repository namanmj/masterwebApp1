import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private route: Router) { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    {
      headers: request.headers.set("Authorization", "bearer " + localStorage.getItem('webapptoken'))
    }
    var updatedRequest
    if(localStorage.getItem('webapptoken')){
       updatedRequest = request.clone({
        headers: request.headers.set("Authorization", "bearer " + localStorage.getItem('webapptoken'))
      });
    }else{
       updatedRequest = request.clone({});
    }
    //logging the updated Parameters to browser's console
    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
          }
        },
        error => {
          if (error.status === 401) {
            /*window.alert('you have been logged out');*/
            if (error.error.msg === "Token invalid") {
              localStorage.clear();
              this.route.navigateByUrl('/login');

            }
          }
        }
      )
    );
  }
}