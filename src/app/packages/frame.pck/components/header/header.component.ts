// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';
import { faExpandArrowsAlt, faSpinner, faSync } from '@fortawesome/free-solid-svg-icons';
import { EmergencyService } from '../../services/emergency.service';
import { EmergencyInterface } from '../../interfaces/emergency.interface';

declare const document: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
	@Input() drawer;

	public routing = ROUTING;
	public faIcons = [faExpandArrowsAlt, faSync, faSpinner];
	public appFullScreen = false;
	public reloadState = false;
	public emergencyState: EmergencyInterface;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _emergencyService: EmergencyService
	) {
	}

	ngOnInit() {
		// listen: full-screen event
		HelperService.detectFullScreen()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
				this.appFullScreen = !(fullscreenElement === null);
			});

		// listen: window resize event
		HelperService.detectWindowResize()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				if (!HelperService.isDesktopView && this.drawer.opened) {
					this.drawer.toggle();
				}
			});

		// listen: emergency state
		this._emergencyService.getEmergencyState()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => this.emergencyState = res);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * open document in full-screen
	 */
	public onClickShowFullScreen() {
		// active full screen
		this.appFullScreen = true;

		// show full screen
		HelperService.showFullScreen();
	}

	/**
	 * reload route services
	 */
	public onClickReloadRoute() {
		// set spinner
		this.reloadState = true;

		// listen: router event
		this._router
			.navigate([this._router.url])
			.then(() => {
				of(null)
					.pipe(
						delay(1000),
						takeUntil(this._ngUnSubscribe)
					)
					.subscribe(() => this.reloadState = false);
			});
	}

	/**
	 * confirm emergency
	 *
	 * @param closeId
	 */
	public onClickEmergencyConfirm(closeId: string) {
		// remove emergency state
		this.emergencyState.status = false;

		// close notification message
		this._emergencyService.removeEmergencyNotification(closeId);
	}
}
