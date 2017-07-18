import {Directive, Input, OnInit, ViewContainerRef, Type, ComponentFactoryResolver} from '@angular/core';

@Directive({
    selector: '[a2gDynamicComponent]'
})
export class DynamicComponentDirective implements OnInit {

    @Input('a2gDynamicComponent') component: Type<any>;
    @Input() attributes: any;

    constructor(public viewContainerRef: ViewContainerRef,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {

        const componentFactory = this.componentFactoryResolver
            .resolveComponentFactory(this.component);

        const viewContainerRef = this.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);

        Object.getOwnPropertyNames(this.attributes || {})
            .forEach((property) => {
                (<any>componentRef.instance)[property] = this.attributes[property];
            });
    }

}
