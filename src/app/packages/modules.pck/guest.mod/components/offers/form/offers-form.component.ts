// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// app
import * as moment from 'moment';
import { faPauseCircle, faPlayCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { GuestOffersService } from '../../../services/guest-offers.service';

@Component({
	selector: 'app-offers-form',
	templateUrl: './offers-form.component.html',
	styleUrls: ['./offers-form.component.scss']
})

export class OffersFormComponent implements OnInit, OnDestroy {
	@Output() changeOffersView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public faIcons = [faSpinner, faPlayCircle, faPauseCircle];
	public formFields;
	public systemLanguages;
	public systemInfo;
	public tabsList = [];
	public minDateFrom = moment().toDate();
	public minDateTo;
	public title = 'Form';

	public isAccess = false;
	public isState = false;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public hotelsList: SelectDefaultInterface[] = [];
	public targetGroupsList: SelectDefaultInterface[] = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _guestOfferService: GuestOffersService,
		private _utilityService: UtilityService,
		private _formBuilder: FormBuilder
	) {
		// target groups list
		this.targetGroupsList = this._utilityService.getTargetGroups();

		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			state: new FormControl('INACTIVE'),
			hotels: new FormControl('', [Validators.required]),
			targetGroups: new FormControl('', [Validators.required]),
			access: new FormControl('HOTEL'),
			validity: new FormGroup({
				from: new FormControl(this.minDateFrom, [Validators.required]),
				to: new FormControl('', [Validators.required])
			})
		});
	}

	ngOnInit() {
		// listen: fetch form languages
		this._guestOfferService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset tab list
					this.tabsList = [];

					// tabs list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach((language, index) => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add tabs
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);

							// update existing data
							if (this.data) {
								// title, text
								const title = this.formFields.controls['languages'].controls[index].controls['title'];
								const text = this.formFields.controls['languages'].controls[index].controls['description'];

								title.setValue(this.data.Titles[language]);
								this.title = this.data.Titles[language];
								text.setValue(this.data.Text[language]);

								// listen: title field
								title.valueChanges
									.pipe(takeUntil(this._ngUnSubscribe))
									.subscribe(x => this.title = x);
							}
						});
					}

					// update existing data
					if (this.data) {
						// access, state
						this.access.setValue(this.data.Access);
						this.isAccess = this.data.Access.toLowerCase() === 'group';
						this.state.setValue(this.data.State);
						this.isState = this.data.State.toLowerCase() === 'active';

						// target groups
						const selectedGroups = this.targetGroupsList.filter(target => target.id === this.data['Target Group']);
						if (selectedGroups.length) {
							this.targetGroups.setValue(...selectedGroups);
						} else {
							this.targetGroups.setValue(this.targetGroupsList[0]);
						}
					}
				}
			});

		// listen: get hotels
		this._utilityService.getHotelList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set hotels
				this.hotelsList = res;

				// pre-select hotels
				this.hotels.setValue([]);
				if (this.data && this.data.HotelIDs) {
					const selectedHotels = [];
					for (let i = 0; i < this.data.HotelIDs.length; i++) {
						selectedHotels.push(
							...this.hotelsList.filter(
								target => target.id === this.data.HotelIDs[i]
							)
						);
					}
					this.hotels.setValue(selectedHotels);
				}
			});

		// listen: validity from
		this.validity.controls['from'].valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// reset date when from is after to.
					if (moment(res).isAfter(this.validity.controls['to'].value)) {
						this.validity.controls['to'].reset();
					}
					this.minDateTo = moment(res).toDate();
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

	get state() {
		return this.formFields.get('state');
	}

	get validity() {
		return this.formFields.get('validity');
	}

	get targetGroups() {
		return this.formFields.get('targetGroups');
	}

	get hotels() {
		return this.formFields.get('hotels');
	}

	get access() {
		return this.formFields.get('access');
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
		const formData = this.formFields.getRawValue();
		console.log(formData);
	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeOffersView.emit(payload);
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
	 * toggle state
	 */
	public onClickToggleState() {
		// toggle state
		this.isState = !this.isState;
		const state = (this.isState) ? 'ACTIVE' : 'INACTIVE';

		// update to form
		this.state.setValue(state);
	}

	/**
	 * toggle access
	 */
	public onClickToggleAccess() {
		// toggle access
		this.isAccess = !this.isAccess;
		const access = (this.isAccess) ? 'GROUP' : 'HOTEL';

		// update to form
		this.access.setValue(access);
	}
}
