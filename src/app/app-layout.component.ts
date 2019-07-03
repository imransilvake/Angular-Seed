// angular
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as SessionActions from './packages/core.pck/session.mod/store/actions/session.actions';
import { ScrollTopService } from './packages/utilities.pck/accessories.mod/services/scroll-top.service';
import { HelperService } from './packages/utilities.pck/accessories.mod/services/helper.service';
import { SessionsEnum } from './packages/core.pck/session.mod/enums/sessions.enum';
import { Store } from '@ngrx/store';
import { SessionInterface } from './packages/core.pck/session.mod/interfaces/session.interface';

@Component({
	selector: 'app-layout',
	templateUrl: './app-layout.component.html',
	styleUrls: ['./app-layout.component.scss']
})

export class AppLayoutComponent implements AfterViewInit, OnDestroy {
	@ViewChild('topHead', { static: true }) topHead: ElementRef;

	public drawerState = false;
	public isViewDesktop = false;
	public topHeadHeight = 67;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _scrollTopService: ScrollTopService,
		private _store: Store<{ SessionInterface: SessionInterface }>
	) {
		// detect current view
		this.isViewDesktop = HelperService.isDesktopView;

		// session: start authentication
		this._store.dispatch(new SessionActions.SessionCounterStart(SessionsEnum.SESSION_AUTHENTICATION));
	}

	ngAfterViewInit() {
		// listen: scroll to top
		this._scrollTopService.scrollTopListener();

		// listen: scroll event
		// listen: resize event
		const mergeListeners = merge(
			HelperService.detectScroll(),
			HelperService.detectWindowResize()
		);
		mergeListeners
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				this.calculateTopHeadHeight();
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();

		// session: stop authentication
		this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_AUTHENTICATION));
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
