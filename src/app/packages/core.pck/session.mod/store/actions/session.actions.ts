// store
import { Action } from '@ngrx/store';

// actions
export const SESSION_COUNTER_START	= '[Session] Counter Start';
export const SESSION_COUNTER_RESET	= '[Session] Counter Reset';
export const SESSION_COUNTER_EXIT	= '[Session] Counter Exit';

// action: session counter start
export class SessionCounterStart implements Action {
	readonly type = SESSION_COUNTER_START;
	constructor(public payload: any) { }
}

// action: session counter reset
export class SessionCounterReset implements Action {
	readonly type = SESSION_COUNTER_RESET;
	constructor(public payload: any) { }
}

// action: session counter exit
export class SessionCounterExit implements Action {
	readonly type = SESSION_COUNTER_EXIT;
	constructor(public payload: any) { }
}

// export all
export type All =
	SessionCounterStart |
	SessionCounterReset |
	SessionCounterExit;
