import {GridsterItemComponent} from '../gridster-item/gridster-item.component';
import {GridsterItemPrototypeDirective} from '../gridster-prototype/gridster-item-prototype.directive';

export class GridListItem {
    private itemComponent: GridsterItemComponent;
    private itemPrototype: GridsterItemPrototypeDirective;
    private itemObject: Object;

    get $element () {
        return this.getItem().$element;
    }

    get x () {
        return this.getItem().x;
    }
    set x (value: number) {
        this.getItem().x = value;
    }

    get y () {
        return this.getItem().y;
    }
    set y (value: number) {
        this.getItem().y = value;
    }

    get w () {
        return this.getItem().w;
    }
    set w (value: number) {
        this.getItem().w = value;
    }

    get h () {
        return this.getItem().h;
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

    public copy () {
        const itemCopy = new GridListItem();

        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            autoSize: this.autoSize
        });
    }

    private getItem(): any {
        const item = this.itemComponent || this.itemPrototype || this.itemObject;

        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    }
}
