import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    console.log('init');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.elementRef.nativeElement);
  }
}
