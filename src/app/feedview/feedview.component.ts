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
import { filter } from '../configjson/filter';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver/dist/Filesaver';
@Component({
  selector: 'app-feedview',
  templateUrl: './feedview.component.html',
  styleUrls: ['./feedview.component.scss'],
})
export class FeedviewComponent implements OnInit {
  cards_mapping = cards_mapping
  constant = constant;
  data
 link;
 title;
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
  isFloaterAction = false;
  isFilter = false
  floaterActionList: any[];
  filter_entity: any;
  filter: any;
  filterToggle = false
  filterObj = {}
    dateTypeFilter=[];
  constructor(private htttp: HttpClient,public http: HttpService, private navigatorstack: NavigatorstackService, private router: Router, public util: UtilfuncService) {}
  back() {
      this.navigatorstack.navigate_popup()
  }
  applyFilter() {
      var route = this.navigatorstack.returntop()
      this.navigatorstack.navigate_popup()
      this.dateTypeFilter.forEach((key)=>{
          if(this.filterObj[key]){
        var temp = JSON.stringify(this.filterObj[key]).split('T')[0].substring(1)
        this.filterObj[key]  = temp || '';}
      })
      this.navigatorstack.navigate_pushup({
          ...route,
          'filter': this.filterObj
      })
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

  getOptions() {
    if(this.filter){
      this.filter.questions.forEach((question, index) => {
        if (question['type'] == 'CONCATENATEDYNAMICTAGS' && question['on_focus_func'] == 'api') {
            this.options(question, index)
        }
        if (question['type'] == 'DATE') {
            this.dateTypeFilter.push(question['attribute_name'])
        }

      })}
  }
  options(question, index) {
      if (question.options && !(question.url)) {
          return
      } else if (question.url) {
          this.filter.questions[index]['options'] = []
          var optionUrl = this.http.getcompleteurl(question.url)
          if (this.filter.questions[index]['params'] && this.filter.questions[index]['params']['user'] && this.filter.questions[index]['params']['user'].length != 0) {
              var user = JSON.parse(localStorage.getItem('user'))
              this.filter.questions[index]['params']['user'].forEach(obj => {
                  if (user[obj['rhs']]) {
                      optionUrl = optionUrl + `&${obj.lhs}=${user[obj['rhs']]}`
                  }
              })
          }
          if (this.filter.questions[index]['params'] && this.filter.questions[index]['params']['card'] && this.filter.questions[index]['params']['card'].length != 0) {
              var card = this.data['card_data']
              this.filter.questions[index]['params']['card'].forEach(obj => {
                  if (card[obj['rhs']]) {
                      optionUrl = optionUrl + `&${obj.lhs}=${card[obj['rhs']]}`
                  }
              })
          }
          this.http.getapi(optionUrl).subscribe((value) => {
              value['response']['data'].forEach(obj => {
                  this.filter.questions[index]['options'].push({
                      [this.filter.questions[index]['possible_values'][0]]: obj[this.filter.questions[index]['possible_values'][0]],
                      [this.filter.questions[index]['attribute_rhs']]: obj[this.filter.questions[index]['attribute_rhs']]
                  })
              })
          })
      }
  }

  cardaction(x) {
     console.log(x)
      
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
      this.title=data['title'];
      this.link=data['file_url'];
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
          if (this.actionlist.length != 0) {
              document.getElementById('modalbtn').click()
          }
          return
      }
      if (detailPage[data['entity']]) {
          this.localdata = data
          this.actioncontroler({
              ...data,
              'view_identifier': "CardDetailViewController"
          }, data)
          return
      }
  }
  download(){
      this.htttp.get(this.link, {responseType: 'arraybuffer'}).subscribe(pdf=>{
           var blob = new Blob([pdf], {type: 'application/pdf'});
           var filename=this.title+".pdf";
          saveAs(blob, filename);
  }, err => {
      console.log(err);
  });
      }
     
    
  actioncontroler(data, x) {

      var segue = data
      var route = ''
      var endpoint = ''
      if (data['view_identifier'] == 'CardDetailViewController') {
          route = '/detailPage'
          if (data['segue_entity']) {
              this.localdata['entity'] = data['segue_entity']
          }
      } else if (segue['special_action'] == 'VIEW') {
          route = '/webview'
          endpoint = this.localdata[segue['special_action_input']] || segue['special_action_input']
      } else if (segue['view_identifier'] == 'WebViewController') {
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
          this.download()
          return
      }
      var temp = []
      if (x['params'] && x['params']['constants']) {
          temp = x['params']['constants']
      }
      this.navigatorstack.navigate_pushup({
          "title": "",
          "route": route,
          "constants": [...segue['constants'] || [], ...temp],
          "card_parameters": segue['card_parameters'],
          "user_parameters": segue['user_parameters'],
          "generic_view_id": segue['generic_view_id'],
          "view_identifier": segue['view_identifier'],
          "filter_entity": segue['filter_entity'] || [],
          "card_data": this.localdata,
          "url": endpoint,
          "params": (x['params'] && x['params']['data']) ? [...x['params']['data']] : [],
      })
      // }
  }
  filters() {
      this.filter = filter[this.filter_entity]
      this.getOptions()
      this.filterToggle = true
  }
  ngOnInit() {
      this.filterToggle = false
      this.isFloaterAction = false
      this.isFilter = false
      this.errorstatus = false
      this.loading = true
      var route = this.navigatorstack.returntop()
      this.feedview = feedview
      this.route = route
      if (typeof(route['url']) == 'undefined') {
          this.router.navigateByUrl('/home')
      }
      this.url = this.http.getcompleteurl(route['url'])
      if (this.url.indexOf('?') >= 0) {} else {
          this.url = this.url + '?'
      }
      this.url = this.parameterhelper(route, this.url)
      this.url = this.http.getcompleteurl(this.url)
      if (route['filter']) {
          Object.keys(route['filter']).forEach((key) => {
              var temp = new URL(this.url)
              if (route['filter'][key]) {
                  temp.searchParams.set(key, route['filter'][key])
              }
              this.url = temp.toString()
          })
      }
      this.filterObj = route['filter'] || {}
      this.http.getapi(this.url).subscribe((value) => {
          this.isFloaterAction = false
          this.data = value['response']['data']
          for (var i = this.data.length - 1; i >= 0; i--) {
              if (this.data[i]['specialhandingforwebapp_temp_skipthiscard']) {
                  this.data.splice(i, 1);
              }
          }

          this.loading = false
          this.sectionsstatus = false
          var temp=null
          if(this.route&&this.route['filter_entity'] ){
            temp=this.route['filter_entity'] 
          }else if(feedview[this.route['generic_view_id']]&&feedview[this.route['generic_view_id']]['filter_entity']){
            temp=feedview[this.route['generic_view_id']]['filter_entity']
          }
          if (temp && temp.length!=0) {
              this.isFilter = true
              this.filter_entity = this.route['filter_entity'] || feedview[this.route['generic_view_id']]['filter_entity']

          }
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
          if (this.route['generic_view_id'] && feedview[this.route['generic_view_id']] && feedview[this.route['generic_view_id']]['actions']) {
              this.isFloaterAction = true
              document.getElementById('floater-action').style.display = "block"
              this.floaterActionList = []
              this.floaterAction(feedview[this.route['generic_view_id']]['actions'])

          }
      }, (error) => {
          this.router.navigateByUrl('/home')
      })

  }


