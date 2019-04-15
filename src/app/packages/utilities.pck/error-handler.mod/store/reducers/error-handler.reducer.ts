// app
import * as ErrorHandlerActions from '../actions/error-handler.actions';
import { ErrorHandlerInterface } from '../../interfaces/error-handler.interface';
import { ErrorHandlerTypeEnum } from '../../enums/error-handler-type.enum';

// default state
const defaultState: ErrorHandlerInterface = {
	type: null,
	payload: null
};

// new state
const newState = (state, newData) => {
	return Object.assign({}, state, newData);
};

/**
 * reducer: error handler
 *
 * @param {ErrorHandlerInterface} state
 * @param {All} action
 * @returns {any}
 */
export function errorHandlerReducer(state: ErrorHandlerInterface = defaultState, action: ErrorHandlerActions.All) {
	switch (action.type) {
		case ErrorHandlerActions.ERROR_HANDLER_COMMON:
			return newState(state, {
				type: ErrorHandlerTypeEnum.COMMON_ERROR,
				payload: action.payload
			});
		case ErrorHandlerActions.ERROR_HANDLER_SYSTEM:
			return newState(state, {
				type: ErrorHandlerTypeEnum.SYSTEM_ERROR,
				payload: action.payload
			});
		default:
			return state;
	}
}
