import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigatorstackService  {
  stack=[
    {
      "title":"",
      "route":"/home",
      "card_parameters":[],
      "user_parameters":[],
      "constants":[],
      "view_identifier":"",
      "generic_view_id":"",
      "card_data":[]
    }
  ]
  navigate_popup(){
    if(this.stack.length==0){ 
      this.stack=[
        {
          "title":"",
          "route":"/home",
          "card_parameters":[],
          "user_parameters":[],
          "constants":[],
          "view_identifier":"",
          "generic_view_id":"",
          "card_data":[]
        }
      ]
    }
    var route=this.stack.pop()
    if(this.stack.length==0){ 
      this.stack=[
        {
          "title":"",
          "route":"/home",
          "card_parameters":[],
          "user_parameters":[],
          "constants":[],
          "view_identifier":"",
          "generic_view_id":"",
          "card_data":null
        }
      ]
    }
    route=this.returntop()
    this.redirectTo(route['route'])
  }
  navigate_pushup(route){
    this.stack.push(route)
    this.redirectTo(route['route'])
  }
  returntop(){
    return this.stack[this.stack.length-1]
  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
  constructor(private router: Router) { }
}
