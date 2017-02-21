import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    HostListener
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridsterService } from './gridster.service';
import {IGridsterOptions} from "./IGridsterOptions";
import {IGridsterDraggableOptions} from "./IGridsterDraggableOptions";
import {GridsterPrototypeService} from "./gridster-prototype/gridster-prototype.service";

@Component({
    selector: 'gridster',
    templateUrl: './gridster.component.html',
    styleUrls: ['./gridster.component.css'],
    providers: [
        GridsterService
    ]
})
export class GridsterComponent implements OnInit {
    @Input() options:IGridsterOptions;
    @Output() gridsterPositionChange = new EventEmitter<any>();
    @Input() draggableOptions:IGridsterDraggableOptions;
    @ViewChild('positionHighlight') $positionHighlight;

    gridster:GridsterService;
    $el:HTMLElement;

    private cdr:ChangeDetectorRef;

    constructor(elementRef:ElementRef, gridster:GridsterService, cdr:ChangeDetectorRef, private gridsterPrototype:GridsterPrototypeService) {
        this.cdr = cdr;

        this.gridster = gridster;
        this.gridster.gridsterChange = this.gridsterPositionChange;
        this.$el = elementRef.nativeElement;

        //this.gridster.dragOver = gridsterPrototype.dragObservable
        //    .filter((data) => {
        //      return this.isInsideRectangle(data.element);
        //    }).take(1);
        //
        //this.gridster.dragOver.subscribe((data: any) => {
        //  console.log('dragOver', data);
        //})
    }

    ngOnInit() {
        this.gridster.init(this.options, this.draggableOptions);
    }

    ngAfterViewInit() {
        this.gridster.start(this.$el);

        this.gridsterPrototype.observeDragOver(this.gridster)
            .subscribe((item) => {
                console.log('drag over');
            });

        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
        // detectChanges is required because gridster.start changes values uses in template
        this.cdr.detectChanges();
    }

    /**
     * Change gridster config option and rebuild
     * @param {string} name
     * @param {any} value
     * @return {GridsterComponent}
     */
    setOption(name:string, value:any) {
        if (name === 'lanes') {
            this.gridster.options.lanes = value;
        }
        if (name === 'direction') {
            this.gridster.options.direction = value;
        }
        this.gridster.gridList.setOption(name, value);

        return this;
    }

    reload() {
        this.gridster.reflow();

        return this;
    }
}
