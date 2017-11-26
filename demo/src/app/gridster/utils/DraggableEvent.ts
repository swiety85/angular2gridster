export class DraggableEvent {
    clientX: number;

    clientY: number;

    pageX: number;

    pageY: number;

    target: EventTarget;


    private touchEvent: TouchEvent;

    private mouseEvent: MouseEvent;

    constructor(event: any) {
        if (event.touches) {
            this.touchEvent = (<TouchEvent>event);
            this.setDataFromTouchEvent(this.touchEvent);
        } else {
            this.mouseEvent = (<MouseEvent>event);
            this.setDataFromMouseEvent(this.mouseEvent);
        }
    }

    isTouchEvent(): boolean {
        return !!this.touchEvent;
    }

    pauseEvent() {
        const event: Event = this.touchEvent || this.mouseEvent;

        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    }

    getRelativeCoordinates(container: HTMLElement): {x: number, y: number} {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

        const rect = container.getBoundingClientRect();

        return {
            x: this.pageX - rect.left - scrollLeft,
            y: this.pageY - rect.top - scrollTop,
        };
    }

    private setDataFromMouseEvent(event: MouseEvent): void {
        this.target = event.target;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.pageX = event.pageX;
        this.pageY = event.pageY;
    }

    private setDataFromTouchEvent(event: TouchEvent): void {
        this.target = event.target;
        this.clientX = event.touches[0].clientX;
        this.clientY = event.touches[0].clientY;
        this.pageX = event.touches[0].pageX;
        this.pageY = event.touches[0].pageY;

    }
}
