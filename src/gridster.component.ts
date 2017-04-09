import {
    Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild,
    Input, Output, EventEmitter, ChangeDetectorRef, HostListener, HostBinding
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';

import { GridsterService } from './gridster.service';
import {IGridsterOptions} from './IGridsterOptions';
import {IGridsterDraggableOptions} from './IGridsterDraggableOptions';
import {GridsterPrototypeService} from './gridster-prototype/gridster-prototype.service';
import {GridsterItemPrototypeDirective} from './gridster-prototype/gridster-item-prototype.directive';


@Component({
    selector: 'gridster',
    template: `<div class="gridster-container">
      <ng-content></ng-content>
      <div class="position-highlight" style="display:none;" #positionHighlight>
        <div class="inner"></div>
      </div>
    </div>`,
    styles: [`
    :host {
        position: relative;
        display: block;
        left: 0;
        width: 100%;
    }

    :host.gridster--dragging {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .gridster-container {
        position: relative;
        width: 100%;
        list-style: none;
        -webkit-transition: width 0.2s, height 0.2s;
        transition: width 0.2s, height 0.2s;
    }

    .position-highlight {
        display: block;
        position: absolute;
        z-index: 1;
    }
    `],
    providers: [ GridsterService ]
})
export class GridsterComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() options: IGridsterOptions;
    @Output() gridsterPositionChange = new EventEmitter<any>();
    @Output() resize = new EventEmitter<any>()
    @Input() draggableOptions: IGridsterDraggableOptions;
    @ViewChild('positionHighlight') $positionHighlight;

    @HostBinding('class.gridster--dragging') isDragging = false;
    @HostBinding('class.gridster--resizing') isResizing = false;

    gridster: GridsterService;
    $el: HTMLElement;

    private subscribtions: Array<Subscription> = [];

    constructor(
        elementRef: ElementRef, gridster: GridsterService,
        private cdr: ChangeDetectorRef,
        private gridsterPrototype: GridsterPrototypeService) {

        this.gridster = gridster;
        this.gridster.gridsterChange = this.gridsterPositionChange;
        this.$el = elementRef.nativeElement;
    }

    ngOnInit() {
        this.gridster.init(this.options, this.draggableOptions, this);

        const scrollSub = Observable.fromEvent(document, 'scroll')
            .subscribe(() => this.updateGridsterElementData());

        this.subscribtions.push(scrollSub);
    }

    ngAfterViewInit() {
        this.gridster.start(this.$el);

        this.updateGridsterElementData();

        this.connectGridsterPrototype();

        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
        // detectChanges is required because gridster.start changes values uses in template
        // this.cdr.detectChanges();
        this.cdr.detach();
    }

    ngOnDestroy() {
        this.subscribtions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    private updateGridsterElementData() {
        this.gridster.gridsterRect = this.$el.getBoundingClientRect();
        this.gridster.gridsterOffset = {
            left: this.$el.offsetLeft,
            top: this.$el.offsetTop
        };
    }

    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    private connectGridsterPrototype () {
        let isEntered = false;

        this.gridsterPrototype.observeDropOut(this.gridster)
            .subscribe();

        const dropOverObservable = this.gridsterPrototype.observeDropOver(this.gridster)
            .publish();

        this.gridsterPrototype.observeDragOver(this.gridster).dragOver
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                if (!isEntered) {
                    return ;
                }
                this.gridster.onDrag(prototype.item);
            });

        this.gridsterPrototype.observeDragOver(this.gridster).dragEnter
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                isEntered = true;

                this.gridster.items.push(prototype.item);
                this.gridster.onStart(prototype.item);
            });

        this.gridsterPrototype.observeDragOver(this.gridster).dragOut
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                if (!isEntered) {
                    return ;
                }
                this.gridster.onDragOut(prototype.item);
                isEntered = false;
            });

        dropOverObservable
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                if (!isEntered) {
                    return ;
                }
                this.gridster.onStop(prototype.item);

                const idx = this.gridster.items.indexOf(prototype.item);
                this.gridster.items.splice(idx, 1);

                isEntered = false;
            });

        dropOverObservable.connect();
    }

    /**
     * Change gridster config option and rebuild
     * @param {string} name
     * @param {any} value
     * @return {GridsterComponent}
     */
    setOption(name: string, value: any) {
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
