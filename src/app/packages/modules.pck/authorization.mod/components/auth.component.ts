// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-auth-overview',
	template: `
		<section class="ham-wrapper-1" [ngStyle]="{'background-image': imageUrl}">
			<router-outlet></router-outlet>
		</section>
	`
})

export class AuthComponent {
	public imageValue = Math.floor(Math.random() * 7) + 1 || 1;
	public imageUrl = 'url(assets/images/auth/bg/bg_' + this.imageValue + '.jpg)';
}