  //  Floater Action Code begins
  floaterAction(actions) {
      if (actions) {

          Object.keys(actions).forEach(action => {
              var actionobj = actions[action]
              this.floaterActionList.push(actionobj)
          })
      }
  }
  floatercardaction(x) {
      if (x['call']['internal_generic']) {
          this.actioncontroller(x['call']['internal_generic'], this.data)
      } else if (x['call']['api']) {
          this.actioncontrollerapi(x)
      }
  }
  actioncontroller(data, x) {
      var segue = data
      var route = ''
      var endpoint = ''
      if (data['view_identifier'] == 'CardDetailViewController') {
          route = '/detailPage'
      } else if (segue['special_action'] == 'VIEW') {
          route = '/webview'
          endpoint = this.localdata[segue['special_action_input']] || segue['special_action_input']
      } else if (segue['view_identifier'] == 'WebViewController') {
          route = '/webview'
          endpoint = segue['url']
      } else if (segue['view_identifier'] == 'FeedViewController') {
          route = '/feedview'
          endpoint = segue['endpoint'] || feedview[segue['generic_view_id']]['endpoint'] || ''

      } else if (segue['view_identifier'] == 'GenericViewController') {
          route = '/genericview'
      } else if (segue['special_action'] && segue['special_action'] == 'DIAL') {
          document.location.href = ('tel://' + this.data[segue['special_action_input']])
          return
      } else if (segue['special_action'] && segue['special_action'] == 'SHARE') {
          this.showError('Share functionality not available.')
          return
      } else if (segue['special_action'] && segue['special_action'] == 'DOWNLOAD') {
          this.showError('Download functionality not available.')
          return
      }
      var temp = []
      if (x['params'] && x['params']['constants']) {
          temp = x['params']['constants']
      }
      this.navigatorstack.navigate_pushup({
          "title": "",
          "route": route,
          "constants": [...segue['constants'] || [], ...temp],
          "card_parameters": segue['card_parameters'],
          "user_parameters": segue['user_parameters'],
          "filter_entity": segue['filter_entity'] || [],

          "generic_view_id": segue['generic_view_id'],
          "view_identifier": segue['view_identifier'],
          "card_data": this.data,
          "url": endpoint,
          "params": (x['params'] && x['params']['data']) ? [...x['params']['data']] : [],
      })
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
  // Floater Action code ends here
  // Helper Util codes begins
  getattribute(obj) {
      if (this.route['generic_view_id'] && feedview[this.route['generic_view_id']] && feedview[this.route['generic_view_id']]['section_rules'] && obj[feedview[this.route['generic_view_id']]['section_rules']]) {
          return obj[feedview[this.route['generic_view_id']]['section_rules']['key']]
      } else
          return ' '
  }
  parameterhelper(route, url) {
      if (url.indexOf('?') >= 0) {} else {
          url = url + '?'
      }

      if (route['card_parameters'] && route['card_parameters'].length != 0) {
          route['card_parameters'].forEach(obj => {
              if (route['card_data'][obj['rhs']]) {
                  url = url + `&${obj.lhs}=${route['card_data'][obj['rhs']]}`
              }
          })
      }
      if (route['user_parameters'] && route['user_parameters'].length != 0) {
          var user = JSON.parse(localStorage.getItem('user'))
          route['user_parameters'].forEach(obj => {
              if (user[obj['rhs']]) {
                  url = url + `&${obj.lhs}=${user[obj['rhs']]}`
              }
          })
      }
      if (route['constant'] && route['constant'].length != 0) {
          route['constant'].forEach(obj => {
              url = url + `&${obj.lhs}=${obj['rhs']}`
          })
      }
      return url

  }
  toggleFilter() {
      this.filterToggle = !this.filterToggle
  }
}
