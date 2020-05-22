import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-squarecard',
  templateUrl: './squarecard.component.html',
  styleUrls: ['./squarecard.component.scss'],
})
export class SquarecardComponent implements OnInit{
  @Input()
  data
    constructor() { }
  valuevalid(data){
    if(data==null || typeof(data)=='undefined' || data==undefined){return false}else{return true}
  }
    ngOnInit() {
    }
  
  }