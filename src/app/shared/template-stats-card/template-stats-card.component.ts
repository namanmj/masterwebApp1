import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { cards_mapping } from '.././../configjson/cards_mapping'
import { constant } from '.././../configjson/constant'
import { Router } from '@angular/router';
import { NavigatorstackService } from 'src/app/navigatorstack.service';
import { UtilfuncService } from '../utilfunc.service';
import { feedview } from 'src/app/configjson/feedview';
import { cards_action } from 'src/app/configjson/card_action';

@Component({
  selector: 'app-template-stats-card',
  templateUrl: './template-stats-card.component.html',
  styleUrls: ['./template-stats-card.component.scss'],
})
export class TemplateStatsCardComponent implements OnInit {
  cards_mapping = cards_mapping
  constant = constant
  // @Output('actionscontroller') actionscontroller: EventEmitter<any> = new EventEmitter();
  @Input()
  data
  actionlist = []
  next_page_title: any;
  constructor(private router: Router, private navigatorstack: NavigatorstackService, public util: UtilfuncService) { }
  typeofcheck(value) {
    return typeof (value)
  }
  action() {
    if (!this.data['card_action_entity']) {
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
        var card=this.cards_mapping[this.data['entity']]['segue']
        if ((card && card['next_page_title'] && this.data[card['next_page_title']]) || card['title']) {
          this.next_page_title = this.data[card['next_page_title']] || card['title']
        } else { this.next_page_title = null }
        this.navigatorstack.navigate_pushup(
          {
            "title": this.next_page_title,
            "route": route,
            "constants": segue['constants'],
            "card_parameters": segue['card_parameters'],
            "user_parameters": segue['user_parameters'],
            "generic_view_id": segue['generic_view_id'],
            "view_identifier": segue['view_identifier'],
        "filter_entity":segue['filter_entity']|| [ ],

            "card_data": this.data,
            "url": endpoint
          }
        )
      }
    }
  }

  ngOnInit() {

  }
  getvalue(key) {
    return key
  }
  constantcheck(value) {
    if (value && value.indexOf('constant') >= 0) {
      var list = value.split(',')
      var str = ''
      list.forEach((element) => {
        if (element.indexOf('constant') >= 0) {
          var x = element.split('.')
          str = str + constant['app_constants'][x[1]]
        } else { str = str + (this.data[element] || ' ') }
      })
    }
    return str
  }

}