// angular
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

// store
import { Store } from '@ngrx/store';

// app
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { SessionsEnum } from '../enums/sessions.enum';
import { AppOptions } from '../../../../../app.config';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private authentication = new Subject();
	private authenticationExit;

	constructor(
		private _router: Router,
		private _authService: AuthService,
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
		if (session === SessionsEnum.SESSION_AUTHENTICATION) {
			this.handleAuthenticationSession(AppOptions.sessionTime.auth);
		}
	}

	/**
	 * reset sessions
	 *
	 * @param session
	 */
	private resetSessions(session: any) {
		if (session === SessionsEnum.SESSION_AUTHENTICATION) {
			this.authentication.next(void 0);
		}
	}

	/**
	 * exit sessions
	 */
	private exitSessions(session: any) {
		if (session === SessionsEnum.SESSION_AUTHENTICATION) {
			this.authenticationExit.unsubscribe();
		}
	}

	/**
	 * handle authentication session
	 *
	 * @param seconds
	 */
	private handleAuthenticationSession(seconds: number) {
		this.authenticationExit = this.authentication
			.pipe(
				startWith(''),
				switchMap(() => timer(seconds, seconds))
			)
			.subscribe(() => {
				// authenticate user
				this._authService.authValidation(this._router.url).then();
			});
	}
}
