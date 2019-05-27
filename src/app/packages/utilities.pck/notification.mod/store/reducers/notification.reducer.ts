// app
import * as NotificationActions from '../actions/notification.actions';
import { NotificationInterface } from '../../interfaces/notification.interface';
import { NotificationTypeEnum } from '../../enums/notification-type.enum';

// default state
const defaultState: NotificationInterface = {
	type: null,
	payload: {
		id: '',
		text: '',
		keepAfterNavigationChange: false
	}
};

// new state
const newState = (state, newData) => {
	return Object.assign({}, state, newData);
};

/**
 * reducer: notification
 *
 * @param {NotificationInterface} state
 * @param {All} action
 */
export function notificationReducer(state: NotificationInterface = defaultState, action: NotificationActions.All) {
	switch (action.type) {
		case NotificationActions.NOTIFICATION_INFO:
			return newState(state, {
				type: NotificationTypeEnum.INFO,
				payload: action.payload
			});
		case NotificationActions.NOTIFICATION_WARNING:
			return newState(state, {
				type: NotificationTypeEnum.WARNING,
				payload: action.payload
			});
		case NotificationActions.NOTIFICATION_ERROR:
			return newState(state, {
				type: NotificationTypeEnum.ERROR,
				payload: action.payload
			});
		case NotificationActions.NOTIFICATION_SUCCESS:
			return newState(state, {
				type: NotificationTypeEnum.SUCCESS,
				payload: action.payload
			});
		case NotificationActions.NOTIFICATION_CLOSE:
			return newState(state, {
				type: NotificationTypeEnum.CLOSE,
				payload: action.payload
			});
		case NotificationActions.NOTIFICATION_CLOSE_ALL:
			return newState(state, {
				type: NotificationTypeEnum.CLOSE_ALL
			});
		default:
			return state;
	}
}
