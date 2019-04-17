// angular
import { Injectable } from '@angular/core';

// app
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthForgotInterface } from '../interfaces/auth-forgot.interface';

@Injectable()
export class ForgotPasswordService {
	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * perform user forgot password process
	 *
	 * @param forgotPayload
	 */
	public authForgotPassword(forgotPayload: AuthForgotInterface) {
		return this._proxyService
			.postAPI(AppServices['authForgotPassword'], { bodyParams: forgotPayload });
	}
}
