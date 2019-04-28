// store
import { Action } from '@ngrx/store';

// actions
export const SESSION_COUNTER_START	= '[Session] Counter Start';
export const SESSION_COUNTER_EXIT	= '[Session] Counter Exit';

// action: session counter start
export class SessionCounterStart implements Action {
	readonly type = SESSION_COUNTER_START;
}

// action: session counter exit
export class SessionCounterExit implements Action {
	readonly type = SESSION_COUNTER_EXIT;
}

// export all
export type All =
	SessionCounterStart |
	SessionCounterExit;
