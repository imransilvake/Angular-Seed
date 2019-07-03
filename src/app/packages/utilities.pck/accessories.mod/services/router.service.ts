// angular
import { EventEmitter, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../../../core.pck/session.mod/store/actions/session.actions';
import { ROUTING } from '../../../../../environments/environment';
import { SessionService } from '../../../core.pck/session.mod/services/session.service';
import { SessionsEnum } from '../../../core.pck/session.mod/enums/sessions.enum';
import { SessionInterface } from '../../../core.pck/session.mod/interfaces/session.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RouterService {
	public routeChanged: EventEmitter<any> = new EventEmitter();
	private lastRoute;
	private currentUrl;
	private authRoutes = [
		`/${ ROUTING.authorization.register }`,
		`/${ ROUTING.authorization.login }`,
		`/${ ROUTING.authorization.reset }`,
		`/${ ROUTING.authorization.forgot }`
	];

	constructor(
		private _router: Router,
		private _sessionService: SessionService,
		private _store: Store<{ SessionInterface: SessionInterface }>,
		private _authService: AuthService
	) {
		this.currentUrl = this._router.url;
		this._router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				// broadcast change of route
				this.routeChanged.emit(event);

				// set previous url
				this.setPreviousUrl(event);

				// session: reset authentication
				if (_authService.currentUserState) {
					this._store.dispatch(new SessionActions.SessionCounterReset(SessionsEnum.SESSION_AUTHENTICATION));
				}
			});
	}

	/**
	 * get previous url
	 */
	get previousUrl() {
		return this.lastRoute;
	}

	/**
	 * set previous url
	 *
	 * @param event
	 */
	private setPreviousUrl(event) {
		this.lastRoute = this.authRoutes.includes(this.currentUrl) || this.currentUrl === '/' ? ROUTING.dashboard : this.currentUrl;
		this.currentUrl = event.url;
	}
}
