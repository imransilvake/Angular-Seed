// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { SelectTypeEnum } from '../../../../../../core.pck/fields.mod/enums/select-type.enum';
import { UtilityService } from '../../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectDefaultInterface } from '../../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-system-data',
	templateUrl: './system-data.component.html',
	styleUrls: ['./system-data.component.scss']
})

export class SystemDataComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public systemDataSelectType = SelectTypeEnum.DEFAULT;
	public primaryLanguageList: SelectDefaultInterface[] = [];
	public secondaryLanguageList: SelectDefaultInterface[] = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _utilityService: UtilityService) {
		// form group
		this.formFields = new FormGroup({
			Reservation: new FormControl(false),
			UseTargetGroups: new FormControl(false),
			PrimaryLanguageName: new FormControl(''),
			SecondaryLanguageName: new FormControl(''),
			BackendEndpointURL: new FormControl('', [Validators.required]),
			BackendUsername: new FormControl('', [Validators.required]),
			BackendPassword: new FormControl('', [Validators.required]),
			SyncInterval: new FormControl('DAILY', [Validators.required]),
			Token: new FormControl('', [Validators.required])
		});
	}

	ngOnInit() {
		// set language list
		this.primaryLanguageList = this._utilityService.getSystemLanguageList();
		this.secondaryLanguageList = this._utilityService.getSystemLanguageList();

		// listen: primary language change
		this.primaryLanguage.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.secondaryLanguageList = this.primaryLanguageList.map(item => {
					return (item.id === res.id) ? { disabled: true, ...res } : item;
				});
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
	get reservation() {
		return this.formFields.get('Reservation');
	}

	get targetGroups() {
		return this.formFields.get('UseTargetGroups');
	}

	get primaryLanguage() {
		return this.formFields.get('PrimaryLanguageName');
	}

	get secondaryLanguage() {
		return this.formFields.get('SecondaryLanguageName');
	}

	get backendEndpointUrl() {
		return this.formFields.get('BackendEndpointURL');
	}

	get backendUsername() {
		return this.formFields.get('BackendUsername');
	}

	get backendPassword() {
		return this.formFields.get('BackendPassword');
	}

	get syncInterval() {
		return this.formFields.get('SyncInterval');
	}

	get token() {
		return this.formFields.get('Token');
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
