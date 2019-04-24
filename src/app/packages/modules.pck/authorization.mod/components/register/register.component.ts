// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
import { AuthRegisterInterface } from '../../interfaces/auth-register.interface';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { ErrorHandlerTypeEnum } from '../../../../utilities.pck/error-handler.mod/enums/error-handler-type.enum';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['../auth.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public registerHotelNameSelectType = SelectTypeEnum.DEFAULT;
	public registerHotelNameSelectStyleType = SelectStyleEnum.INFO;
	public registerHotelNameIcons = [faHotel];
	public hotelList: SelectDefaultInterface[] = [];
	public version = '1.0.0';

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _authService: AuthService,
		private _hotelListService: HotelListService,
		private _router: Router,
		private _i18n: I18n
	) {
		// form fields
		this.formFields = new FormGroup({
			hotelName: new FormControl('', [
				Validators.required
			]),
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
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

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
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

		// payload
		const formPayload: AuthRegisterInterface = {
			email: this.email.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value,
			password: this.password.value
		};

		// start registration process
		this._authService.authRegister(formPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				// clear the form
				this.formFields.reset();

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// dialog payload
				const data = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						title: this._i18n({ value: 'Title: Success', id: 'Auth_Register_Form_Success_Title' }),
						message: this._i18n({ value: 'Description: Success', id: 'Auth_Register_Form_Success_Description' }),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					}
				};

				// dialog service
				this._dialogService.showDialog(data)
					.pipe(takeUntil(this._ngUnSubscribe))
					.subscribe(() => {
						// navigate to login route
						this._router.navigate([ROUTING.authorization.login]).then();
					});
			}, (res) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// handle errors
				if (res.error.code === 'UsernameExistsException') {
					const payload = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: this._i18n({ value: 'Title: User Exists Exception', id: 'Auth_Register_Form_Error_UsernameExistsException_Title' }),
							message: this._i18n({ value: 'Description: User Exists Exception', id: 'Auth_Register_Form_Error_UsernameExistsException_Description' }),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						}
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				} else {
					const payload = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: this._i18n({ value: 'Title: Error Generic', id: 'Auth_Register_Form_Error_Generic_Title' }),
							message: this._i18n({ value: 'Description: Error Generic', id: 'Auth_Register_Form_Error_Generic_Description' }),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						}
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				}
			});
	}
}
