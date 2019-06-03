// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { SelectTypeEnum } from '../../../../../../core.pck/fields.mod/enums/select-type.enum';
import { ClientService } from '../../../../services/client.service';
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { UtilityService } from '../../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-license',
	templateUrl: './license.component.html',
	styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public licenseSelectType = SelectTypeEnum.DEFAULT;
	public countryList;
	public licenseHotelsList;
	public licenseHSAUserBlocksList = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _utilityService: UtilityService,
		private _clientService: ClientService
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
		this.license.controls['HSA'].controls['NumberOfUserBlocks'].setValue(this.licenseHSAUserBlocksList[0]);
	}

	ngOnInit() {
		// listen: country list
		this._utilityService.getCountryList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.countryList = res);

		// get license hotels list
		this.licenseHotelsList = this._clientService.clientFetchLicenseList();

		// listen: HGA number of hotels
		this.license.controls['HGA'].controls['NumberOfHotels'].valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.license.controls['HGA'].controls['NumberOfUsers'].setValue(res.value);
			});

		// listen: HSA number of hotels
		this.license.controls['HSA'].controls['NumberOfHotels'].valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.license.controls['HSA'].controls['NumberOfUsers'].setValue(res.value * 2);
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
		console.log(this.formFields.value);
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
