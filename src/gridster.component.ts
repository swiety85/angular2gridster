import { Component, OnInit, ElementRef, Inject, ViewChild, Input, SimpleChanges } from '@angular/core';

import { GridsterService, IGridsterOptions, IGridsterDraggableOptions } from './gridster.service';

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
  @Input('draggableOptions') draggableOptions: IGridsterDraggableOptions;
  @ViewChild('positionHighlight') $positionHighlight;

  gridster: GridsterService;
  $el: HTMLElement;

  constructor(@Inject(ElementRef) elementRef: ElementRef, gridster: GridsterService) {
    this.gridster = gridster;

    this.$el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.gridster.init(this.options,this.draggableOptions);
  }

  ngAfterViewInit() {
    this.gridster.start(this.$el);
    this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
  }

  /**
   * Change gridster config option and rebuild
   * @param {string} name
   * @param {any} value
   * @return {GridsterComponent}
   */
  setOption(name:string, value:any) {
    if(name === 'lanes') {
      this.gridster.options.lanes = value;
    }
    if(name === 'direction') {
      this.gridster.options.direction = value;
    }
    this.gridster.gridList.setOption(name, value);

    return this;
  }

  reload () {
    this.gridster.reflow();

    return this;
  }
}
