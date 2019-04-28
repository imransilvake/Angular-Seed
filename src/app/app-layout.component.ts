// angular
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ScrollTopService } from './packages/utilities.pck/accessories.mod/services/scroll-top.service';
import { HelperService } from './packages/utilities.pck/accessories.mod/services/helper.service';
import { SessionService } from './packages/core.pck/session.mod/services/session.service';

@Component({
	selector: 'app-layout',
	templateUrl: './app-layout.component.html',
	styleUrls: ['./app-layout.component.scss']
})

export class AppLayoutComponent implements AfterViewInit, OnDestroy {
	@ViewChild('topHead') topHead: ElementRef;

	public drawerState = false;
	public isViewDesktop = false;
	public topHeadHeight = 67;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _scrollTopService: ScrollTopService,
		private _sessionService: SessionService // needed
	) {
		// detect current view
		this.isViewDesktop = HelperService.isDesktopView;
	}

	ngAfterViewInit() {
		// listen scroll to top
		this._scrollTopService.scrollTopListener();

		// listen to scroll event
		HelperService.detectScroll()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				// set top Head height
				this.calculateTopHeadHeight();
			});

		// listen to resize event
		HelperService.detectWindowResize()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				// set top Head height
				this.calculateTopHeadHeight();
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * on click top head block
	 */
	public onClickTopHead() {
		// set top Head height
		this.calculateTopHeadHeight();
	}

	/**
	 * calculate and set top Head height
	 */
	public calculateTopHeadHeight() {
		const topHeadHeight = this.topHead && this.topHead.nativeElement && this.topHead.nativeElement.offsetHeight;
		if (topHeadHeight !== this.topHeadHeight) {
			this.topHeadHeight = topHeadHeight;
		}
	}
}
