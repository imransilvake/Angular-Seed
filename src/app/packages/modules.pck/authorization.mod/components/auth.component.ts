// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-auth-overview',
	template: `
		<section class="ham-auth-wrapper" [ngStyle]="{'background-image': imageUrl}">
			<router-outlet></router-outlet>
		</section>
	`,
	styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
	public imageValue = Math.floor(Math.random() * 15) + 1 || 1;
	public imageUrl = 'url(assets/images/auth/bg/bg_' + this.imageValue + '.jpg)';
}
