// app
import { Action } from '@ngrx/store';

// actions
export const ERROR_HANDLER_COMMON = '[Error Handler] Common';
export const ERROR_HANDLER_SYSTEM = '[Error Handler] System';

// action: error handler common
export class ErrorHandlerCommon implements Action {
	readonly type = ERROR_HANDLER_COMMON;

	constructor(public payload: any) {
	}
}

// action: error handler system
export class ErrorHandlerSystem implements Action {
	readonly type = ERROR_HANDLER_SYSTEM;

	constructor(public payload: any) {
	}
}

// export all
export type All =
	ErrorHandlerCommon |
	ErrorHandlerSystem;
