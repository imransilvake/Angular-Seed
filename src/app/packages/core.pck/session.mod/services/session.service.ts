// angular
import { Injectable } from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../store/actions/session.actions';
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { AppOptions, SessionStorageItems } from '../../../../../app.config';
import { StorageTypeEnum } from '../../storage.mod/enums/storage-type.enum';
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { SessionPayloadInterface } from '../interfaces/session-payload.interface';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable()
export class SessionService {
	private sessionTimeout = new Subject();

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
							this.exitSessionTimeout();
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
			const currentUserState = this._storageService.get(SessionStorageItems.userState, StorageTypeEnum.SESSION);
			if (currentUserState) {
				// payload
				const payload: SessionPayloadInterface = {
					inactivityTime: AppOptions.lockScreenSessionTime
				};

				// dispatch action
				this._store.dispatch(new SessionActions.SessionCounterStart(payload));
			}
		}
	}

	/**
	 * handle session timeout
	 *
	 * @param {SessionPayloadInterface} payload
	 */
	public handleSessionTimeout(payload: SessionPayloadInterface) {
		const sessionTimeout = this.sessionTimeout
			.pipe(
				startWith(0),
				switchMap(() => interval(payload.inactivityTime))
			)
			.subscribe(() => {
				// authenticate user
				if (!this._authService.authenticateUser()) {
					// start loading animation
					this._loadingAnimationService.startLoadingAnimation();

					// payload
					const payload: ErrorHandlerPayloadInterface = {
						title: this._i18n({
							value: 'Title: User Not Authorized Exception',
							id: 'Error_NotAuthorizedException_Title'
						}),
						message: this._i18n({
							value: 'Description: User Not Authorized Exception',
							id: 'Error_NotAuthorizedException_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					};

					// error dispatch
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));

					// unsubscribe sessionTimeout
					sessionTimeout.unsubscribe();
				}
			});
	}

	/**
	 * exit session timeout
	 */
	public exitSessionTimeout() {
		this.sessionTimeout.unsubscribe();
	}
}
