import { Component, OnInit, ElementRef, Inject, ViewChild, Input } from '@angular/core';

import { GridsterService, IGridsterOptions } from './gridster.service';

@Component({
  selector: 'gridster',
  templateUrl: './gridster.component.html',
  styleUrls: ['./gridster.component.css'],
  providers: [
    GridsterService
  ]
})
export class GridsterComponent implements OnInit {
  @Input('options') options: IGridsterOptions;

  @ViewChild('positionHighlight') $positionHighlight;

  gridster: GridsterService;
  $el: HTMLElement;

  constructor(@Inject(ElementRef) elementRef: ElementRef, gridster: GridsterService) {
    this.gridster = gridster;

    this.$el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.gridster.init(this.options, {
        // handlerClass: 'panel-heading'
    });
  }

  ngAfterViewInit() {
    this.gridster.start(this.$el);
    this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
  }

}
