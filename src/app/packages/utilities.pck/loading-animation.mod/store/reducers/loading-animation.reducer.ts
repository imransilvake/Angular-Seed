// app
import * as LoadingAnimationActions from '../actions/loading-animation.actions';
import { LoadingAnimationInterface } from '../../interfaces/loading-animation.interface';

// default state
const defaultState: LoadingAnimationInterface = undefined;

// new state
const newState = (state, newData) => {
	return Object.assign({}, state, newData);
};

/**
 * reducer: loading animation
 *
 * @param {LoadingAnimationInterface} state
 * @param {All} action
 * @returns {any}
 */
export function loadingAnimationReducer(state: LoadingAnimationInterface = defaultState, action: LoadingAnimationActions.All) {
	switch (action.type) {
		case LoadingAnimationActions.LOADING_ANIMATION_START:
			return newState(state, { status: true });
		case LoadingAnimationActions.LOADING_ANIMATION_STOP:
			return newState(state, { status: false });
		default:
			return state;
	}
}
