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

@Component({
	selector: 'app-license',
	templateUrl: './license.component.html',
	styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public licenseCountrySelectType = SelectTypeEnum.DEFAULT;
	public countryList;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
		// form group
		this.formFields = new FormGroup({
			systemIdentifier: new FormControl('', [Validators.required]),
			company: new FormControl('', [Validators.required]),
			address: new FormGroup({
				address1: new FormControl('', [Validators.required]),
				address2: new FormControl(''),
				zip: new FormControl('', [Validators.required]),
				city: new FormControl('', [Validators.required]),
				country: new FormControl('', [Validators.required])
			})
		});
	}

	ngOnInit() {
		// listen: country list
		this._clientService.fetchCountryList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.countryList = res);
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
		return this.formFields.get('systemIdentifier');
	}

	get company() {
		return this.formFields.get('company');
	}

	get address() {
		return this.formFields.get('address');
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
