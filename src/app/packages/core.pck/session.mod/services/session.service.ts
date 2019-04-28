// angular
import { Injectable } from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../store/actions/session.actions';
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { AppOptions } from '../../../../../app.config';
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { SessionPayloadInterface } from '../interfaces/session-payload.interface';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private sessionTimeout;

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _store: Store<{ SessionInterface: SessionInterface, ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _loadingAnimationService: LoadingAnimationService,
		private _i18n: I18n
	) {
		// subscribe: session
		this._store.select('session')
			.subscribe((res) => {
				if (res && res.type !== null) {
					switch (res.type) {
						case SessionTypeEnum.SESSION_COUNTER_START:
							this.handleSessionTimeout(res.payload);
							break;
						case SessionTypeEnum.SESSION_COUNTER_EXIT:
							this.exitSession();
							break;
					}
				}
			});

		// start session
		this.startSession();
	}

	/**
	 * start session when user logs in
	 */
	public startSession() {
		if (this._authService.authenticateUser()) {
			// payload
			const payload: SessionPayloadInterface = {
				inactivityTime: AppOptions.lockScreenSessionTime
			};

			// dispatch action
			this._store.dispatch(new SessionActions.SessionCounterStart(payload));
		}
	}

	/**
	 * exit session timeout
	 */
	public exitSession() {
		this.sessionTimeout.unsubscribe();
	}

	/**
	 * handle session timeout
	 *
	 * @param payloadData
	 */
	public handleSessionTimeout(payloadData: SessionPayloadInterface) {
		// handle lock screen session
		this.handleLockScreenSession(payloadData.inactivityTime);
	}

	/**
	 * handle lock screen session
	 *
	 * @param seconds
	 */
	public handleLockScreenSession(seconds: number) {
		this.sessionTimeout = interval(seconds)
			.subscribe(() => {
				// authenticate user
				this._authService.authenticateUser()
					.subscribe(res => {
						if (!res.status || res.status === 'FAIL') {
							// start loading animation
							this._loadingAnimationService.startLoadingAnimation();

							// payload
							const payload = {
								title: this._i18n({
									value: 'Title: Session Timeout Exception',
									id: 'Error_SessionTimeoutException_Title'
								}),
								message: this._i18n({
									value: 'Description: Session Timeout Exception',
									id: 'Error_SessionTimeoutException_Description'
								}),
								buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
							};

							// error dispatch
							this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));

							// unsubscribe session handler
							this.sessionTimeout.unsubscribe();
						}
					});
			});
	}
}
