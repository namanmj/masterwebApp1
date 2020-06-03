import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { feedview } from 'src/app/configjson/feedview';
import { NavigatorstackService } from 'src/app/navigatorstack.service';
import { UtilfuncService } from '../utilfunc.service';
import { HttpService } from 'src/app/http.service';
@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss'],
})
export class TabbarComponent implements OnInit {
  feedview = feedview
  @Input()
  tabbar
  tabs: any;
  // tabs = this.tabbar['items']

  action(data) {
    var user = JSON.parse(localStorage.getItem('user'))
    if(data['view_identifier']== "UPIPayment"){
      this.router.navigateByUrl('/payment')
      return
    }
    if(data['type']=='api'){
      if(data['special_action']=='LOGOUT'){
        this.http.logout(data)
        return 
      }
      return
    }
    if (data['view_identifier'] == 'FeedViewController') {
      if (!(typeof (data['endpoint']) == 'undefined')) {
        this.navigatorstack.navigate_pushup({
          "title": data['title'] || '',
          "url": data['endpoint'] || '',
          "route": '/feedview',
          "card_parameters": data['card_parameters'],
          "user_parameters": data['user_parameters'],
          "filter_entity": data['filter_entity'],
          "constants": data['constants'],
          "view_identifier": "FeedViewController",
          "card_data": data
        })
      } else {
        this.navigatorstack.navigate_pushup({
          "url": feedview[data['generic_view_id']]['endpoint'] || '',
          "title": feedview[data['generic_view_id']]['title'] || '',
          "route": '/feedview',
          "card_parameters": feedview[data['generic_view_id']]['card_parameters'] || data['card_parameters'],
          "user_parameters": feedview[data['generic_view_id']]['user_parameters'] || data['user_parameters'],
          "constants": feedview[data['generic_view_id']]['constants'],
          "view_identifier": "FeedViewController",
          "filter_entity": data['filter_entity'],

          "generic_view_id":data['generic_view_id'],
          "card_data": data
        })


      }
    }
    if (data['view_identifier'] == 'GenericViewController') {
      // if(!(typeof(data['endpoint'])=='undefined'))

      this.navigatorstack.navigate_pushup({
        "title": data['title'] || '',
        "url": data['endpoint'] || '',
        "route": '/genericview',
        "card_parameters": data['card_parameters'],
        "user_parameters": data['user_parameters'],
        "constants": data['constants'],
        "view_identifier": "GenericViewController",
        "card_data": data
      })

    }
    if (data['view_identifier'] == 'WebViewController') {
      if (!(typeof (data['url']) == 'undefined')) {
        this.navigatorstack.navigate_pushup({
          "title": data['title'] || '',
          "url": data['url'] || '',
          "route": '/webview',
          "card_parameters": data['card_parameters'],
          "user_parameters": data['user_parameters'],
          "constants": data['constants'],
          "view_identifier": "WebViewController",
          "card_data": data
        })
      } else {
        this.navigatorstack.navigate_pushup({
          "url": this.feedview[data['generic_view_id']]['url'] || '',
          "title": this.feedview[data['generic_view_id']]['title'] || '',
          "route": '/webview',
          "card_parameters": this.feedview[data['generic_view_id']]['card_parameters'] || data['card_parameters'],
          "user_parameters": this.feedview[data['generic_view_id']]['user_parameters'] || data['user_parameters'],
          "constants": this.feedview[data['generic_view_id']]['constants'],
          "view_identifier": "WebViewController",
          "card_data": data
        })


      }
    }
  }
  constructor(private router: Router, private navigatorstack: NavigatorstackService, public util: UtilfuncService,public http:HttpService) { }

  ngOnInit() {
  this.tabs = this.tabbar['items']
  


  }


}
