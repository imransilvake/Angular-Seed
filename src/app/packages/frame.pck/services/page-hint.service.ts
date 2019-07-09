// angular
import { Injectable } from '@angular/core';

// app
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../app.config';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';

@Injectable()
export class PageHintService {
	constructor(
		private _proxyService: ProxyService,
		private _authService: AuthService
	) {
	}

	/**
	 * fetch page hints state
	 *
	 * @param url
	 */
	public pageHintsFetch(url: string) {
		// payload
		const payload = {
			queryParams: {
				user: this._authService.currentUserState.profile.email,
				page: url
			}
		};

		// service
		return this._proxyService
			.getAPI(AppServices['Utilities']['Page_Hints_List'], payload)
			.pipe(res => res);
	}

	/**
	 * update page hints status
	 *
	 * @param url
	 */
	public pageHintsUpdate(url: string) {
		// payload
		const payload = {
			bodyParams: {
				User: this._authService.currentUserState.profile.email,
				Page: url
			}
		};

		// service
		this._proxyService
			.postAPI(AppServices['Utilities']['Page_Hints_Update'], payload)
			.subscribe();
	}
}
