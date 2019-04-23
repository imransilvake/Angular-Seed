// angular
import { Injectable } from '@angular/core';

// app
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthResetInterface } from '../interfaces/auth-reset.interface';

@Injectable()
export class ResetPasswordService {
	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * perform reset password process
	 *
	 * @param resetPayload
	 */
	public authResetPassword(resetPayload: AuthResetInterface) {
		return this._proxyService
			.postAPI(AppServices['authResetPassword'], { bodyParams: resetPayload });
	}
}
