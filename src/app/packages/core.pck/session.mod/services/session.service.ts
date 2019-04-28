// angular
import { Injectable } from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { AppOptions } from '../../../../../app.config';
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private sessionLockScreen;

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _store: Store<{ SessionInterface: SessionInterface, ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
		// subscribe: session
		this._store.select('session')
			.subscribe((res) => {
				if (res && res.type !== null) {
					switch (res.type) {
						case SessionTypeEnum.SESSION_COUNTER_START:
							this.handleSessions();
							break;
						case SessionTypeEnum.SESSION_COUNTER_EXIT:
							this.exitSessions();
							break;
					}
				}
			});
	}

	/**
	 * exit all sessions
	 */
	private exitSessions() {
		// lock screen
		this.sessionLockScreen.unsubscribe();
	}

	/**
	 * handle all sessions
	 */
	private handleSessions() {
		// handle lock screen session
		this.handleLockScreenSession(AppOptions.lockScreenSessionTime);
	}

	/**
	 * handle lock screen session
	 *
	 * @param seconds
	 */
	private handleLockScreenSession(seconds: number) {
		const sessionHandler = interval(seconds)
			.subscribe(() => {
				// authenticate user
				this._authService.authenticateUser()
					.subscribe(res => {
						if (!res.status || res.status === 'FAIL') {
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
							this.sessionLockScreen = sessionHandler;
							sessionHandler.unsubscribe();
						}
					});
			});
	}
}
