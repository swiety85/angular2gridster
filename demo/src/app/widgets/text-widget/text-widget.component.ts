import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'a2g-text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
