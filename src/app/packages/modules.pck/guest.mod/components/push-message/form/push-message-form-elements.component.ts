// app
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as moment from 'moment';

@Component({
	selector: 'app-push-message-form-elements',
	templateUrl: './push-message-form-elements.component.html',
	styleUrls: ['./push-message-form-elements.component.scss']
})

export class PushMessageFormElementsComponent implements OnInit {
	@Output() changeFormTitle: EventEmitter<any> = new EventEmitter();

	@Input() tab = null;
	@Input() formArray;
	@Input() minDate;
	@Input() staticColors;

	public dateTimeButton = false;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor() {
	}

	ngOnInit() {
		// listen: title field
		if (this.tab || this.formArray[0]) {
			const title = (this.tab === null) ? this.formArray[0].controls['title'] : this.tab.controls['title'];
			title.valueChanges
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => this.changeFormTitle.emit(res));
		}
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * on change date time and periodically
	 *
	 * @param radioEvent
	 */
	public onChangeDateTimeAndPeriodically(radioEvent: any) {
		const time = (this.tab === null) ? this.formArray[0].controls['time'] : this.tab.controls['time'];

		if (radioEvent.value === 'date') {
			time.enable();
			this.dateTimeButton = false;
		}

		if (radioEvent.value === 'periodic') {
			time.disable();
			this.dateTimeButton = true;
		}
	}

	/**
	 * set current date and time
	 */
	public onClickSetDateTimeNow() {
		const date = (this.tab === null) ? this.formArray[0].controls['date'] : this.tab.controls['date'];
		const time = (this.tab === null) ? this.formArray[0].controls['time'] : this.tab.controls['time'];
		date.setValue(moment().toDate());
		time.setValue(moment().format('HH:mm'));
	}
}
