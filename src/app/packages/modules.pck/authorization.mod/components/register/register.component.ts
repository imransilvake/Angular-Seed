// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthRegisterInterface } from '../../interfaces/auth-register.interface';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { AutocompleteTypeEnum } from '../../../../core.pck/fields.mod/enums/autocomplete-type.enum';
import { UtilityService } from '../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public registerHotelNameAutocompleteType = AutocompleteTypeEnum.DEFAULT;
	public registerSalutationSelectType = SelectTypeEnum.DEFAULT;
	public hotelList: SelectDefaultInterface[] = [];
	public salutationList: SelectDefaultInterface[] = [];
	public errorMessage;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService,
		private _utilityService: UtilityService
	) {
		// form group
		this.formFields = new FormGroup({
			hotelId: new FormControl('', [
				Validators.required,
				ValidationService.autocompleteOptionValidator,
			]),
			salutation: new FormControl('', [
				Validators.required
			]),
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// listen: hotel list event
		this._utilityService
			.getHotelList()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.hotelList = res);

		// salutation
		this.salutationList = this._utilityService.getSalutationList();

		// listen: error message
		this._authService.errorMessage
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
	get hotelId() {
		return this.formFields.get('hotelId');
	}

	get salutation() {
		return this.formFields.get('salutation');
	}

	get firstName() {
		return this.formFields.get('firstName');
	}

	get lastName() {
		return this.formFields.get('lastName');
	}

	get password() {
		return this.formFields.get('password');
	}

	get email() {
		return this.formFields.get('email');
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

		// get browser language
		const language = navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : navigator.language;
		const browserLanguage = language.split('-')[0];

		// payload
		const formPayload: AuthRegisterInterface = {
			lang: browserLanguage,
			hotelId: this.hotelId.value.id,
			salutation: this.salutation.value.id,
			email: this.email.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value,
			password: HelperService.hashPassword(this.password.value)
		};

		// start registration process
		this._authService.authRegister(formPayload, this.formFields);
	}
}
