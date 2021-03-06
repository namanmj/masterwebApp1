import { Component, OnInit, Input } from '@angular/core';
import { feedview } from 'src/app/configjson/feedview';
import { Router } from '@angular/router';
import { NavigatorstackService } from 'src/app/navigatorstack.service';
import { UtilfuncService } from '../utilfunc.service';
import { cards_mapping } from 'src/app/configjson/cards_mapping';
import { constant } from 'src/app/configjson/constant';
import { cards_action } from 'src/app/configjson/card_action';

@Component({
  selector: 'app-template-common-card-content',
  templateUrl: './template-common-card-content.component.html',
  styleUrls: ['./template-common-card-content.component.scss'],
})
export class TemplateCommonCardContentComponent implements OnInit  {
  cards_mapping = cards_mapping
  constant = constant
  @Input()
  data
  constructor(private router: Router, private navigatorstack: NavigatorstackService, public util: UtilfuncService) { }
  action() {
    if(!this.data['card_action_entity']  || !cards_action[this.data['card_action_entitiy']]){
    if (this.cards_mapping[this.data['entity']]['segue']) {
      var segue = this.cards_mapping[this.data['entity']]['segue']
      var route = ''
      var endpoint = ''
      if (segue['view_identifier'] == 'WebViewController') {
        route = '/webview'
        endpoint = segue['url']
      } else if (segue['view_identifier'] == 'FeedViewController') {
        route = '/feedview'
        endpoint = segue['endpoint'] || feedview[segue['generic_view_id']]['endpoint'] || ''

      } else if (segue['view_identifier'] == 'GenericViewController') {
        route = '/genericview'
      }

      this.navigatorstack.navigate_pushup(
        {
          "title": "",
          "route": route,
          "constants": segue['constants'],
          "card_parameters": segue['card_parameters'],
        "filter_entity":segue['filter_entity']|| [ ],

          "user_parameters": segue['user_parameters'],
          "generic_view_id": segue['generic_view_id'],
          "view_identifier": segue['view_identifier'],
          "card_data": this.data,
          "url": endpoint
        }
      )
    }
  }}

  ngOnInit() {
  }
  getvalue(key) {
    return key
  }
  constantcheck(value){
    if(value && value.indexOf('constant')>=0){
      var list=value.split(',')
      var str=''
      list.forEach((element)=>{
        if(element.indexOf('constant')>=0){
          var x=element.split('.')
          str = str + (constant['app_constants'][x[1]] || ' ')
        }else{str=str+(this.data[element] || ' ')}
      })
    }
    return str
  }

}
