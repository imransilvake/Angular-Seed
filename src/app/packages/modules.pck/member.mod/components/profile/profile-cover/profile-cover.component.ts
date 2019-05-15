// angular
import { Component } from '@angular/core';

// app
import * as moment from 'moment';
import { AuthService } from '../../../../authorization.mod/services/auth.service';

@Component({
	selector: 'app-profile-cover',
	templateUrl: './profile-cover.component.html',
	styleUrls: ['./profile-cover.component.scss']
})

export class ProfileCoverComponent {
	public userData;
	public loginTime;

	constructor(private _authService: AuthService) {
		// get current user state
		this.userData = this._authService.currentUserState;

		// set login time
		this.loginTime = moment.unix(this.userData.profile.auth_time).format('DD. MMMM. YYYY');
	}
}
