import { EventInterface } from '@sports-alliance/sports-lib/lib/events/event.interface'
import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import tcxReducer, { Action } from './reducers/tcxReducer'

export interface StateContext {
    tcxEvents: EventInterface[];
}
export interface Store {
    state: StateContext;
    dispatch?: React.Dispatch<Action>;
}

const initialState: StateContext = {
    tcxEvents: [],
}

export const Context = createContext<Store>({state: initialState})

const StoreProvider = ({children}: {children: ReactNode}) => {
    const [state, dispatch] = useReducer(tcxReducer, initialState)

    return (
        <Context.Provider value={{state, dispatch}} children={children}/>
    )
}

export const useTcxContext = () => useContext(Context)

export default StoreProvider