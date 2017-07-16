import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, AfterViewInit {

  data: any;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    //console.log(this.data);
    // console.log('ngAfterViewInit', this.elementRef.nativeElement);
  }
}
