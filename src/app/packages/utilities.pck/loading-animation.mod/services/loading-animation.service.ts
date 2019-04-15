// angular
import { Injectable } from '@angular/core';

// store
import { Store } from '@ngrx/store';

// app
import * as LoadingAnimationActions from '../store/actions/loading-animation.actions';
import { LoadingAnimationInterface } from '../interfaces/loading-animation.interface';

@Injectable()
export class LoadingAnimationService {
	constructor(private _store: Store<LoadingAnimationInterface>) {
	}

	/**
	 * start loading animation
	 */
	public startLoadingAnimation() {
		this._store.dispatch(new LoadingAnimationActions.LoadingAnimationStart()); // dispatch action: start loading animation
	}

	/**
	 * stop loading animation
	 */
	public stopLoadingAnimation() {
		this._store.dispatch(new LoadingAnimationActions.LoadingAnimationStop()); // dispatch action: close loading animation
	}
}
