// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { SelectTypeEnum } from '../../../../../../core.pck/fields.mod/enums/select-type.enum';
import { ClientService } from '../../../../services/client.service';
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { UtilityService } from '../../../../../../utilities.pck/accessories.mod/services/utility.service';
import { LoadingAnimationService } from '../../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { LicenseSystemInterface } from '../../../../interfaces/license-system.interface';

@Component({
	selector: 'app-license',
	templateUrl: './license.component.html',
	styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();
	@Input() hotelId;
	@Input() licenseSystemData;

	public formFields;
	public licenseSelectType = SelectTypeEnum.DEFAULT;
	public countryList;
	public licenseHotelsList;
	public licenseHSAUserBlocksList = [];
	public systemData;
	public errorMessage;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _utilityService: UtilityService,
		private _clientService: ClientService,
		private _loadingAnimationService: LoadingAnimationService
	) {
		// form group
		this.formFields = new FormGroup({
			GroupID: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(3)
			]),
			Name: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(256)
			]),
			Address: new FormGroup({
				Address1: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(256)
				]),
				Address2: new FormControl('', [Validators.maxLength(256)]),
				PostalCode: new FormControl('', [
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(20)
				]),
				City: new FormControl('', [
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(256)
				]),
				Country: new FormControl('', [Validators.required])
			}),
			License: new FormGroup({
				HGA: new FormGroup({
					NumberOfHotels: new FormControl('', [Validators.required]),
					NumberOfUsers: new FormControl({ value: '', disabled: true }),
					NumberOfUserBlocks: new FormControl(null)
				}),
				HSA: new FormGroup({
					NumberOfHotels: new FormControl('', [Validators.required]),
					NumberOfUsers: new FormControl({ value: '', disabled: true }),
					NumberOfUserBlocks: new FormControl(null)
				})
			})
		});

		// fill user block list with 100 values
		new Array(101).fill(0).forEach((v, i) => {
			this.licenseHSAUserBlocksList.push({ id: i, text: String(i) });
		});

		// pre-select user block list
		this.license.get('HSA').get('NumberOfUserBlocks').setValue(this.licenseHSAUserBlocksList[0]);
	}

	ngOnInit() {
		// listen: country list
		this.countryList = this._utilityService.countryList;

		// get license hotels list
		this.licenseHotelsList = this._clientService.clientFetchLicenseList();

		// listen: HGA number of hotels
		this.license.get('HGA').get('NumberOfHotels').valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.license.get('HGA').get('NumberOfUsers').setValue(res.value);
			});

		// listen: HSA number of hotels
		this.license.get('HSA').get('NumberOfHotels').valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.license.get('HSA').get('NumberOfUsers').setValue(res.value * 2);
			});

		// listen: get license & system data
		this._clientService.clientDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.licenseSystemData) {
					// set values
					const countryName = this.countryList.filter(country => country.id === res.licenseSystemData.Address.Country)[0];
					const hgaNumberOfHotels = this.licenseHotelsList.filter(hotel => hotel.id === res.licenseSystemData.License.HGA.NumberOfHotels)[0];
					const hsaNumberOfHotels = this.licenseHotelsList.filter(hotel => hotel.id === res.licenseSystemData.License.HSA.NumberOfHotels)[0];
					const hsaNumberOfUserBlocks = this.licenseHSAUserBlocksList.filter(user => user.id === res.licenseSystemData.License.HSA.NumberOfUserBlocks)[0];

					// update form
					this.company.setValue(res.licenseSystemData.Name);
					this.systemIdentifier.disable();
					this.systemIdentifier.setValue(res.licenseSystemData.GroupID);
					this.address.get('Address1').setValue(res.licenseSystemData.Address.Address1);
					this.address.get('Address2').setValue(res.licenseSystemData.Address.Address2);
					this.address.get('City').setValue(res.licenseSystemData.Address.City);
					this.address.get('Country').setValue(countryName);
					this.address.get('PostalCode').setValue(res.licenseSystemData.Address.PostalCode);
					this.license.get('HGA').get('NumberOfHotels').setValue(hgaNumberOfHotels);
					this.license.get('HGA').get('NumberOfUsers').setValue(res.licenseSystemData.License.HGA.NumberOfUsers);
					this.license.get('HGA').get('NumberOfUserBlocks').setValue(null);
					this.license.get('HSA').get('NumberOfHotels').setValue(hsaNumberOfHotels);
					this.license.get('HSA').get('NumberOfUsers').setValue(res.licenseSystemData.License.HSA.NumberOfUsers);
					this.license.get('HSA').get('NumberOfUserBlocks').setValue(hsaNumberOfUserBlocks);

					// set system data
					this.systemData = res.licenseSystemData.System;
				}
			});

		// listen: validate system identifier on new form
		if (!this.hotelId) {
			this.systemIdentifier.valueChanges
				.pipe(
					debounceTime(200),
					takeUntil(this._ngUnSubscribe)
				)
				.subscribe(res => {
					// payload
					const formPayload = { GroupID: res };

					// service
					this._clientService.clientValidateLicense(formPayload, this.formFields);
				});
		}

		// listen: error message
		this._clientService.errorMessage
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.errorMessage = res);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get systemIdentifier() {
		return this.formFields.get('GroupID');
	}

	get company() {
		return this.formFields.get('Name');
	}

	get address() {
		return this.formFields.get('Address');
	}

	get license() {
		return this.formFields.get('License');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// payload
		const formPayload: LicenseSystemInterface = {
			GroupID: this.systemIdentifier.value,
			Name: this.company.value,
			Address: {
				...this.formFields.value.Address,
				Country: this.formFields.value.Address.Country.id
			},
			License: {
				HGA: {
					...this.formFields.value.License.HGA,
					NumberOfHotels: this.formFields.value.License.HGA.NumberOfHotels.id,
					NumberOfUsers: this.formFields.value.License.HGA.NumberOfHotels.value,
					NumberOfUserBlocks: null
				},
				HSA: {
					...this.formFields.value.License.HSA,
					NumberOfHotels: this.formFields.value.License.HSA.NumberOfHotels.id,
					NumberOfUsers: this.formFields.value.License.HSA.NumberOfHotels.value,
					NumberOfUserBlocks: this.formFields.value.License.HSA.NumberOfUserBlocks.id
				}
			},
			System: { ...this.systemData }
		};

		// update license information
		this._clientService.clientUpdateLicenseAndSystem(formPayload);
	}

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
