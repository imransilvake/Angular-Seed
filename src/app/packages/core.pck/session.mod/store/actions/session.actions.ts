// app
import { Action } from '@ngrx/store';

// actions
export const SESSION_COUNTER_START	= '[Session] Counter Start';
export const SESSION_COUNTER_RESET	= '[Session] Counter Reset';

// action: session counter start
export class SessionCounterStart implements Action {
	readonly type = SESSION_COUNTER_START;
	constructor(public payload: any) { }
}

// action: session counter reset
export class SessionCounterReset implements Action {
	readonly type = SESSION_COUNTER_RESET;
}

// export all
export type All =
	SessionCounterStart |
	SessionCounterReset;
