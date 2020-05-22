import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilfuncService {
  geticons(loc) {
    if (loc[0] == 'h' && loc[1] == 't' && loc[2] == 't' && loc[3] == 'p') {
      return loc
    } else { return `assets/icons/${loc}` }

  }
  getvalue(obj, prop, defval?) {
    if(!prop) return
    if (prop.split('.')[0] == 'constants') {
      var x = prop.substring(10, prop.length)
      prop = x
      if (typeof defval == 'undefined') defval = null;
      prop = prop.split('.');
      for (var i = 0; i < prop.length; i++) {
        if (typeof obj[prop[i]] == 'undefined')
          return defval;
        obj = obj[prop[i]];
      }
      return obj;
    } else {
      if (typeof defval == 'undefined') defval = null;
    
      prop = prop.split('.');
      for (var i = 0; i < prop.length; i++) {
        if (typeof obj[prop[i]] == 'undefined')
          return defval;
        obj = obj[prop[i]];
      }
      return obj;
    }

  }
  constructor() { }
}
