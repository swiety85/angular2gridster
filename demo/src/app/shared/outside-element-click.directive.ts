import {Directive, HostListener, Output, EventEmitter, OnInit} from '@angular/core';

@Directive({
    selector: '[a2gOutsideElementClick]'
})
export class OutsideElementClickDirective implements OnInit {
    @Output() a2gOutsideElementClick: EventEmitter<any> = new EventEmitter();

    @HostListener('click', ['$event']) onClick(e: Event) {
        e.stopPropagation();
    }

    ngOnInit() {
        setTimeout(() => {
            document.addEventListener('click', e => this.a2gOutsideElementClick.emit(e));
        });
    }
}
