// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';
import { PushMessageService } from '../../../services/push-message.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-push-message-form',
	templateUrl: './push-message-form.component.html',
	styleUrls: ['./push-message-form.component.scss']
})

export class PushMessageFormComponent implements OnInit, OnDestroy {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public systemLanguages;
	public systemInfo;
	public tabsList = [];
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _pushMessageService: PushMessageService,
		private _utilityService: UtilityService
	) {
	}

	ngOnInit() {
		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// listen: fetch form languages
		this._pushMessageService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// reset tab list
				this.tabsList = [];

				// form languages
				if (res && res.formLanguages) {
					this.systemInfo = res.formLanguages;

					// tabs list
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 0) {
						this.systemInfo['System'].Languages.forEach(language => {
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);
						});
					}
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestPushMessageViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changePushMessageView.emit(payload);
	}
}
