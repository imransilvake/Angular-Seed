// angular
import { Component, OnInit } from '@angular/core';

// app
import * as moment from 'moment';
import { AuthService } from '../../../../authorization.mod/services/auth.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-profile-cover',
	templateUrl: './profile-cover.component.html',
	styleUrls: ['./profile-cover.component.scss']
})

export class ProfileCoverComponent implements OnInit {
	public currentUser;
	public userName;
	public userNameLetters;
	public loginTime;

	constructor(private _authService: AuthService) {
	}

	ngOnInit() {
		// get current user state
		this.currentUser = this._authService.currentUserState;

		// get user name
		this.userName = HelperService.capitalizeString(this.currentUser.profile.name);

		// get first letters of name
		this.userNameLetters = HelperService.getFirstLetter(this.userName);

		// set login time
		this.loginTime = moment.unix(this.currentUser.profile.auth_time).format('DD. MMMM. YYYY');
	}
}
