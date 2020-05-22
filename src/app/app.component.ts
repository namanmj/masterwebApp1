import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Tabbar } from './configjson/tabbar';
import { FeedView } from './configjson/feedview';
import { CardMapping } from './configjson/cards_mapping';
import { Constants } from './configjson/constant';
import { MasterJson } from './configjson/masterJson';
import { CardAction } from './configjson/card_action';
import { Plugins } from '@capacitor/core';
import { AttrAst } from '@angular/compiler';
import { NavigatorstackService } from './navigatorstack.service';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { DetailPage } from './configjson/detailPage';
const { SplashScreen } = Plugins;
const { App } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public http: HttpService,
    public router: Router,
    private navigatorstack: NavigatorstackService
  ) {
    this.initializeApp();
  }
  ngOnInit() {
    var device = window.navigator.userAgent
    if (device.includes('IOS') || device.includes('Iphone') || device.includes('IPHONE') || device.includes('iPhone')) {
      this.http['iOS'] = true
    } else {
      this.http['iOS'] = false
    }
    var platforms = this.platform.platforms()

    if (platforms.indexOf('mobileweb') >= 0) {
      this.http['iOS'] = false
    }
    this.http['isUPIValid'] = false
    if (platforms.indexOf('android') >= 0 && platforms.indexOf('mobileweb') < 0) {
      this.http['isUPIValid'] = true
    }
    window.addEventListener('popstate', () => {
      if (this.navigatorstack.stack.length == 0 || (this.navigatorstack.stack.length == 1 && this.navigatorstack.stack[0]['route'] == "/home")) {
        // App.exitApp()
      } else {
        this.navigatorstack.navigate_popup()
      }
    })
    App.addListener('backButton', () => {
      if (this.navigatorstack.stack.length == 0 || (this.navigatorstack.stack.length == 1 && this.navigatorstack.stack[0]['route'] == "/home")) {
        App.exitApp()
      } else {
        this.navigatorstack.navigate_popup()
      }
    })
    var baseurl = new URLSearchParams(window.location.search)
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      SplashScreen.hide();
    });
    try {
      Tabbar.setup(JSON.parse(localStorage.getItem('tabbar')))
      FeedView.setup(JSON.parse(localStorage.getItem('feedview')))
      CardMapping.setup(JSON.parse(localStorage.getItem('cardmapping')))
      Constants.setup(JSON.parse(localStorage.getItem('constants')))
      MasterJson.setup(JSON.parse(localStorage.getItem('masterjson')))
      DetailPage.setup(JSON.parse(localStorage.getItem('detailPage')))
      CardAction.setup(JSON.parse(localStorage.getItem('card_actions')))
      var baseurl = window.location
      if (baseurl.href.includes('base_url')) {
        this.router.navigateByUrl(`/login?${baseurl.href.substring(baseurl.href.indexOf('base_url'))}`)
      } else {
        this.navigatorstack.navigate_popup()
      }
    }
    catch{ }
  }
}
