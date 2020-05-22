import { Component, OnInit, Input } from '@angular/core';
import { cards_mapping } from 'src/app/configjson/cards_mapping';
import { Router } from '@angular/router';
import { UtilfuncService } from '../utilfunc.service';
import { HttpService } from 'src/app/http.service';
import { NavigatorstackService } from 'src/app/navigatorstack.service';
import { constant } from 'src/app/configjson/constant';

@Component({
  selector: 'app-template-section-item-history',
  templateUrl: './template-section-item-history.component.html',
  styleUrls: ['./template-section-item-history.component.scss'],
})
export class TemplateSectionItemHistoryComponent implements OnInit {
  cards_mapping: {};

  constructor(public router: Router, public util: UtilfuncService, public http: HttpService, public navigator: NavigatorstackService) { }
  @Input()
  data
  ngOnInit() {
    this.cards_mapping = cards_mapping
  }
  constantcheck(value) {
    if (value && value.indexOf('constant') >= 0) {
      var list = value.split(',')
      var str = ''
      list.forEach((element) => {
        if (element.indexOf('constant') >= 0) {
          var x = element.split('.')
          
          str = str + ((typeof(constant['app_constants'][x[1]])=='undefined')?constant['app_constants'][x[1]]:' ')
        } else { str = str + (this.util.getvalue(this.data, element) || ' ') }
      })
    }
    return str
  }
}
