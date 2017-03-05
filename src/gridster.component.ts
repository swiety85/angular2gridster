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
import 'rxjs/add/operator/takeUntil';

import { GridsterService } from './gridster.service';
import {IGridsterOptions} from "./IGridsterOptions";
import {IGridsterDraggableOptions} from "./IGridsterDraggableOptions";
import {GridsterPrototypeService} from "./gridster-prototype/gridster-prototype.service";
import {GridsterItemPrototypeDirective} from './gridster-prototype/gridster-item-prototype.directive';

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
    }

    ngOnInit() {
        this.gridster.init(this.options, this.draggableOptions);
    }

    ngAfterViewInit() {
        this.gridster.start(this.$el);

        this.connectGridsterPrototype();

        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
        // detectChanges is required because gridster.start changes values uses in template
        this.cdr.detectChanges();
    }

    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    private connectGridsterPrototype () {

        this.gridsterPrototype.observeDropOut(this.gridster)
            .subscribe();

        const dropOverObservable = this.gridsterPrototype.observeDropOver(this.gridster)
            .publish();

        this.gridsterPrototype.observeDragOver(this.gridster).dragOver
            .subscribe((prototype: GridsterItemPrototypeDirective) => {

                this.gridster.onDrag(prototype.item);
            });

        this.gridsterPrototype.observeDragOver(this.gridster).dragEnter
            .subscribe((prototype: GridsterItemPrototypeDirective) => {

                this.gridster.items.push(prototype.item);
                this.gridster.onStart(prototype.item);
            });

        this.gridsterPrototype.observeDragOver(this.gridster).dragOut
            //.takeUntil(dropOverObservable)
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                this.gridster.onDragOut(prototype.item);
            });

        dropOverObservable
            .subscribe((prototype: GridsterItemPrototypeDirective) => {


                this.gridster.onStop(prototype.item);

                const idx = this.gridster.items.indexOf(prototype.item);
                this.gridster.items.splice(idx, 1);
            });

        dropOverObservable.connect();
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
