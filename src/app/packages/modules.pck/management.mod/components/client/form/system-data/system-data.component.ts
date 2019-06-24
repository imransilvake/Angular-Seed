// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { AppViewTypeEnum } from '../../../../enums/app-view-type.enum';
import { SelectTypeEnum } from '../../../../../../core.pck/fields.mod/enums/select-type.enum';
import { UtilityService } from '../../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectDefaultInterface } from '../../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { ClientService } from '../../../../services/client.service';
import { LoadingAnimationService } from '../../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { SystemEndpointInterface } from '../../../../interfaces/system-endpoint.interface';

@Component({
	selector: 'app-system-data',
	templateUrl: './system-data.component.html',
	styleUrls: ['./system-data.component.scss']
})

export class SystemDataComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();
	@Input() id;

	public formFields;
	public systemDataSelectType = SelectTypeEnum.DEFAULT;
	public primaryLanguageList: SelectDefaultInterface[] = [];
	public secondaryLanguageList: SelectDefaultInterface[] = [];
	public licenseData;
	public errorMessage;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _utilityService: UtilityService,
		private _clientService: ClientService,
		private _loadingAnimationService: LoadingAnimationService
	) {
		// form group
		this.formFields = new FormGroup({
			Reservation: new FormControl(false),
			UseTargetGroups: new FormControl(false),
			PrimaryLanguageName: new FormControl(''),
			SecondaryLanguageName: new FormControl(''),
			BackendEndpointURL: new FormControl('', [Validators.required]),
			BackendUsername: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
			]),
			BackendPassword: new FormControl('', [Validators.required]),
			SyncInterval: new FormControl('DAILY', [Validators.required]),
			BackendEndpointToken: new FormControl('', [
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(200)
			])
		});
	}

	ngOnInit() {
		// set language list
		this.primaryLanguageList = this._utilityService.getSystemLanguageList();
		this.secondaryLanguageList = this.primaryLanguageList;

		// listen: primary language change
		this.primaryLanguage.valueChanges
			.pipe(
				skip(this.id ? 1 : 0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res => {
				if (res) {
					// on same language, clear secondary language
					if (this.primaryLanguage.value === this.secondaryLanguage.value) {
						this.secondaryLanguage.setValue('');
					}

					// set secondary language list
					this.secondaryLanguageList = this.primaryLanguageList.map(item => {
						return (item.id === res.id) ? { disabled: true, ...res } : item;
					});
				}
			});

		// listen: get license & system data
		this._clientService.clientDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.licenseSystemData) {
					// set values
					const languages = res.licenseSystemData.System.Languages;
					const primaryLanguage = languages && this.primaryLanguageList.filter(language =>
						language.id === languages[0]
					)[0];
					const secondaryLanguage = languages && this.secondaryLanguageList.filter(language =>
						language.id === languages[1]
					)[0];

					// update form
					this.reservation.setValue(res.licenseSystemData.System.IsReservationRequired);
					this.targetGroups.setValue(res.licenseSystemData.System.UseTargetGroups);
					this.primaryLanguage.setValue(primaryLanguage);
					this.secondaryLanguage.setValue(secondaryLanguage);
					this.backendEndpointUrl.setValue(res.licenseSystemData.System.BackendEndpointURL);
					this.backendUsername.setValue(res.licenseSystemData.System.BackendUsername);
					this.backendPassword.setValue(res.licenseSystemData.System.BackendPassword);
					this.syncInterval.setValue(res.licenseSystemData.System.SyncInterval);
					this.backendEndpointToken.setValue(res.licenseSystemData.System.BackendEndpointToken);

					// set license data
					this.licenseData = {
						GroupID: res.licenseSystemData.GroupID,
						Name: res.licenseSystemData.Name,
						Address: res.licenseSystemData.Address,
						License: res.licenseSystemData.License
					};
				}
			});

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

	get backendEndpointToken() {
		return this.formFields.get('BackendEndpointToken');
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
		const payload: SystemEndpointInterface = {
			BackendEndpointURL: this.backendEndpointUrl.value,
			BackendUsername: this.backendUsername.value,
			BackendPassword: this.backendPassword.value,
			BackendEndpointToken: this.backendEndpointToken.value
		};

		// validate backend endpoint url
		this._clientService.clientValidateSystemEndpoint(payload, this.formFields, this.licenseData);
	}

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
