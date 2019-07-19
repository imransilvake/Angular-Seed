// angular
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class GuestService {
	public appState;

	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * form languages
	 *
	 * @param pageView
	 */
	public guestFormLanguagesFetch(pageView: AppViewTypeEnum) {
		if (pageView === AppViewTypeEnum.DEFAULT) {
			return of(null);
		}

		// payload
		const payload = {
			pathParams: {
				groupId: this.appState.groupId
			}
		};

		// service
		return this._proxyService
			.getAPI(AppServices['Guest']['Guest_Offers_And_Notifications_Form_Group'], payload)
			.pipe(map(res => res));
	}
}
