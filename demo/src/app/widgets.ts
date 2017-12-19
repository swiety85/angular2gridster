import { Action } from '@ngrx/store';

export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const RESET = 'RESET';

export function widgetsReducer(state: Array<any> = [], action: Action) {
    let widgets;

    switch (action.type) {
        case ADD_WIDGET:
            return [ ...state, action.payload ] ;

        case REMOVE_WIDGET:
            widgets = [ ...state ];
            widgets.splice(action.payload, 1);

            return widgets;

        case UPDATE_WIDGET:
            const index = state.indexOf(action.payload);
            widgets = [ ...state ];
            widgets.splice(index, 1, action.payload);

            return widgets;

        case RESET:
            return state = [ ...action.payload ];

        default:
            return state;
    }
}