// angular
import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { SessionsEnum } from '../enums/sessions.enum';
import { AppOptions } from '../../../../../app.config';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private authentication = new Subject();
	private authenticationExit;
	private all;

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _store: Store<{ SessionInterface: SessionInterface, ErrorHandlerInterface: ErrorHandlerInterface }>
	) {
		// subscribe: session
		this._store.select('session')
			.subscribe((res) => {
				if (res && res.type !== null) {
					switch (res.type) {
						case SessionTypeEnum.SESSION_COUNTER_START:
							this.handleSessions(res.payload);
							break;
						case SessionTypeEnum.SESSION_COUNTER_RESET:
							this.resetSessions(res.payload);
							break;
						case SessionTypeEnum.SESSION_COUNTER_EXIT:
							this.exitSessions(res.payload);
							break;
					}
				}
			});
	}

	/**
	 * handle sessions
	 *
	 * @param session
	 */
	private handleSessions(session: any) {
		switch (session) {
			case SessionsEnum.SESSION_AUTHENTICATION:
				this.handleAuthenticationSession(AppOptions.sessionTime.auth);
				break;
			case SessionsEnum.SESSION_ALL:
				break;
			default:
		}
	}

	/**
	 * reset sessions
	 *
	 * @param session
	 */
	private resetSessions(session: any) {
		switch (session) {
			case SessionsEnum.SESSION_AUTHENTICATION:
				this.authentication.next(void 0);
				break;
			case SessionsEnum.SESSION_ALL:
				break;
			default:
		}
	}

	/**
	 * exit sessions
	 */
	private exitSessions(session: any) {
		switch (session) {
			case SessionsEnum.SESSION_AUTHENTICATION:
				this.authenticationExit.unsubscribe();
				break;
			case SessionsEnum.SESSION_ALL:
				if (this.all) {
					this.all.unsubscribe();
				}
				break;
			default:
		}
	}

	/**
	 * handle authentication session
	 *
	 * @param seconds
	 */
	private handleAuthenticationSession(seconds: number) {
		this.authenticationExit = this.authentication
			.pipe(switchMap(() => timer(seconds, seconds)))
			.subscribe(() => {
				// authenticate user
				this._authService.authenticateUser()
					.subscribe(res => {
						if (!res.status) {
							// get current user state
							const data = this._authService.currentUserState;
							const userInfo = HelperService.decodeJWTToken(res.idToken);

							// set current user state
							this._authService.currentUserState = {
								profile: {
									...userInfo,
									password: data.profile.password,
									language: data.profile.language,
									image: data.profile.image
								},
								credentials: res,
								rememberMe: data.rememberMe,
								timestamp: data.timestamp
							};
						}
					});
			});
	}
}
