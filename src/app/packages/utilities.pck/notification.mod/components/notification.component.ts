// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { delay, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

// store
import { Store } from '@ngrx/store';

// app
import { NotificationInterface } from '../interfaces/notification.interface';
import { NotificationTypeEnum } from '../enums/notification-type.enum';
import { NotificationLayoutInterface } from '../interfaces/notification-layout.interface';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit, OnDestroy {
	@Input() notificationLayout: NotificationLayoutInterface;
	@Output() notificationUpdate = new EventEmitter(false);

	public messages: NotificationInterface[] = [];

	private unSubscribe: Subject<void> = new Subject<void>();
	private keepAfterNavigationChange = [];

	constructor(
		private _router: Router,
		private _store: Store<NotificationInterface>
	) {
		// subscribe: router setting
		// clear notification message on route change
		this._router.events
			.pipe(takeUntil(this.unSubscribe))
			.subscribe(event => {
				if (event instanceof NavigationStart) {
					if (this.messages) {
						this.messages = this.messages.filter(e => {
							return (!(e && e.payload && !e.payload.keepAfterNavigationChange));
						});
					}
				}
			});
	}

	ngOnInit() {
		// subscribe: notification
		this._store.select('notification')
			.pipe(takeUntil(this.unSubscribe))
			.subscribe((res) => {
				// validate res
				if (res && res.type !== null) {
					// if unique element then push to arrays
					if (this.messages.length === 0 || !(this.messages.some(e => e.payload.text === res.payload.text))) {
						this.messages.push(res);
						this.keepAfterNavigationChange.push(res.payload.keepAfterNavigationChange);
					}

					// type: close by id
					if (res.type === NotificationTypeEnum.CLOSE) {
						this.messages = this.messages.filter(e => res.payload.id !== e.payload.id);
					}

					// type: close all
					if (res.type === NotificationTypeEnum.CLOSE_ALL) {
						this.messages = [];
					}

					// broadcast change in notification
					of(null).pipe(delay(10)).subscribe(() => this.notificationUpdate.emit(true));
				}
			});
	}

	/**
	 * close notification message
	 *
	 * @param {number} id
	 */
	public onClickCloseMessage(id: number) {
		// remove specific message
		this.messages.splice(id, 1);
	}

	/**
	 * get message type
	 *
	 * @param {NotificationTypeEnum} messageType
	 * @returns {string}
	 */
	public getMessageType(messageType: NotificationTypeEnum): string {
		switch (messageType) {
			case NotificationTypeEnum.SUCCESS:
				return 'ham-success';
			case NotificationTypeEnum.ERROR:
				return 'ham-error';
			case NotificationTypeEnum.WARNING:
				return 'ham-warning';
			default:
				return 'ham-info';
		}
	}

	ngOnDestroy() {
		// remove subscriptions
		this.unSubscribe.next();
		this.unSubscribe.complete();
	}
}
