// angular
import { Component } from '@angular/core';

// app
import { ROUTING } from '../../../../../environments/environment';

@Component({
	selector: 'app-e404',
	templateUrl: './e404.component.html',
	styleUrls: ['./e404.component.scss']
})

export class E404Component {
	public routing = ROUTING;
	public imageValue = Math.floor(Math.random() * 7) + 1 || 1;
	public imageUrl = 'url(assets/images/auth/bg/bg_' + this.imageValue + '.jpg)';
}
