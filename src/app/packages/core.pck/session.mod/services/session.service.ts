// angular
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { interval } from 'rxjs/internal/observable/interval';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../store/actions/session.actions';
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { AppServices, SessionStorageItems } from '../../../../../app.config';
import { AuthenticationService } from '../../authentication.mod/services/authentication.service';
import { StorageTypeEnum } from '../../storage.mod/enums/storage-type.enum';
import { StorageService } from '../../storage.mod/services/storage.service';
import { ProxyService } from '../../proxy.mod/services/proxy.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { SessionPayloadInterface } from '../interfaces/session-payload.interface';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';

@Injectable()
export class SessionService {
	public userInfo: EventEmitter<any> = new EventEmitter();
	private sessionTimeout = new Subject();

	constructor(
		private _authService: AuthenticationService,
		private _storageService: StorageService,
		private _proxyService: ProxyService,
		private _store: Store<{ SessionInterface: SessionInterface, ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _loadingAnimationService: LoadingAnimationService
	) {
		// subscribe: session
		this._store.select('session')
			.subscribe((res) => {
				if (res && res.type !== null) {
					switch (res.type) {
						case SessionTypeEnum.SESSION_COUNTER_START:
							this.handleSessionTimeout(res.payload);
							break;
						case SessionTypeEnum.SESSION_COUNTER_RESET:
							this.resetSessionTimeout();
							break;
					}
				}
			});

		// start session
		this.startSession();
	}

	/**
	 * start session
	 */
	public startSession() {
		// if user is logged in
		if (this._authService.isLoggedIn) {
			const userSessionInfo = this._storageService.get(SessionStorageItems.userSessionInfo, StorageTypeEnum.SESSION);
			if (!userSessionInfo) {
				// init session
				this.initSession();
			} else {
				if (userSessionInfo && userSessionInfo.data && userSessionInfo.data.sessionId) {
					// dispatch action: start session counter
					const payload: SessionPayloadInterface = {
						sessionId: userSessionInfo.data.sessionId,
						inactivityTime: userSessionInfo.data.maxInactiveSec
					};
					this._store.dispatch(new SessionActions.SessionCounterStart(payload));
				} else {
					// start loading animation
					this._loadingAnimationService.startLoadingAnimation();

					// dispatch action: system error
					const actionPayload: ErrorHandlerPayloadInterface = {
						title: 'bo.78100.ti.errorCounts',
						message: 'bo.providertypes.error.generic.exception',
						buttonTexts: ['bo.forms.agentlogin.close']
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(actionPayload));
				}
			}
		}
	}

	/**
	 * init session
	 */
	public initSession() {
		// call session service
		this.sessionService(this.getSessionId)
			.subscribe((userInfo) => {
				if (userInfo && userInfo.data && userInfo.data.sessionId) {
					// user info (emit & set)
					this.userInfo.emit(userInfo);
					this._storageService.put(SessionStorageItems.userSessionInfo, userInfo, StorageTypeEnum.SESSION);

					// dispatch action: start session counter
					const payload: SessionPayloadInterface = {
						sessionId: userInfo.data.sessionId,
						inactivityTime: userInfo.data.maxInactiveSec
					};
					this._store.dispatch(new SessionActions.SessionCounterStart(payload));
				} else {
					// start loading animation
					this._loadingAnimationService.startLoadingAnimation();

					// dispatch action: system error
					const actionPayload: ErrorHandlerPayloadInterface = {
						title: 'bo.78100.ti.errorCounts',
						message: 'bo.providertypes.error.generic.exception',
						buttonTexts: ['bo.forms.agentlogin.close']
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(actionPayload));
				}
			});
	}

	/**
	 * service: sessionService
	 *
	 * @param {string} sessionId
	 * @returns {Observable<any>}
	 */
	public sessionService(sessionId: string) {
		// service: sessionService
		const params = {'jsessionid': sessionId};
		return this._proxyService.getAPI(AppServices['sessionService'], params);
	}

	/**
	 * set session id
	 *
	 * @param {string} sessionId
	 */
	public setSessionId(sessionId: string) {
		this._storageService.put(SessionStorageItems.sessionId, sessionId, StorageTypeEnum.SESSION);
	}

	/**
	 * get session id
	 *
	 * @returns {any}
	 */
	public get getSessionId() {
		if (this._authService.isLoggedIn) {
			return this._storageService.get(SessionStorageItems.sessionId, StorageTypeEnum.SESSION);
		} else {
			return null;
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
				startWith(void 0),
				switchMap(() => interval(
					Number(payload.inactivityTime) * 1000)
				)
			)
			.subscribe(() => { // counter show here 0,1,2,3,4...
				// check session id
				if (this.getSessionId) {
					// call session service
					this.sessionService(this.getSessionId)
						.subscribe((res) => {
							if (!(res && res.data)) { // when no data comes
								// start loading animation
								this._loadingAnimationService.startLoadingAnimation();

								// dispatch action: system error
								const actionPayload: ErrorHandlerPayloadInterface = {
									title: 'bo.msg.ti.timeLogout',
									message: 'bo.msg.timeLogout',
									buttonTexts: ['bo.forms.agentlogin.close']
								};
								this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(actionPayload));

								// unsubscribe sessionTimeout
								sessionTimeout.unsubscribe();
							}
						});
				} else {
					// unsubscribe sessionTimeout
					sessionTimeout.unsubscribe();
				}
			});
	}

	/**
	 * reset session timeout
	 */
	public resetSessionTimeout() {
		this.sessionTimeout.next(void 0);
	}
}
