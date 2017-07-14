import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'a2g-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() move: boolean;
  @Output() moveChange = new EventEmitter<boolean>();
  @Input() resize: boolean;
  @Output() resizeChange = new EventEmitter<boolean>();

  @Input() title: string;

  @Output() remove = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
