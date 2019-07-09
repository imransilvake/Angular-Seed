// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { PageHintService } from '../../../services/page-hint.service';

@Component({
	selector: 'app-head',
	templateUrl: './head.component.html',
	styleUrls: ['./head.component.scss']
})

export class HeadComponent implements OnInit, OnDestroy {
	public routing = ROUTING;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	@Input() pageTitle;
	@Input() notification;
	@Input() showPageHint = false;
	@Input() pageHintTitle;
	@Input() pageHintText;

	constructor(
		private _router: Router,
		private _pageHints: PageHintService
	) {
	}

	ngOnInit() {
		// fetch page hint
		this._pageHints.pageHintsFetch(this._router.url)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.showPageHint = !res.status);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * close page hint
	 */
	public onClickClosePageHint() {
		// hide page hint
		this.showPageHint = false;

		// update status to backend
		this._pageHints.pageHintsUpdate(this._router.url);
	}
}
