import { EventInterface } from "@sports-alliance/sports-lib/lib/events/event.interface";
import { StateContext } from "../Store";

export enum ActionType {
    ADD_TCX_EVENT = 'add_tcx_event',
    CLEAR_TCX = 'clear_tcx',
}

export type Action = { type: ActionType.ADD_TCX_EVENT, payload: EventInterface } | { type: ActionType.CLEAR_TCX };

const tcxReducer = (state: StateContext, action: Action) => {
    switch(action.type) {
        case ActionType.ADD_TCX_EVENT: {
            return ({
                ...state,
                tcxEvents: [...state.tcxEvents, action.payload].sort((tcx1, tcx2) => tcx1.startDate.getTime() - tcx2.startDate.getTime()),
            })
        }
        case ActionType.CLEAR_TCX: {
            return ({
                ...state,
                tcxEvents: [],
            })
        }
        default: throw new Error('Invalid action dispatched.')
    }
}

export default tcxReducer