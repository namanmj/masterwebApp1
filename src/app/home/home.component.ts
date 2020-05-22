import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { cards_mapping } from '../configjson/cards_mapping'
import { tabbar } from '../configjson/tabbar'
import { constant } from '../configjson/constant'
import { UtilfuncService } from '../shared/utilfunc.service';
import { Router } from '@angular/router';
import { cards_action } from '../configjson/card_action';
import { feedview } from '../configjson/feedview';
import { NavigatorstackService } from '../navigatorstack.service';
import { window } from 'rxjs/operators';
import { detailPage } from '../configjson/detailPage';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  cards_mapping = cards_mapping
  constant = constant
  // tabbar = tabbar['items']
  tabbar = tabbar
  localdata
  data = []
  public loading: boolean;
  actionlist: any[];
  errorstatus: boolean;
  errormsg: any;
  user: any;
  constructor(public http: HttpService, public util: UtilfuncService, private router: Router, private navigatorstack: NavigatorstackService) { }
  // actionscontroller() {
  //   window.alert('parent component functio');
  // }

  showError(msg) {
    this.errorstatus = true
    this.loading = false
    this.errormsg = msg
    setTimeout(() => {
      this.errorstatus = false
      this.errormsg = ' '
    }, 2000);
  }
  cardaction(x) {
    document.getElementById('modalbtn').click()
    if (x['call']['internal_generic'] && x['call']['internal_generic']['view_identifier'] == 'CardDetailViewController') {
      this.showError('This functionality is not available now.')
      return
    } if (x['call']['internal_generic']) {
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
    } if (passeddata['params'] && passeddata['params']['data']) {
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
      }, (error) => {
        this.errorstatus = true
        this.loading = false
        this.errormsg = error['error'].msg
        setTimeout(() => {
          this.errorstatus = false
          this.errormsg = error['error'].msg || ' Something went wrong'
        }, 2000);
      })
    } else if (data['method'] == 'POST') {
      this.http.postapi(url, apiobj).subscribe((value) => {
        this.loading = false
      }, (error) => {
        this.errorstatus = true
        this.loading = false
        this.errormsg = error['error'].msg
        setTimeout(() => {
          this.errorstatus = false
          this.errormsg = error['error'].msg || ' Something went wrong'
        }, 2000);
      })

    } else if (data['method'] == 'GET') {
      this.http.getapi(url).subscribe((value) => {
        this.loading = false
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
    if (segue['view_identifier'] == 'WebViewController') {
      route = '/webview'
      endpoint = segue['url']
    } else if (segue['view_identifier'] == 'FeedViewController') {
      route = '/feedview'
      endpoint = segue['endpoint'] || feedview[segue['generic_view_id']]['endpoint'] || ''

    } else if (segue['view_identifier'] == 'GenericViewController') {
      route = '/genericview'
    } else if (segue['special_action'] && segue['special_action'] == 'DIAL') {
      document.location.href = ('tel:' + this.localdata[segue['special_action_input']])
      return
    } else if (segue['special_action'] && segue['special_action'] == 'SHARE') {
      this.errorstatus = true
      this.loading = false
      this.errormsg = 'Share functionality not available.'
      setTimeout(() => {
        this.errorstatus = false
      }, 2000);
      return
    } else if (segue['special_action'] && segue['special_action'] == 'DOWNLOAD') {
      this.errorstatus = true
      this.loading = false
      this.errormsg = 'Download functionality not available.'
      setTimeout(() => {
        this.errorstatus = false
      }, 2000);
      return
    }
    var title = ''
    if ((!segue['generic_view_id']) && segue['view_identifier'] == 'FeedViewController' && (segue['title'])) { title = segue['title'] }
    var temp = []
    if (x['params'] && x['params']['constants']) { temp = x['params']['constants'] }
    this.navigatorstack.navigate_pushup(
      {
        "title": title || ' ',
        "route": route,
        "constants": [...segue['constants'] || [], ...temp],
        "card_parameters": segue['card_parameters'],
        "user_parameters": segue['user_parameters'],
        "generic_view_id": segue['generic_view_id'],
        "view_identifier": segue['view_identifier'],
        "card_data": this.localdata,
        "url": endpoint, 
        "params":(x['params']&&x['params']['data'])?[...x['params']['data']]:[],
      }
    )
    // }
  }
  ngOnInit() {
    this.errorstatus = false
    this.user = JSON.parse(localStorage.getItem('user'))
    if (localStorage.getItem('constants')) { } else { this.router.navigateByUrl('/login') }
    this.loading = true
    this.http.getapi(constant['base_url'] + this.util.getvalue(constant, 'api.cards.get')).subscribe((value) => {
      this.data = this.util.getvalue(value, 'response.data')
      this.loading = false
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
  getshort(value) {
    return Number(value).toFixed(2)
  }
  parameterhelper(route, url) {
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
      var user = JSON.parse(localStorage.getItem('user'))
      route['constant'].forEach(obj => {
        url = url + `&${obj.lhs}=${obj['rhs']}`
      })
    }
    return url

  }
}

