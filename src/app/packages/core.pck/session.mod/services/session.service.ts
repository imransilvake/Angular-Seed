// angular
import { Injectable } from '@angular/core';

// store
import { Store } from '@ngrx/store';

// app
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private notification;

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
}
