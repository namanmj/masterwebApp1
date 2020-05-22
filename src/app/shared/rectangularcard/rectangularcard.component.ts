import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rectangularcard',
  templateUrl: './rectangularcard.component.html',
  styleUrls: ['./rectangularcard.component.scss'],
})
export class RectangularcardComponent implements OnInit {
  @Input()
  data
    constructor() { }
  
    ngOnInit() {
    }
  
  }