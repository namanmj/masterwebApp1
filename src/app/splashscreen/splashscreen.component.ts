import { Component, OnInit } from '@angular/core';
import { constant } from '../configjson/constant';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
})
export class SplashscreenComponent implements OnInit {
  constant = constant
    constructor() { }
  
    ngOnInit() {
  this.constant = constant
  
    }
  
  }
  