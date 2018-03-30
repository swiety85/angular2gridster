import { GridsterItemComponent } from '../gridster-item/gridster-item.component';
import { GridsterItemPrototypeDirective } from '../gridster-prototype/gridster-item-prototype.directive';
import { GridsterService } from '../gridster.service';

export class GridListItem {

    static BREAKPOINTS: Array<string> = ['sm', 'md', 'lg', 'xl'];
    static X_PROPERTY_MAP: any = {
        sm: 'xSm',
        md: 'xMd',
        lg: 'xLg',
        xl: 'xXl'
    };

    static Y_PROPERTY_MAP: any = {
        sm: 'ySm',
        md: 'yMd',
        lg: 'yLg',
        xl: 'yXl'
    };

    static W_PROPERTY_MAP: any = {
        sm: 'wSm',
        md: 'wMd',
        lg: 'wLg',
        xl: 'wXl'
    };

    static H_PROPERTY_MAP: any = {
        sm: 'hSm',
        md: 'hMd',
        lg: 'hLg',
        xl: 'hXl'
    };

    itemComponent: GridsterItemComponent;
    itemPrototype: GridsterItemPrototypeDirective;
    itemObject: any;
    currentBreakpoint: string;


    constructor (private gridsterService: GridsterService) {
        console.error('GridListItem constructor instant');
        this.gridsterService.breakpoint
            .subscribe({
                next: (next) => {if (next) {console.error('GridListItem constructor', next); this.currentBreakpoint = next}},
                error: (error) => {console.warn(error)}
            });
    }


    get $element () {
        return this.getItem().$element;
    }

    get x () {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        return this.getValueX(breakpoint);
    }
    set x (value: number) {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        this.setValueX(value, breakpoint);
    }

    get y () {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        return this.getValueY(breakpoint);
    }
    set y (value: number) {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        this.setValueY(value, breakpoint);
    }

    get w () {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : this.gridsterService.breakpoint.value;
        // console.log('breakpoint', breakpoint, 'get w:', this.getValueW(breakpoint));
        !breakpoint && console.log('get brekapoint from BehavoirSubject', this.gridsterService.breakpoint, this.gridsterService.breakpoint.value);
        // this.selectedTheme = this.personalizedService.themeStream.value;
        // !breakpoint && console.error('breakpoint', breakpoint, this.getValueW(breakpoint), 'item:', item);

        return this.getValueW(breakpoint);
    }
    set w (value: number) {
        console.warn('set w', value);
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        this.setValueW(value, breakpoint);
    }

    get h () {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : this.gridsterService.breakpoint.value;
        // console.log('breakpoint', breakpoint, 'get h:', this.getValueH(breakpoint));
        !breakpoint && console.log('get brekapoint from BehavoirSubject', this.gridsterService.breakpoint, this.gridsterService.breakpoint.value);

        return this.getValueH(breakpoint);
    }
    set h (value: number) {
        const item = this.getItem();
        const breakpoint = item.gridster ? item.gridster.options.breakpoint : null;

        this.setValueH(value, breakpoint);
    }

    get autoSize () {
        return this.getItem().autoSize;
    }
    set autoSize (value: boolean) {
        this.getItem().autoSize = value;
    }

    get dragAndDrop() {
        return !!this.getItem().dragAndDrop;
    }

    get resizable() {
        return !!this.getItem().resizable;
    }

    get positionX() {
        const item = this.itemComponent || this.itemPrototype;

        if (!item) {
            return null;
        }

        return item.positionX;
    }

    get positionY() {
        const item = this.itemComponent || this.itemPrototype;

        if (!item) {
            return null;
        }

        return item.positionY;
    }

    public setFromGridsterItem (item: GridsterItemComponent): GridListItem {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemComponent = item;
        return this;
    }

    public setFromGridsterItemPrototype (item: GridsterItemPrototypeDirective): GridListItem {
        console.error('setFromGridsterItemPrototype', item);
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemPrototype = item;
        return this;
    }

    public setFromObjectLiteral (item: Object): GridListItem {
        if (this.isItemSet()) {
            throw new Error('GridListItem is already set.');
        }
        this.itemObject = item;
        return this;
    }

