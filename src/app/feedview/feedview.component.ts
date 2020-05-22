import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { constant } from '../configjson/constant';
import { feedview } from '../configjson/feedview';
import { cards_mapping } from '../configjson/cards_mapping';
import { NavigatorstackService } from '../navigatorstack.service';
import { Router } from '@angular/router';
import { cards_action } from '../configjson/card_action';
import { UtilfuncService } from '../shared/utilfunc.service';
import { detailPage } from '../configjson/detailPage';


@Component({
  selector: 'app-feedview',
  templateUrl: './feedview.component.html',
  styleUrls: ['./feedview.component.scss'],
})
export class FeedviewComponent implements OnInit {
  cards_mapping = cards_mapping
  constant = constant;
  data
  url: any;
  errorstatus
  route;
  public loading: boolean;
  sectionsstatus: boolean;
  sectionslist: any;
  sectionmap: {};
  sectionsmaplist: any[];
  feedview: {};
  actionlist: any[];
  localdata: any;
  errormsg: any;
  sectionsmaplisttitle: any[];
  constructor(public http: HttpService, private navigatorstack: NavigatorstackService, private router: Router, public util: UtilfuncService) { }
  back() {
    this.navigatorstack.navigate_popup()
  }

  showError(msg) {
    this.errorstatus = true
    this.loading = false
    this.errormsg = msg
    setTimeout(() => {
      this.errorstatus = false
      this.errormsg = ' '
    }, 2000);
  }
  showErrorAndBack(msg) {
    this.errorstatus = true
    this.loading = false
    this.errormsg = msg
    setTimeout(() => {
      this.errorstatus = false
      this.errormsg = ' '
      // this.navigatorstack.navigate_popup()
      this.ngOnInit()

    }, 2000);
  }
  cardaction(x) {
    document.getElementById('modalbtn').click()
    if (x['call']['internal_generic']) {
      this.actioncontroler(x['call']['internal_generic'], x)
    } else if (x['call']['api']) {
      this.actioncontrolerapi(x)
    }
  }
  backDropClicked() {
    document.getElementById('modalbtn').click()
  }

