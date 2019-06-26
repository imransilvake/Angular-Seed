// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { timer } from 'rxjs';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private notification;

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
			case 'NOTIFICATION':
				if (this.notification) {
					this.notification.unsubscribe();
				}
				break;
			case 'ALL':
				if (this.notification) {
					this.notification.unsubscribe();
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
			case 'NOTIFICATION':
				break;
			case 'ALL':
				break;
			default:
		}
	}

	/**
	 * handle notification session
	 *
	 * @param seconds
	 */
	private handleNotificationSession(seconds: number) {
	}
}
