// app
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as moment from 'moment';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';

@Component({
	selector: 'app-push-message-form-elements',
	templateUrl: './push-message-form-elements.component.html',
	styleUrls: ['./push-message-form-elements.component.scss']
})

export class PushMessageFormElementsComponent implements OnInit {
	@Output() changeFormTitle: EventEmitter<any> = new EventEmitter();

	@Input() language;
	@Input() data;
	@Input() tab = null;
	@Input() formArray;
	@Input() minDate;
	@Input() staticColors;

	public dateTimeButton = false;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public guestPeriodsList: SelectDefaultInterface[] = [];
	public hotelsList: SelectDefaultInterface[] = [];
	public targetGroupsList: SelectDefaultInterface[] = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _utilityService: UtilityService) {
	}

	ngOnInit() {
		// get periods list
		this.guestPeriodsList = this._utilityService.getGuestPeriods();
		this.guestPeriodsList.shift();

		// target groups list
		this.targetGroupsList = this._utilityService.getTargetGroups();

		// listen: get hotels
		this._utilityService.getHotelList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.hotelsList = res);

		// form data
		if (this.tab || this.formArray[0]) {
			const title = (this.tab === null) ? this.formArray[0].controls['title'] : this.tab.controls['title'];
			const text = (this.tab === null) ? this.formArray[0].controls['description'] : this.tab.controls['description'];
			const link = this.formArray[0].controls['link'];
			const color = this.formArray[0].controls['color'];

			// listen: title field
			title.valueChanges
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => this.changeFormTitle.emit(res));

			// update form with existing data
			if (this.data) {
				console.log(this.data);
				title.setValue(this.data.Title);
				text.setValue(this.data.Text[this.language]);
				link.setValue(this.data.Data.Link);
				color.setValue(this.data.Data.Colour);
			}
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
		const periodically = (this.tab === null) ? this.formArray[0].controls['periodically'] : this.tab.controls['periodically'];

		if (radioEvent.value === 'date') {
			time.enable();
			periodically.disable();
			this.dateTimeButton = false;
		}

		if (radioEvent.value === 'periodic') {
			time.disable();
			periodically.enable();
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
