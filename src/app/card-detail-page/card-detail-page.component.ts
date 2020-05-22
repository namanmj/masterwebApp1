import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorstackService } from '../navigatorstack.service';
import { UtilfuncService } from '../shared/utilfunc.service';
import { detailPage } from '../configjson/detailPage';
import { HttpService } from '../http.service';
import { constant } from '../configjson/constant';
import { cards_mapping } from '../configjson/cards_mapping';

@Component({
  selector: 'app-card-detail-page',
  templateUrl: './card-detail-page.component.html',
  styleUrls: ['./card-detail-page.component.scss'],
})
export class CardDetailPageComponent implements OnInit {
  detailPage: any;
  route: any
  errorstatus: boolean;
  loading: boolean;
  errormsg: any;
  data: any;
  sections: any;
  sectionskey: string[];
  card_mapping: {};
  back() {
    this.navigatorstack.navigate_popup()
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

  ngOnInit() {


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
    Object.keys(params).forEach((key) => {
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
      console.log(this.sections)
      this.sections.forEach((section, i) => {
        if (section['section_items']) {
          if (this.util.getvalue(this.data, section['section_items']['items_key'])) {
            this.detailPage[this.route['card_data']['entity']]['sections'][i]['data'] = this.util.getvalue(this.data, section['section_items']['items_key']).map((x) => {
              var obj = { ...x }
              console.log(section['section_items']['card_mapping_key'])
              obj['entity'] = section['section_items']['card_mapping_key']
              return obj
            })
          }
        } else if (section['section_api']) {
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
      })
      this.sections = this.detailPage[this.route['card_data']['entity']]['sections']
      console.log(this.sections)
    })
  }

  constantcheck(value) {
    if (value && value.indexOf('constant') >= 0) {
      var list = value.split(',')
      var str = ''
      list.forEach((element) => {
        if (element.indexOf('constant') >= 0) {
          var x = element.split('.')
          str = str + constant['app_constants'][x[1]]
        } else { str = str + (this.util.getvalue(this.data, element) || ' ') }
      })
    }
    return str
  }

}
