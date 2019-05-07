// angular
import { Component, Input } from '@angular/core';

// app
import { AppVersionService } from '../../../utilities.pck/accessories.mod/services/app-version.service';

@Component({
	selector: 'app-auth-info',
	template: `
		<div class="ham-auth-info">
			<div class="ham-details ham-top">
				<img class="ham-logo" src="assets/svg/logo_black.svg" alt="bg-inner">
				<h1>{{translateTitle}}</h1>
				<p>{{translateDescription}}</p>
			</div>
			<div class="ham-details ham-bottom">
				<div class="cd-row">
					<div class="cd-col cd-col-pd-m-6 cd-col-pd-s-6 cd-col-pd-d-6 cd-col-pd-w-6">
						<p>{{translateVersion}}: {{appVersion}}</p>
					</div>
					<div class="cd-col cd-col-pd-m-6 cd-col-pd-s-6 cd-col-pd-d-6 cd-col-pd-w-6">
						<img class="ts-logo-poweredby" src="assets/svg/logo_powered_by.svg" alt="powered-by">
					</div>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./auth-info.component.scss']
})

export class AuthInfoComponent {
	public appVersion;

	@Input() translateTitle;
	@Input() translateDescription;
	@Input() translateVersion;

	constructor(private _appVersionService: AppVersionService) {
		this.appVersion = this._appVersionService.appVersion;
	}
}
