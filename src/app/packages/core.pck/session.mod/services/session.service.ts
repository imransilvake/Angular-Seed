// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { timer } from 'rxjs';

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
							this.handleSessions(res.payload);
							break;
						case SessionTypeEnum.SESSION_COUNTER_EXIT:
							this.exitSessions(res.payload);
							break;
					}
				}
			});
	}

	/**
	 * exit all sessions
	 */
	private exitSessions(session) {
		switch (session) {
			case 'LOCK_SCREEN':
				if (this.sessionLockScreen) {
					this.sessionLockScreen.unsubscribe();
				}
				break;
			case 'ALL':
				if (this.sessionLockScreen) {
					this.sessionLockScreen.unsubscribe();
				}
				break;
			default:
		}
	}

	/**
	 * handle all sessions
	 *
	 * @param session
	 */
	private handleSessions(session) {
		switch (session) {
			case 'LOCK_SCREEN':
				this.handleLockScreenSession(AppOptions.lockScreenSessionTime);
				break;
			default:
		}
	}

	/**
	 * handle lock screen session
	 *
	 * @param seconds
	 */
	private handleLockScreenSession(seconds: number) {
		const sessionHandler = this.sessionLockScreen = timer(0, seconds)
			.subscribe(() => {
				// authenticate user
				this._authService.authenticateUser()
					.subscribe(res => {
						if (!res.status || res.status === 'FAIL') {
							// common error
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
							this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));

							// unsubscribe session handler
							sessionHandler.unsubscribe();
						}
					});
			});
	}
}
