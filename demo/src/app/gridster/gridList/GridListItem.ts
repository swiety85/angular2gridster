import {GridsterItemComponent} from '../gridster-item/gridster-item.component';
import {GridsterItemPrototypeDirective} from '../gridster-prototype/gridster-item-prototype.directive';

export class GridListItem {
    static X_PROPERTY_MAP = {
        sm: 'xSm',
        md: 'xMd',
        lg: 'xLg',
        xl: 'xXl'
    };

    static Y_PROPERTY_MAP = {
        sm: 'ySm',
        md: 'yMd',
        lg: 'yLg',
        xl: 'yXl'
    };

    itemComponent: GridsterItemComponent;
    itemPrototype: GridsterItemPrototypeDirective;
    itemObject: Object;

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
        const options = item.gridster ? item.gridster.options : null;

        if (options && options.direction === 'vertical') {
            return Math.min(item.w, options.lanes);
        } else {
            return item.w;
        }
    }
    set w (value: number) {
        this.getItem().w = value;
    }

    get h () {
        const item = this.getItem();
        const options = item.gridster ? item.gridster.options : null;

        if (options && options.direction === 'horizontal') {
            return Math.min(item.h, options.lanes);
        } else {
            return item.h;
        }
    }
    set h (value: number) {
        this.getItem().h = value;
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

    constructor () {}

    public setFromGridsterItem (item: GridsterItemComponent): GridListItem {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemComponent = item;
        return this;
    }

    public setFromGridsterItemPrototype (item: GridsterItemPrototypeDirective): GridListItem {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemPrototype = item;
        return this;
    }

    public setFromObjectLiteral (item: Object): GridListItem {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemObject = item;
        return this;
    }

    public copy (breakpoint?) {
        const itemCopy = new GridListItem();

        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.getValueX(breakpoint),
            y: this.getValueY(breakpoint),
            w: this.w,
            h: this.h,
            autoSize: this.autoSize,
            dragAndDrop: this.dragAndDrop,
            resizable: this.resizable
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

    public setValueX(value: number, breakpoint?) {
        const item = this.getItem();

        item[this.getXProperty(breakpoint)] = value;
    }

    public setValueY(value: number, breakpoint?) {
        const item = this.getItem();

        item[this.getYProperty(breakpoint)] = value;
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

    private getXProperty(breakpoint?: string) {

        if (breakpoint) {
            return GridListItem.X_PROPERTY_MAP[breakpoint];
        } else {
            return 'x';
        }
    }

    private getYProperty(breakpoint?: string) {

        if (breakpoint) {
            return GridListItem.Y_PROPERTY_MAP[breakpoint];
        } else {
            return 'y';
        }
    }

    private getItem(): any {
        const item = this.itemComponent || this.itemPrototype || this.itemObject;

        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    }
}
