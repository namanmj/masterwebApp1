import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { tabbar, Tabbar } from '../configjson/tabbar';
import { FeedView } from '../configjson/feedview';
import { CardMapping } from '../configjson/cards_mapping';
import { Constants } from '../configjson/constant';
import { UtilfuncService } from '../shared/utilfunc.service';
import { MasterJson } from '../configjson/masterJson';
import { CardAction } from '../configjson/card_action';
import { DetailPage } from '../configjson/detailPage';
import { Filter } from '../configjson/filter';
@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.scss'],
})
export class LoginscreenComponent implements OnInit {
  source = interval(1000);
  username = ''
  email = ''
  name = ''
  loading = false
  signupscreen: boolean;
  otpscreen: boolean;
  loginscreen: boolean;
  password: any;
  errorstatus = false;
  errormsg: any;
  counters = 10;
  isbaseUrl = false;
  usernameString=''
  constructor(public http: HttpService, private router: Router, private utilfunc: UtilfuncService) { }
  signup() { }
  ngOnInit() {
    localStorage.clear()
    this.isbaseUrl = false
    var baseurl = window.location
    if (baseurl.href.includes('base_url')) { this.isbaseUrl = true }
    this.source.subscribe(val => {
      this.counters = this.counters - 1;
      if (this.counters < -10) { this.counters = -1 }
    });

    this.loading = false
    this.otpscreen = false
    this.loginscreen = true
    this.signupscreen = false

    if(this.http.isJayceeconnect){
      this.usernameString='SAP Code'
    }else{this.usernameString='User ID'}

  }
  getdivisor(number) {
    return ~~(number / 60)
  }
  otppress(event, num) {
    // if (event.target.value.length != 0) { event.target.value = null }
    // if (num != 6) {
    //   document.getElementById('otp-' + (num + 1)).focus()

    // }
  }
  getminus() {
    var x = this.counters % 60
    if (x < 10) {
      return '0' + x

    } else {
      return x
    }

  }
  get_otp() {
    if (this.username.length < 2) {
      this.loading = false
      this.errorstatus = true
      this.errormsg = 'Enter Valid Mobile Number'

      setTimeout(() => {
        this.errorstatus = false
        this.errormsg = ' '

      }, 2000);
      return
    }
    if (this.username != '' && typeof (this.username) != 'undefined') {
      this.loading = true
      this.http.get_otp(this.username).subscribe((value) => {
        this.loading = false
        this.hideallscreen()
        this.counterset()
        this.otpscreen = true
        this.errorstatus = true
        this.errormsg = value['msg'] || ''
        setTimeout(() => {
          this.errorstatus = false
          this.errormsg = value['msg'] || ' Something went wrong'
        }, 2000);
      }, (error) => {
        this.loading = false
        this.errorstatus = true
        this.errormsg = error['error'].msg
        setTimeout(() => {
          this.errorstatus = false
          this.errormsg = error['error'].msg || ' Something went wrong'
        }, 2000);


      })
    }
  }
  generateotp() {
    if (this.username.length < 2) {
      this.showError('Enter Valid SAP Code')
      return
    }
    if (this.username != '' && typeof (this.username) != 'undefined') {
      this.loading = true
      this.http.generatOtp(this.username).subscribe((value) => {
        this.http.baseurl = value['response']['central_data']['base_url'] + '/api/v1'
        localStorage.setItem('baseurl_to_login', value['response']['central_data']['base_url'] + '/api/v1')
        var a = Date()
        this.loading = false
        this.hideallscreen()
        this.otpscreen = true
      }, (error) => {
        this.showError(error['error']['msg'])
      })
    }
  }
  returnvalue(id) {
    return document.getElementById(id)['value']
  }
  showError(msg) {
    this.loading = false
    this.errorstatus = true
    this.errormsg = msg || ' Something went wrong'
    setTimeout(() => {
      this.errorstatus = false
      this.errormsg = ' '
    }, 2000);
  }
  directLogin() {
    if (this.username.length < 2) {
      this.showError('Enter Valid SAP Code')
      return
    }
    if (this.returnvalue('otp-1').length==0) {
      this.showError('Enter Password')
      return
    }
    if (this.username != '' && typeof (this.username) != 'undefined' && this.returnvalue('otp-1').length!=0) {
      var baseurl = window.location
      this.http.baseurl = `${decodeURIComponent(baseurl.href.substring(baseurl.href.indexOf('base_url') + 9))}` + '/api/v1'
      localStorage.setItem('baseurl_to_login', `${decodeURIComponent(baseurl.href.substring(baseurl.href.indexOf('base_url') + 9))}` + '/api/v1')
      this.verifyotp()
    }
  }
  verifyotp() {
    this.password = this.returnvalue('otp-1')
    let obj = {
      "username": this.username,
      "password": this.password,
      "os": "ANDROID"
    }
    this.loading = true
    this.http.varifyotp(obj).subscribe((value) => {
      this.loading = false
      var a = new Date()
      Tabbar.setup(value['response']['jsons']['tabbar.json']['tabbar'])
      localStorage.setItem('tabbar', JSON.stringify(value['response']['jsons']['tabbar.json']['tabbar']))

      Filter.setup(value['response']['jsons']['filters.json'])
      localStorage.setItem('filter', JSON.stringify(value['response']['jsons']['filters.json']))

      FeedView.setup(value['response']['jsons']['feedview.json'])
      localStorage.setItem('feedview', JSON.stringify(value['response']['jsons']['feedview.json']))
      CardMapping.setup(value['response']['jsons']['cards_mapping.json'])
      localStorage.setItem('cardmapping', JSON.stringify(value['response']['jsons']['cards_mapping.json']))
      Constants.setup(value['response']['jsons']['constants.json'])
      localStorage.setItem('constants', JSON.stringify(value['response']['jsons']['constants.json']))
      MasterJson.setup(value['response']['jsons']['masterJson.json'])
      localStorage.setItem('masterjson', JSON.stringify(value['response']['jsons']['masterJson.json']))
      CardAction.setup(value['response']['jsons']["card_actions.json"])
      localStorage.setItem('card_actions', JSON.stringify(value['response']['jsons']['card_actions.json']))
      DetailPage.setup(value['response']['jsons']["detail_page.json"])
      localStorage.setItem('detailPage', JSON.stringify(value['response']['jsons']['detail_page.json']))
      localStorage.setItem("user", JSON.stringify(value['response']))
      localStorage.setItem("webapptoken", value['response']['token'])
      localStorage.setItem("lastlogin", JSON.stringify(a));
      localStorage.setItem("webapptoken", value['response']['token'])
      this.router.navigateByUrl('/home')

    }, (error) => {
      this.errorstatus = true
      this.loading = false
      this.errormsg = error['error'].msg
      setTimeout(() => {
        this.errorstatus = false
        this.errormsg = error['error'].msg || ' Something went wrong'
      }, 2000);
    })
  }
  counterset() {
    this.counters = 60
  }

  hideallscreen() {
    this.otpscreen = false
    this.loginscreen = false
    this.signupscreen = false
  }
  resetscreen() {
    this.otpscreen = false
    this.loginscreen = true
    this.signupscreen = false
    this.resetdata()
  }
  resetdata() {
    this.name = ''
    this.email = ''
    this.username = ''
  }
}

