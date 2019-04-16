// store
import { Action } from '@ngrx/store';

// app
import { NotificationPayloadInterface } from '../../interfaces/notification-payload.interface';

// actions
export const NOTIFICATION_INFO = '[Notification] Info';
export const NOTIFICATION_WARNING = '[Notification] Warning';
export const NOTIFICATION_ERROR = '[Notification] Error';
export const NOTIFICATION_SUCCESS = '[Notification] Success';
export const NOTIFICATION_CLOSE = '[Notification] Close';
export const NOTIFICATION_CLOSE_ALL = '[Notification] Close All';

// action: notification info
export class NotificationInfo implements Action {
	readonly type = NOTIFICATION_INFO;

	constructor(public payload: NotificationPayloadInterface) {
	}
}

// action: notification warning
export class NotificationWarning implements Action {
	readonly type = NOTIFICATION_WARNING;

	constructor(public payload: NotificationPayloadInterface) {
	}
}

// action: notification error
export class NotificationError implements Action {
	readonly type = NOTIFICATION_ERROR;

	constructor(public payload: NotificationPayloadInterface) {
	}
}

// action: notification success
export class NotificationSuccess implements Action {
	readonly type = NOTIFICATION_SUCCESS;

	constructor(public payload: NotificationPayloadInterface) {
	}
}

// action: notification close by Id
export class NotificationClose implements Action {
	readonly type = NOTIFICATION_CLOSE;

	constructor(public payload: NotificationPayloadInterface) {
	}
}

// action: notification close all
export class NotificationCloseAll implements Action {
	readonly type = NOTIFICATION_CLOSE_ALL;
}

// export all
export type All =
	NotificationInfo |
	NotificationWarning |
	NotificationError |
	NotificationSuccess |
	NotificationClose |
	NotificationCloseAll;
