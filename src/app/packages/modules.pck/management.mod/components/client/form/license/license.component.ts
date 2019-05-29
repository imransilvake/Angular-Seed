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
			GroupID: new FormControl('', [Validators.required]),
			Name: new FormControl('', [Validators.required]),
			Address: new FormGroup({
				Address1: new FormControl('', [Validators.required]),
				Address2: new FormControl(''),
				PostalCode: new FormControl('', [Validators.required]),
				City: new FormControl('', [Validators.required]),
				Country: new FormControl('', [Validators.required])
			}),
			License: new FormGroup({
				HGA: new FormGroup({
					NumberOfHotels: new FormControl(''),
					NumberOfUsers: new FormControl(''),
					NumberOfUserBlocks: new FormControl(null)
				}),
				HSA: new FormGroup({
					NumberOfHotels: new FormControl(''),
					NumberOfUsers: new FormControl(''),
					NumberOfUserBlocks: new FormControl('')
				})
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
		console.log(this.formFields.value)
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