    public copy() {
        const itemCopy = new GridListItem(this.gridsterService);

        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
        });
    }

    public copyForBreakpoint(_breakpoint?) {
        const breakpoint = _breakpoint || this.gridsterService.breakpoint.getValue();
        const itemCopy = new GridListItem(this.gridsterService);
        console.log('copyForBreakpoint breakpoint', breakpoint);

        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.getValueX(breakpoint),
            y: this.getValueY(breakpoint),
            w: this.getValueW(breakpoint),
            h: this.getValueH(breakpoint),
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable,
            aaa: 123
        });
    }

    public getValueX(breakpoint?) {
        const item = this.getItem();

        return item[this.getXProperty(breakpoint)];
    }

    public getValueY(breakpoint?) {
        const item = this.getItem();

        return item[this.getYProperty(breakpoint)];
    }

    public getValueW(breakpoint?, _item?) {
        const item = _item || this.getItem();
        _item && console.warn('getValueW', breakpoint, _item, 'wLg:', item.wLg, 'wXl:', item.wXl, 'return:', item[this.getWProperty(breakpoint)]);
        return item[this.getWProperty(breakpoint)];
    }

    public getValueH(breakpoint?, _item?) {
        const item = _item || this.getItem();
        _item && console.warn('getValueH', breakpoint, _item, 'hLg', item.hLg, 'hXl', item.hXl, 'return:', item[this.getHProperty(breakpoint)]);
        return item[this.getHProperty(breakpoint)];
    }

    public setValueX(value: number, breakpoint?) {
        const item = this.getItem();

        item[this.getXProperty(breakpoint)] = value;
    }

    public setValueY(value: number, breakpoint?) {
        const item = this.getItem();

        item[this.getYProperty(breakpoint)] = value;
    }

    public setValueW(value: number, breakpoint?) {
        const item = this.getItem();
        console.warn('setValueW breakpoint', breakpoint, this.gridsterService.breakpoint.getValue());
        item[this.getWProperty(breakpoint || this.gridsterService.breakpoint.getValue())] = value;
    }

    public setValueH(value: number, breakpoint?) {
        const item = this.getItem();
        console.warn('setValueH', breakpoint);
        item[this.getHProperty(breakpoint || this.gridsterService.breakpoint.getValue())] = value;
    }

    public triggerChangeX(breakpoint?) {
        const item = this.itemComponent;
        if (item) {
            item[this.getXProperty(breakpoint) + 'Change'].emit(this.getValueX(breakpoint));
        }
    }

    public triggerChangeY(breakpoint?) {
        const item = this.itemComponent;
        if (item) {
            item[this.getYProperty(breakpoint) + 'Change'].emit(this.getValueY(breakpoint));
        }
    }

    public triggerChangeW(breakpoint?) {
        const item = this.itemComponent;
        if (item) {
            item[this.getWProperty(breakpoint) + 'Change'].emit(this.getValueW(breakpoint));
        }
    }

    public triggerChangeH(breakpoint?) {
        const item = this.itemComponent;
        if (item) {
            item[this.getHProperty(breakpoint) + 'Change'].emit(this.getValueH(breakpoint));
        }
    }

    public hasPositions(breakpoint?) {
        const x = this.getValueX(breakpoint);
        const y = this.getValueY(breakpoint);

        return (x || x === 0) && (y || y === 0);
    }

    public applyPosition(gridster?: GridsterService) {
        const position = this.calculatePosition(gridster);

        this.itemComponent.positionX = position.left;
        this.itemComponent.positionY = position.top;
        this.itemComponent.updateElemenetPosition();
    }

    public calculatePosition(gridster?: GridsterService): {left: number, top: number} {
        if (!gridster && !this.itemComponent) {
            return {left: 0, top: 0};
        }
        gridster = gridster || this.itemComponent.gridster;

        return {
            left: this.x * gridster.cellWidth,
            top: this.y * gridster.cellHeight
        };
    }

    public applySize(gridster?: GridsterService): void {
        const size = this.calculateSize(gridster);

        this.$element.style.width = size.width + 'px';
        this.$element.style.height = size.height + 'px';
    }

    public calculateSize(gridster?: GridsterService): {width: number, height: number} {
        if (!gridster && !this.itemComponent) {
            return {width: 0, height: 0};
        }
        gridster = gridster || this.itemComponent.gridster;


        let width = this.w;
        let height = this.h;

        if (gridster.options.direction === 'vertical') {
            width = Math.min(this.w, gridster.options.lanes);
        }
        if (gridster.options.direction === 'horizontal') {
            height = Math.min(this.h, gridster.options.lanes);
        }

        return {
            width: width * gridster.cellWidth,
            height: height * gridster.cellHeight
        };
    }

    private getXProperty(breakpoint?: string) {

        if (breakpoint && this.itemComponent) {
            return GridListItem.X_PROPERTY_MAP[breakpoint];
        } else {
            return 'x';
        }
    }

    private getYProperty(breakpoint?: string) {

        if (breakpoint && this.itemComponent) {
            return GridListItem.Y_PROPERTY_MAP[breakpoint];
        } else {
            return 'y';
        }
    }

    private getWProperty(breakpoint?: string) {
        console.log('getWProperty', breakpoint, 'currentBreakpoint', this.currentBreakpoint, 'behaviourSubject', this.gridsterService.breakpoint.getValue());
        (this.itemComponent || this.itemPrototype) && console.warn('this.itemComponent', this.itemComponent, ' this.itemPrototype',  this.itemPrototype);

        if (breakpoint && (this.itemComponent || this.itemPrototype)) {
            console.log('getWProperty return', GridListItem.W_PROPERTY_MAP[breakpoint]);
            return GridListItem.W_PROPERTY_MAP[breakpoint];
        } else {
            console.log('no breakpoint return w');
            return 'w';
        }
    }

    private getHProperty(breakpoint?: string) {

        if (breakpoint && (this.itemComponent || this.itemPrototype)) {
            console.log('getHProperty return', GridListItem.H_PROPERTY_MAP[breakpoint]);
            return GridListItem.H_PROPERTY_MAP[breakpoint];
        } else {
            console.log('no breakpoint return h');
            return 'h';
        }
    }

    private getItem(): any {
        // console.log('this.itemComponent', this.itemComponent);
        this.itemPrototype && console.log('this.itemPrototype', this.itemPrototype);
        // console.log('this.itemObject', this.itemObject);
        // console.log('===================================');
        const item = this.itemComponent || this.itemPrototype || this.itemObject;

        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    }

    private isItemSet() {
        return this.itemComponent || this.itemPrototype || this.itemObject;
    }
}
