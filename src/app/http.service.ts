import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { constant } from './configjson/constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
 
  baseurl = localStorage.getItem('baseurl_to_login') || ' '
  isJayceeconnect: boolean;

 constructor(public http: HttpClient, private router: Router) { }
 logout(data) {
   let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
   var option = {
     headers: headers
   }
   if (data['method'] == 'PATCH') {
     this.http.patch(data['endpoint'], {}, option).subscribe((value) => { this.router.navigateByUrl('/') })
     return
   }
   if (data['method'] == 'GET') {

     this.http.get(data['endpoint'], option).subscribe((value) => { this.router.navigateByUrl('/') })
     return
     return
   }
   if (data['method'] == 'POST') {
     let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
     var option = {
       headers: headers
     }
     this.http.post(data['endpoint'], option).subscribe((value) => { this.router.navigateByUrl('/') })

     return
   }
 }
 getcompleteurl(url) {
   if (url.substring(0, 4) == 'http') { return url } else { return constant['base_url'] + url }
 }

 generatOtp(username) {
   return this.http.patch('https://auth2.simplifii.com/users/authenticate', { "username": username})
 }
 get_otp(username) {
  return this.http.post(`${this.baseurl}/get_otp`, { "mobile": username })

}
 signup(obj) {
   return this.http.post(this.baseurl + '/cards', obj)

 }
 varifyotp(obj) {
   return this.http.post(this.baseurl + '/admin/authenticate', obj)

 }
 marklocation(obj) {
   let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
   var option = {
     headers: headers
   }
   return this.http.post(this.baseurl + '/cards', obj, option)

 }
 getip() {
   return this.http.get("https://api.ipify.org?format=json")
 }
 getiptoloc(ip) {
   return this.http.get("https://freegeoip.app/json/" + ip)
 }
 getapi(url) {
   let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
   var option = {
     headers: headers
   }
   return this.http.get(url, option)
 } postapi(url, obj) {
   let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
   var option = {
     headers: headers
   }
   return this.http.post(url, obj, option)
 } patchapi(url, obj) {
   let headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('webapptoken'))
   var option = {
     headers: headers
   }
   return this.http.patch(url, obj, option)
 }

}
