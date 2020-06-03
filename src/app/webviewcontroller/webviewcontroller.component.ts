import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigatorstackService } from '../navigatorstack.service';
import { UtilfuncService } from '../shared/utilfunc.service';
import { constant } from '../configjson/constant';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-webviewcontroller',
  templateUrl: './webviewcontroller.component.html',
  styleUrls: ['./webviewcontroller.component.scss'],
})
export class WebviewComponent implements OnInit {
  url = ''
  safeurl;
  constant = constant
  routedata;
  route
  loading: boolean;
  constructor(private sanitizer: DomSanitizer, private navigatorstack: NavigatorstackService, private router: Router, public util: UtilfuncService,public http: HttpService) { }
  back() {
    this.navigatorstack.navigate_popup()
  }

  ngOnInit() {
    this.constant=constant
    this.loading = true
    var route = this.navigatorstack.returntop()
    this.route = route
    this.url = this.navigatorstack.returntop()['url']
    if(this.url.indexOf(',')>=0 &&this.url.indexOf('constants')>=0){
      var tempUrl=this.url.split(',')
      tempUrl.forEach((element,i)=>{
        if(element.indexOf('constants')>=0){
          tempUrl[i]=this.util.getvalue(this.constant['app_constants'],element.substring(10,element.length))
        }else{
                tempUrl[i] = `${route['card_data'][tempUrl[i]]}`
        }
      })
    this.url=tempUrl.join('')

    }
    if(this.url.indexOf('map.')>=0 && this.url.indexOf('google')>=0){
      this.url=this.url+'&output=embed'
    }
    if (route['card_data'][route['url']]) { this.url = route['card_data'][route['url']] }
    if (!this.url) { return this.router.navigateByUrl('/home') }
    if (this.url.indexOf('http') >= 0  || this.url.indexOf('google.n')>=0) {
      if(this.url.indexOf('google.n')>=0){
        this.url = 'http://maps.google.com/?q='+this.url.split('=')[1]+'&output=embed'
      }
     } else { this.url = (constant['base_url']).substring(0, (constant['base_url']).length - 7) + this.url }
    if (this.url.indexOf('?') >= 0) { } else { this.url = this.url + '?' }
    this.url = this.parameterhelper(route, this.url)
    console.log(this.url)
    this.safeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  togglesuccess() {
    this.loading = false
  }
  parameterhelper(route, url) {
   
    if (route['card_parameters'] && route['card_parameters'].length != 0) {
      route['card_parameters'].forEach(obj => {
        if (route['card_data'][obj['rhs']]) {
          url = url + `&${obj.lhs}=${route['card_data'][obj['rhs']]}`
        }
        // url = url + `&${obj.lhs}=${route['card_data'][obj['rhs']]}`
      })
    } if (route['user_parameters'] && route['user_parameters'].length != 0) {
      var user = JSON.parse(localStorage.getItem('user'))
      route['user_parameters'].forEach(obj => {
        if (user[obj['rhs']]) {

          url = url + `&${obj.lhs}=${user[obj['rhs']]}`
        }
      })
    } if (route['constant'] && route['constant'].length != 0) {
      var user = JSON.parse(localStorage.getItem('user'))
      route['constant'].forEach(obj => {
        url = url + `&${obj.lhs}=${obj['rhs']}`
      })
    }
    return url

  }

}
