import { Component, OnInit } from '@angular/core';
import { constant } from '../configjson/constant';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
})
export class SplashscreenComponent implements OnInit {
  constant = constant
    constructor(public http: HttpService) { }
  
    ngOnInit() {
  this.constant = constant
  
    }
  
  }
  