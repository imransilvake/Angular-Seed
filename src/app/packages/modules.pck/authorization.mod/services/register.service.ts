// angular
import { Injectable } from '@angular/core';

// app
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthRegisterInterface } from '../interfaces/auth-register.interface';

@Injectable()
export class RegisterService {
	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * perform user registration process
	 *
	 * @param registerPayload
	 */
	public authRegister(registerPayload: AuthRegisterInterface) {
		return this._proxyService
			.postAPI(AppServices['authRegister'], { bodyParams: registerPayload });
	}
}
