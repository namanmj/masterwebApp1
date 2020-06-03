import { Component, OnInit, Input } from '@angular/core';
import { constant } from 'src/app/configjson/constant';
import { Router } from '@angular/router';
import { NavigatorstackService } from 'src/app/navigatorstack.service';
import { UtilfuncService } from '../utilfunc.service';
import { HttpService } from 'src/app/http.service';
import { cards_mapping } from 'src/app/configjson/cards_mapping';

@Component({
  selector: 'app-template-expandable-header',
  templateUrl: './template-expandable-header.component.html',
  styleUrls: ['./template-expandable-header.component.scss'],
})
export class TemplateExpandableHeaderComponent implements OnInit {
  @Input()
  data
  cards_mapping

  constructor(public router: Router, private navigatorstack: NavigatorstackService, public util: UtilfuncService, public http: HttpService) { }

  ngOnInit() {
    this.cards_mapping= cards_mapping
  }
  toggleIcon(id){
    if(document.getElementById(id)&&document.getElementById(id).style&&document.getElementById(id).style.transform){
      document.getElementById(id).style.transform=null

    }else{
      document.getElementById(id).style.transform='scaleY(-1)'

    }
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
