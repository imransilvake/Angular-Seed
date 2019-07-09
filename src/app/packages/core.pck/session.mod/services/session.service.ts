// angular
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import { StorageService } from '../../storage.mod/services/storage.service';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionTypeEnum } from '../enums/session-type.enum';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { SessionsEnum } from '../enums/sessions.enum';
import { AppOptions, AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';
import { ProxyService } from '../../proxy.mod/services/proxy.service';
import { SidebarService } from '../../../frame.pck/services/sidebar.service';
import { StorageTypeEnum } from '../../storage.mod/enums/storage-type.enum';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private authentication = new Subject();
	public notifications = new Subject();
	private authenticationExit;
	private notificationsExit;

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _sidebarService: SidebarService,
		private _proxyService: ProxyService,
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
			case SessionsEnum.SESSION_NOTIFICATIONS:
				this.handleNotificationsSession(AppOptions.sessionTime.notification);
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
			case SessionsEnum.SESSION_NOTIFICATIONS:
				this.notifications.next(void 0);
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
			case SessionsEnum.SESSION_NOTIFICATIONS:
				this.notificationsExit.unsubscribe();
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
			.pipe(
				startWith(''),
				switchMap(() => timer(seconds, seconds))
			)
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

	/**
	 * handle notifications session
	 *
	 * @param seconds
	 */
	private handleNotificationsSession(seconds: number) {
		this.notificationsExit = this.notifications
			.pipe(
				startWith(''),
				switchMap(() => timer(seconds, seconds))
			)
			.subscribe(() => {
				// app state
				const appState = this._sidebarService.appState;

				// last request time
				const storageType = this._authService.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
				const storageItemNotification = this._authService.currentUserState.rememberMe ? LocalStorageItems.notificationState : SessionStorageItems.notificationState;
				const lastRequestTime = this._storageService.get(storageItemNotification, storageType);

				// payload
				const payload = {
					pathParams: {
						groupId: appState.groupId,
						hotelId: appState.hotelId
					},
					queryParams: {
						date: lastRequestTime,
						user: this._authService.currentUserState.profile.email
					}
				};

				// service
				this._proxyService
					.getAPI(AppServices['Notifications']['Notifications_Status'], payload)
					.subscribe(res => {
						if (res) {
							// update total notifications
							this._authService.notificationLRT.emit(res.total);
						}
					});
			});
	}
}
