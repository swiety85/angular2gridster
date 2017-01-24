import { Component, OnInit, ElementRef, Inject, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

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
  @Input() options: IGridsterOptions;
  @Output() gridsterPositionChange = new EventEmitter<any>();
  @Input() draggableOptions: IGridsterDraggableOptions;
  @ViewChild('positionHighlight') $positionHighlight;

  gridster: GridsterService;
  $el: HTMLElement;

  private cdr:ChangeDetectorRef;

  constructor(@Inject(ElementRef) elementRef: ElementRef, gridster: GridsterService, cdr: ChangeDetectorRef) {
    this.cdr = cdr;

    this.gridster = gridster;
    this.gridster.gridsterChange = this.gridsterPositionChange;
    this.$el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.gridster.init(this.options,this.draggableOptions);
  }

  ngAfterViewInit() {
    this.gridster.start(this.$el);
    this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
    this.cdr.detectChanges();
  }

  getMaxHeight () {
    var x = this.gridster.getMaxHeight();
    console.log('height', x);
    return x;
  }

  getMaxWidth () {
    console.log('width', this.gridster.getMaxWidth());
    return this.gridster.getMaxWidth();
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
