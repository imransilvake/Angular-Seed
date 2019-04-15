// app
import { Action } from '@ngrx/store';

// actions
export const LOADING_ANIMATION_START = '[Loading Animation] Start';
export const LOADING_ANIMATION_STOP = '[Loading Animation] Stop';

// action: loading animation start
export class LoadingAnimationStart implements Action {
	readonly type = LOADING_ANIMATION_START;
}

// action: loading animation stop
export class LoadingAnimationStop implements Action {
	readonly type = LOADING_ANIMATION_STOP;
}

// export all
export type All =
	LoadingAnimationStart |
	LoadingAnimationStop;
