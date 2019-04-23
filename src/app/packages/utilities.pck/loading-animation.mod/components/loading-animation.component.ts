// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import { HelperService } from '../../accessories.mod/services/helper.service';
import { LoadingAnimationInterface } from '../interfaces/loading-animation.interface';

@Component({
	selector: 'app-loading-animation',
	templateUrl: './loading-animation.component.html',
	styleUrls: ['./loading-animation.component.scss'],
	animations: [
		trigger('animate', [
			state('true', style({ opacity: 1 })),
			state('false', style({ opacity: 0, zIndex: -1 })),
			transition('true => false', animate('1s ease-in-out'))
		])
	]
})

export class LoadingAnimationComponent implements OnInit, OnDestroy {
	@Output() changedAnimationStatus: EventEmitter<boolean> = new EventEmitter();

	public isShowLoadingAnimation = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _helperService: HelperService,
		private _store: Store<LoadingAnimationInterface>
	) {
	}

	ngOnInit() {
		// subscribe: loading animation
		this._store.select('loadingAnimation')
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => {
				if (res !== undefined) {
					const status = res.status;

					// show/hide animation
					this.isShowLoadingAnimation = status;

					// adjust body overflow
					this._helperService.overflowToggle(status);

					// emit value
					this.changedAnimationStatus.emit(status);
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
