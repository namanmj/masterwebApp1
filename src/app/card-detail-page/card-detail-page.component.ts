import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorstackService } from '../navigatorstack.service';
import { UtilfuncService } from '../shared/utilfunc.service';
import { detailPage } from '../configjson/detailPage';
import { HttpService } from '../http.service';
import { constant } from '../configjson/constant';
import { cards_mapping } from '../configjson/cards_mapping';
import { cards_action } from '../configjson/card_action';
import { feedview } from '../configjson/feedview';

@Component({
  selector: 'app-card-detail-page',
  templateUrl: './card-detail-page.component.html',
  styleUrls: ['./card-detail-page.component.scss'],
})
export class CardDetailPageComponent implements OnInit, AfterViewInit {
  detailPage: any;
  route: any
  errorstatus: boolean;
  loading: boolean;
  errormsg: any;
  data: any;
  sections: any;
  sectionskey: string[];
  card_mapping: {};
  isFloaterAction: boolean;
  localdata: any;
  actionlist = [];
  back() {
    this.navigatorstack.navigate_popup()
  }
  cardData(item) {
    return { ...this.data, 'entity': item['section_header']['card_mapping_key'] }
  }
  getStyle(x) {

    let obj = {}
    if (x['font_size']) {
      obj['font-size'] = x['font_size'] + 'px'
    } if (x['font_weight']) {
      obj['font-weight'] = x['font_weight']
    } if (x['text_color']) {
      obj['color'] = x['text_color']
    } if (x['font_family']) {
      obj['font-font_family'] = x['font_family']
    } if (x['margin']) {
      obj['margin'] = x['margin']
    } if (x['text_gravity']) {
      obj['text-align'] = x['text_gravity']
    }
    return obj

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
  constructor(public util: UtilfuncService, public http: HttpService, public router: Router, private navigatorstack: NavigatorstackService) { }
  ngAfterViewInit() {
    // this.floaterInit()
  }
  toggleIcon(id) {
    if (document.getElementById(id) && document.getElementById(id).style && document.getElementById(id).style.transform) {
      document.getElementById(id).style.transform = null

    } else {
      if (document.getElementById(id)) {
        document.getElementById(id).style.transform = 'scaleY(-1)'
      }

    }
  }
  floaterInit() {
    let widget = document.querySelector('.widget')
    let toggle = document.querySelector('.toggle')

    toggle.addEventListener('click', () => {
      widget.classList.toggle('active')
    })
  }
  ngOnInit() {
    this.isFloaterAction = false
    this.detailPage = '';
    this.route = ''
    this.errorstatus = null;
    this.loading = null
    this.errormsg = null
    this.data = null
    this.sections = null
    this.sectionskey = null
    this.card_mapping = null;
    this.card_mapping = cards_mapping
    this.loading = true
    this.detailPage = detailPage
    this.route = this.navigatorstack.returntop()
    var url = this.http.getcompleteurl(this.detailPage[this.route['card_data']['entity']]['endpoint'])
    var params = this.detailPage[this.route['card_data']['entity']]['params']
    if (this.detailPage[this.route['card_data']['entity']]['actions']) {
      this.isFloaterAction = true
      this.action(this.detailPage[this.route['card_data']['entity']]['actions'])
    }
    Object.keys(params).forEach((key) => {
      if(url.indexOf('?')<0){url=`${url}?`}
      url = `${url}&${key}=${this.util.getvalue(this.route['card_data'], params[key])}`
    })
    var constantParam = this.detailPage[this.route['card_data']['entity']]['constant']
    if (constantParam) {
      Object.keys(constantParam).forEach((key) => {
        url = `${url}&${key}=${constantParam[key]}`
      })
    }
    this.http.getapi(url).subscribe((value) => {
      this.data = value['response']['data'][0]
      this.loading = false
      this.sections = this.detailPage[this.route['card_data']['entity']]['sections']
      this.sections.forEach((section, i) => {
        this.detailPage[this.route['card_data']['entity']]['sections'][i]['data'] = null
        if (section['section_items']) {
          if (this.util.getvalue(this.data, section['section_items']['items_key'])) {
            this.detailPage[this.route['card_data']['entity']]['sections'][i]['data'] = this.util.getvalue(this.data, section['section_items']['items_key']).map((x) => {
              var obj = { ...x }
              obj['entity'] = section['section_items']['card_mapping_key']
              return obj
            })
          } else if (!section['section_api']) {
            this.detailPage[this.route['card_data']['entity']]['sections'][i]['data'] = [{ ...this.data, 'entity': section['section_items']['card_mapping_key'] }]
          }
        } else if (section['section_api']) {
        }
      })
      this.sections = this.detailPage[this.route['card_data']['entity']]['sections']
    })
  }
  getData(section, i) {
    if (section['section_api'] && !this.detailPage[this.route['card_data']['entity']]['sections'][i]['data']) {
      var url = this.http.getcompleteurl(section['section_api']['url'])
      if (section['section_api']['card_parameters']) {
        section['section_api']['card_parameters'].forEach(obj => {
          url = `${url}&${obj['lhs']}=${this.util.getvalue(this.route['card_data'], obj['rhs'])}`
        })
      }
      this.http.getapi(url).subscribe((res) => {
        var data = res['response']['data']
        this.detailPage[this.route['card_data']['entity']]['sections'][i]['data'] = data
      })
    }
  }
  constantcheck(value) {
    if (value && value.indexOf('constant') >= 0) {
      var list = value.split(',')
      var str = ''
      list.forEach((element) => {
        if (element.indexOf('constant') >= 0) {
          var x = element.split('.')
          try {
            str = str + (this.util.getvalue(constant['app_constants'], x[1], ' ') || ' ')

          } catch{ }
        } else { str = str + (this.util.getvalue(this.data, element) || ' ') }
      })
    }
    return str
  }
  parameterhelper(data, url) {
    if (url.indexOf('?') >= 0) { } else {
      url = url + '?'
    }

    if (this.route['card_parameters'] && this.route['card_parameters'].length != 0) {
      this.route['card_parameters'].forEach(obj => {
        if (this.route['card_data'][obj['rhs']]) {
          url = url + `&${obj.lhs}=${this.route['card_data'][obj['rhs']]}`
        }
      })
    } if (this.route['user_parameters'] && this.route['user_parameters'].length != 0) {
      var user = JSON.parse(localStorage.getItem('user'))
      this.route['user_parameters'].forEach(obj => {
        if (user[obj['rhs']]) {
          url = url + `&${obj.lhs}=${user[obj['rhs']]}`
        }
      })
    } if (this.route['constant'] && this.route['constant'].length != 0) {
      this.route['constant'].forEach(obj => {
        url = url + `&${obj.lhs}=${obj['rhs']}`
      })
    }
    return url
   }
   
  actioncontrollerapi(passeddata) {
    var data = passeddata['call']['api']
    var url = data['endpoint']
    url = this.parameterhelper(this.data, url)
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
        if (this.data[obj['rhs']]) {
          url = url + `&${obj.lhs}=${this.data[obj['rhs']]}`
          apiobj[obj['lhs']] = this.data[obj['rhs']]

        } else if (user[obj['rhs']]) {
          url = url + `&${obj.lhs}=${user[obj['rhs']]}`
          apiobj[obj['lhs']] = user[obj['rhs']]

        }
      })
    }
    this.loading = true
    if (data['method'] == 'PATCH') {
      this.http.patchapi(this.http.getcompleteurl(url), apiobj).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })
    } else if (data['method'] == 'POST') {
      this.http.postapi(this.http.getcompleteurl(url), apiobj).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })

    } else if (data['method'] == 'GET') {
      this.http.getapi(this.http.getcompleteurl(url)).subscribe((value) => {
        this.loading = false
        this.showErrorAndBack(value['msg'])
      }, (error) => {
        this.showError(error['error'].msg || 'Something went wrong')
      })
    }
  }
  showErrorAndBack(msg) {
    this.errorstatus = true
    this.loading = false
    this.errormsg = msg
    setTimeout(() => {
      this.errorstatus = false
      this.errormsg = ' '
      this.ngOnInit()
    }, 2000);
  }
  action(actions) {
    if (actions) {
      Object.keys(actions).forEach(action => {
        var actionobj = actions[action]
        if (actionobj['internal_action']) {
          this.actionlist.push(actionobj)
        } else if (this.data && this.data['user_actions'] && (this.data['user_actions'].indexOf(action) >= 0)) {
          this.actionlist.push(actionobj)
        }
      })
    }
  }
  actioncontroller(data, x) {
    var segue = data
    var route = ''
    var endpoint = ''
    if (data['view_identifier'] == 'CardDetailViewController') {
      route = '/detailPage'
    }
    else if (segue['special_action'] == 'VIEW') {
      route = '/webview'
      endpoint = this.data[segue['special_action_input']] ||this.localdata[segue['special_action_input']] || segue['special_action_input']
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
        "card_data": this.data,
        "url": endpoint,
        "params": (x['params'] && x['params']['data']) ? [...x['params']['data']] : [],
      }
    )
  }
  cardaction(x) {
    if (x['call']['internal_generic']) {
      this.actioncontroller(x['call']['internal_generic'], this.data)
    } else if (x['call']['api']) {
      this.actioncontrollerapi(x)
    }
  }
}
