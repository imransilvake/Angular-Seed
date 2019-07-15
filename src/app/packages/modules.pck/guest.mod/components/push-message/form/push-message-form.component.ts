// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// app
import * as moment from 'moment';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';
import { PushMessageService } from '../../../services/push-message.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';

@Component({
	selector: 'app-push-message-form',
	templateUrl: './push-message-form.component.html',
	styleUrls: ['./push-message-form.component.scss']
})

export class PushMessageFormComponent implements OnInit, OnDestroy {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public faIcons = [faSpinner];
	public formFields;
	public systemLanguages;
	public systemInfo;
	public tabsList = [];
	public minDate = moment(moment()).add(1, 'days').toDate();
	public title = 'Form';
	public errorMessage;

	public loading = false;
	public staticColors = ['#3e9d2e', '#d2a41a', '#e74c3c'];
	public dateTimeButton = false;

	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public guestPeriodsList: SelectDefaultInterface[] = [];
	public hotelsList: SelectDefaultInterface[] = [];
	public targetGroupsList: SelectDefaultInterface[] = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _pushMessageService: PushMessageService,
		private _utilityService: UtilityService,
		private _formBuilder: FormBuilder
	) {
		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			state: new FormControl(false),
			link: new FormControl('', [ValidationService.urlValidator]),
			color: new FormControl(this.staticColors[0]),
			date: new FormControl({ value: '', disabled: true }),
			time: new FormControl('', [ValidationService.timeValidator]),
			periodically: new FormControl({ value: '', disabled: true }),
			hotels: new FormControl('', [Validators.required]),
			targetGroups: new FormControl('', [Validators.required]),
			access: new FormControl(false)
		});
	}

	ngOnInit() {
		// listen: get hotels
		this._utilityService.getHotelList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
					// set hotels
					this.hotelsList = res;

					// pre-select hotels
					if (this.data && this.data.HotelIDs) {
						const hotels = this.formFields.controls['hotels'];
						const selectedHotels = [];
						for (let i = 0; i < this.data.HotelIDs.length; i++) {
							selectedHotels.push(
								...this.hotelsList.filter(
									target => target.id === this.data.HotelIDs[i]
								)
							);
						}
						hotels.setValue(selectedHotels);
					}
				}
			);

		// get periods list
		this.guestPeriodsList = this._utilityService.getGuestPeriods();
		this.guestPeriodsList.shift();

		// target groups list
		this.targetGroupsList = this._utilityService.getTargetGroups();

		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// listen: fetch form languages
		this._pushMessageService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset tab list
					this.tabsList = [];

					// tabs list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach(language => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add tabs
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);
						});
					} else {
						// add form groups dynamically
						this.addLanguageSpecificFields();
					}

					// update form with existing data
					if (this.data) {
						const link = this.formFields.controls['link'];
						const color = this.formFields.controls['color'];
						const targetGroups = this.formFields.controls['targetGroups'];
						const periodically = this.formFields.controls['periodically'];
						const access = this.formFields.controls['access'];
						const selectedGroups = this.targetGroupsList.filter(
							target => target.id === this.data['Target Group']
						);
						const selectedPeriod = this.guestPeriodsList.filter(
							target => target.id === this.data['Trigger']
						);

						link.setValue(this.data.Data.Link);
						color.setValue(this.data.Data.Colour);
						targetGroups.setValue(...selectedGroups);
						periodically.setValue(...selectedPeriod);
						access.setValue(this.data.Access && this.data.Access.toLowerCase() === 'group');

						console.log(this.data);
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
	 * getters
	 */
	get formArray() {
		return <FormArray>this.formFields.controls.languages.controls;
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * add forms groups for each language
	 */
	public addLanguageSpecificFields() {
		(<FormArray>this.formFields.controls['languages']).push(
			new FormGroup({
				title: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(64)
				]),
				description: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(2000)
				])
			})
		);
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		console.log(this.formFields.getRawValue());
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

	/**
	 * on tab change
	 *
	 * @param tabEvent
	 */
	public onChangeTab(tabEvent: any) {
		const titleValue = this.formArray[tabEvent.index].controls['title'].value;
		this.title = titleValue ? titleValue : 'Form';
	}

	/**
	 * on change date time and periodically
	 *
	 * @param radioEvent
	 */
	public onChangeDateTimeAndPeriodically(radioEvent: any) {
		const time = this.formFields.controls['time'];
		const periodically = this.formFields.controls['periodically'];

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
		const date = this.formFields.controls['date'];
		const time = this.formFields.controls['time'];
		date.setValue(moment().toDate());
		time.setValue(moment().format('HH:mm'));
	}
}
