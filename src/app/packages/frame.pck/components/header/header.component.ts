// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

// app
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';
import { ROUTING } from '../../../../../environments/environment';

declare const document: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
	@Input() drawer;

	public routing = ROUTING;
	public appFullScreen = false;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _router: Router) {
	}

	ngOnInit() {
		// listen to full-screen event
		HelperService.detectFullScreen()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

				// in-active full screen
				this.appFullScreen = !(fullscreenElement === null);
			});

		// listen to window resize event
		HelperService.detectWindowResize()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				if (!HelperService.isDesktopView && this.drawer.opened) {
					// set icons menu
					this.drawer.toggle();
				}
			});
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
		this._router.navigate([this._router.url]).then();
	}
}
