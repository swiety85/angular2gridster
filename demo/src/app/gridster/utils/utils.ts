
export const utils = {
    setCssElementPosition: ($element: HTMLElement, position: {x: number, y: number}) => {
        $element.style.left = position.x + 'px';
        $element.style.top = position.y + 'px';
    },
    resetCSSElementPosition: ($element: HTMLElement) => {
        $element.style.left = '';
        $element.style.top = '';
    },
    setTransform: ($element: HTMLElement, position: {x: number, y: number}) => {
        const left = position.x;
        const top = position.y;

        // Replace unitless items with px
        const translate = `translate(${left}px,${top}px)`;

        $element.style['transform'] = translate;
        $element.style['WebkitTransform'] = translate;
        $element.style['MozTransform'] = translate;
        $element.style['msTransform'] = translate;
        $element.style['OTransform'] = translate;
    },
    resetTransform: ($element: HTMLElement) => {
        $element.style['transform'] = '';
        $element.style['WebkitTransform'] = '';
        $element.style['MozTransform'] = '';
        $element.style['msTransform'] = '';
        $element.style['OTransform'] = '';
    },
    clearSelection: function clearSelection() {
        if (document['selection']) {
            document['selection'].empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }
};