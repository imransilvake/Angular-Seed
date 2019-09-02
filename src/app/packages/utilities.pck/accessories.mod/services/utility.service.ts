// angular
import { Injectable } from '@angular/core';

// app
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UtilityService {
	public currentUser;
	public countryList = [];

	constructor(private _authService: AuthService) {
		// get current user info
		this.currentUser = this._authService.currentUserState;
	}
}
