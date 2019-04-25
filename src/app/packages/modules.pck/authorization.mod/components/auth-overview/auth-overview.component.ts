// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-auth-overview',
	templateUrl: './auth-overview.component.html',
	styleUrls: ['./auth-overview.component.scss']
})

export class AuthOverviewComponent {
	public imageValue = Math.floor(Math.random() * 15) + 1;
	public imageUrl = 'url(/assets/images/auth/bg/bg_' + this.imageValue + '.jpg)';
}