  actioncontrolerapi(passeddata) {
    var data = passeddata['call']['api']
    var url = data['endpoint']
    url = this.parameterhelper(this.localdata, url)
    var apiobj = {}
    if (passeddata['params'] && passeddata['params']['constants']) {
      passeddata['params']['constants'].forEach(obj => {
        url = url + `&${obj.lhs}=${obj['rhs']}`
        apiobj[obj['lhs']] = obj['rhs']
      })
    }
    if (passeddata['params'] && passeddata['params']['data']) {
      var user = JSON.parse(localStorage.getItem('user'))
      passeddata['params']['data'].forEach(obj => {
        if (this.localdata[obj['rhs']]) {
          url = url + `&${obj.lhs}=${this.localdata[obj['rhs']]}`
          apiobj[obj['lhs']] = this.localdata[obj['rhs']]

        } else if (user[obj['rhs']]) {
          url = url + `&${obj.lhs}=${user[obj['rhs']]}`
          apiobj[obj['lhs']] = user[obj['rhs']]

        }
      })
    }
    this.loading = true
    if (data['method'] == 'PATCH') {
      this.http.patchapi(url, apiobj).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })
    } else if (data['method'] == 'POST') {
      this.http.postapi(url, apiobj).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })

    } else if (data['method'] == 'GET') {
      this.http.getapi(url).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })
    }
  }
  action(data) {
    console.log(data)
    if (detailPage[data['entity']]) {
      this.localdata=data
      console.log('Detail Page found')
      this.actioncontroler({...data,'view_identifier':"CardDetailViewController"},data)
      return 
    }
    this.actionlist = []
    this.localdata = data
    if (data['card_action_entity'] && cards_action[data['card_action_entity']] && cards_action[data['card_action_entity']]['actions']) {
      Object.keys(cards_action[data['card_action_entity']]['actions']).forEach(action => {
        var actionobj = cards_action[data['card_action_entity']]['actions'][action]
        if (actionobj['internal_action']) {
          this.actionlist.push(actionobj)
        } else if (data['user_actions'] && (data['user_actions'].indexOf(action) >= 0)) {
          this.actionlist.push(actionobj)
        }
      })
      if (this.actionlist.length != 0) { document.getElementById('modalbtn').click() }
      return
    }
  }
  actioncontroler(data, x) {

    var segue = data
    var route = ''
    var endpoint = ''
    if (data['view_identifier'] == 'CardDetailViewController') {
      route = '/detailPage'
    }
    else if (segue['special_action'] == 'VIEW') {
      route = '/webview'
      endpoint = this.localdata[segue['special_action_input']] || segue['special_action_input']
    }
    else if (segue['view_identifier'] == 'WebViewController') {
      route = '/webview'
      endpoint = segue['url']
    } else if (segue['view_identifier'] == 'FeedViewController') {
      route = '/feedview'
      endpoint = segue['endpoint'] || feedview[segue['generic_view_id']]['endpoint'] || ''

    } else if (segue['view_identifier'] == 'GenericViewController') {
      route = '/genericview'
    } else if (segue['special_action'] && segue['special_action'] == 'DIAL') {
      document.location.href = ('tel://' + this.localdata[segue['special_action_input']])
      return
    } else if (segue['special_action'] && segue['special_action'] == 'SHARE') {
      this.showError('Share functionality not available.')
      return
    } else if (segue['special_action'] && segue['special_action'] == 'DOWNLOAD') {
      this.showError('Download functionality not available.')
      return
    }
    var temp = []
    if (x['params'] && x['params']['constants']) { temp = x['params']['constants'] }
    this.navigatorstack.navigate_pushup(
      {
        "title": "",
        "route": route,
        "constants": [...segue['constants'] || [], ...temp],
        "card_parameters": segue['card_parameters'],
        "user_parameters": segue['user_parameters'],
        "generic_view_id": segue['generic_view_id'],
        "view_identifier": segue['view_identifier'],
        "card_data": this.localdata,
        "url": endpoint,
        "params": (x['params'] && x['params']['data']) ? [...x['params']['data']] : [],
      }
    )
    // }
  }
  ngOnInit() {
    this.errorstatus = false
    this.loading = true
    var route = this.navigatorstack.returntop()
    this.feedview = feedview
    this.route = route
    if (typeof (route['url']) == 'undefined') {
      this.router.navigateByUrl('/home')
    }
    this.url = this.http.getcompleteurl(route['url'])
    if (this.url.indexOf('?') >= 0) { } else {
      this.url = this.url + '?'
    }
    this.url = this.parameterhelper(route, this.url)
    this.http.getapi(this.http.getcompleteurl(this.url)).subscribe((value) => {
      this.data = value['response']['data']

      for (var i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i]['specialhandingforwebapp_temp_skipthiscard']) {
          this.data.splice(i, 1);
        }
      }

      this.loading = false
      this.sectionsstatus = false
      if (this.route['generic_view_id'] && feedview[this.route['generic_view_id']] && feedview[this.route['generic_view_id']]['section_rules']) {
        this.sectionsstatus = true;
        this.sectionmap = {}
        this.sectionsmaplist = []
        this.data.forEach((element) => {
          if (this.sectionmap[element[feedview[this.route['generic_view_id']]['section_rules']['key']]]) {
            this.sectionmap[element[feedview[this.route['generic_view_id']]['section_rules']['key']]].push(element)

          } else {
            this.sectionsmaplist.push(element[feedview[this.route['generic_view_id']]['section_rules']['key']])
            this.sectionmap[element[feedview[this.route['generic_view_id']]['section_rules']['key']]] = []
            this.sectionmap[element[feedview[this.route['generic_view_id']]['section_rules']['key']]].push(element)


          }
        })
      }
      if (feedview[this.route['generic_view_id']] && feedview[this.route['generic_view_id']]['sections']) {
        this.sectionsstatus = true;
        this.sectionslist = feedview[this.route['generic_view_id']]['sections']
        this.sectionmap = {}
        this.sectionsmaplist = []
        this.sectionsmaplisttitle = []
        this.sectionslist.forEach((section) => {
          this.sectionmap[section['section_items']['filter_keys'][0]['rhs']] = []
          this.sectionsmaplist.push(section['section_items']['filter_keys'][0]['rhs'])
          this.sectionsmaplisttitle.push(section['section_header']['title'])
        })
        this.data.forEach((element) => {
          if (
            this.sectionmap[this.util.getvalue(element, this.sectionslist[0].section_items.filter_keys[0].lhs)]) {
            this.sectionmap[this.util.getvalue(element, this.sectionslist[0].section_items.filter_keys[0].lhs)].push(element)
          }
        })

      }
    }, (error) => {
      this.router.navigateByUrl('/home')
    }
    )
  }
  getattribute(obj) {
    if (this.route['generic_view_id'] && feedview[this.route['generic_view_id']] && feedview[this.route['generic_view_id']]['section_rules'] && obj[feedview[this.route['generic_view_id']]['section_rules']]) {
      return obj[feedview[this.route['generic_view_id']]['section_rules']['key']]
    } else
      return ' '
  }
  parameterhelper(route, url) {
    if (url.indexOf('?') >= 0) { } else {
      url = url + '?'
    }

    if (route['card_parameters'] && route['card_parameters'].length != 0) {
      route['card_parameters'].forEach(obj => {
        if (route['card_data'][obj['rhs']]) {
          url = url + `&${obj.lhs}=${route['card_data'][obj['rhs']]}`
        }
      })
    } if (route['user_parameters'] && route['user_parameters'].length != 0) {
      var user = JSON.parse(localStorage.getItem('user'))
      route['user_parameters'].forEach(obj => {
        if (user[obj['rhs']]) {
          url = url + `&${obj.lhs}=${user[obj['rhs']]}`
        }
      })
    } if (route['constant'] && route['constant'].length != 0) {
      route['constant'].forEach(obj => {
        url = url + `&${obj.lhs}=${obj['rhs']}`
      })
    }
    return url

  }
}
