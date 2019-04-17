// angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { HotelListService } from '../../services/hotel-list.service';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SelectStyleEnum } from '../../../../core.pck/fields.mod/enums/select-style.enum';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { RegisterService } from '../../services/register.service';
import { AuthRegisterInterface } from '../../interfaces/auth-register.interface';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { ErrorHandlerTypeEnum } from '../../../../utilities.pck/error-handler.mod/enums/error-handler-type.enum';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['../auth.component.scss']
})

export class RegisterComponent implements OnInit {
	public routing = ROUTING;
	public formFields;
	public registerHotelNameSelectType = SelectTypeEnum.DEFAULT;
	public registerHotelNameSelectStyleType = SelectStyleEnum.INFO;
	public registerHotelNameIcons = [faHotel];
	public hotelList: SelectDefaultInterface[] = [];
	public version = '1.0.0';

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _registerService: RegisterService,
		private _hotelListService: HotelListService
	) {
		// form fields
		this.formFields = new FormGroup({
			hotelName: new FormControl('', [
				Validators.required
			]),
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(256)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(256)
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// set hotel list
		this.hotelList = this._hotelListService.getHotelList();
	}

	/**
	 * setters
	 */
	get hotelName() {
		return this.formFields.get('hotelName');
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

		// register payload
		const registerPayload: AuthRegisterInterface = {
			email: this.email.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value,
			password: this.password.value
		};

		// start registration process
		this._registerService.authRegister(registerPayload)
			.subscribe((res) => {
				if (res && res.code === 'UsernameExistsException') {
					// error payload
					const data = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: res.code,
							message: res.message,
							buttonTexts: ['Close']
						}
					};

					// error dispatch
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
				} else {
					// clear the form
					this.formFields.reset();

					// dialog payload
					const data = {
						type: DialogTypeEnum.NOTICE,
						payload: {
							title: 'Success',
							message: 'Your account has been created successfully!',
							buttonTexts: ['Close']
						}
					};

					// dialog service
					this._dialogService.showDialog(data);
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			}, () => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// error payload
				const data = {
					type: ErrorHandlerTypeEnum.COMMON_ERROR,
					payload: {
						title: 'Registration Error',
						message: 'Registration process is failed due to some reason. Please contact the administration!',
						buttonTexts: ['Close']
					}
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
			});
	}
}
