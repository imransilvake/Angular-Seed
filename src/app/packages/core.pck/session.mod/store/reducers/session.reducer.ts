// app
import * as SessionActions from '../actions/session.actions';
import { SessionInterface } from '../../interfaces/session.interface';
import { SessionTypeEnum } from '../../enums/session-type.enum';

// default state
const defaultState: SessionInterface = {
	type: null,
	payload: null
};

// new state
const newState = (state, newData) => {
	return Object.assign({}, state, newData);
};

/**
 * reducer: session
 *
 * @param {SessionInterface} state
 * @param {All} action
 */
export function sessionReducer(state: SessionInterface = defaultState, action: SessionActions.All) {
	switch (action.type) {
		case SessionActions.SESSION_COUNTER_START:
			return newState(state, {
				type: SessionTypeEnum.SESSION_COUNTER_START,
				payload: action.payload
			});
		case SessionActions.SESSION_COUNTER_EXIT:
			return newState(state, {
				type: SessionTypeEnum.SESSION_COUNTER_EXIT
			});
		default:
			return state;
	}
}
