// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { LanguageListService } from '../../services/language-list.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SelectStyleEnum } from '../../../../core.pck/fields.mod/enums/select-style.enum';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { ErrorHandlerTypeEnum } from '../../../../utilities.pck/error-handler.mod/enums/error-handler-type.enum';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { AuthService } from '../../services/auth.service';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public loginHotelNameSelectType = SelectTypeEnum.DEFAULT;
	public loginHotelNameSelectStyleType = SelectStyleEnum.INFO;
	public loginHotelNameIcons = [faGlobeEurope];
	public languageList: SelectDefaultInterface[] = [];
	public version = '1.0.0';

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _languageListService: LanguageListService,
		private _authService: AuthService,
		private _router: Router,
		private _i18n: I18n
	) {
		// form fields
		this.formFields = new FormGroup({
			languageName: new FormControl(''),
			username: new FormControl('', [
				Validators.required,
				ValidationService.usernameValidator
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			])
		});
	}

	ngOnInit() {
		// set language list
		this.languageList = this._languageListService.getLanguageList();

		// check for language
		this.languageName.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(url => {
				location.href = url;
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
	get languageName() {
		return this.formFields.get('languageName');
	}

	get username() {
		return this.formFields.get('username');
	}

	get password() {
		return this.formFields.get('password');
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
		const formPayload: AuthLoginInterface = {
			username: this.username.value,
			password: this.password.value
		};

		// start login process
		this._authService.authLogin(formPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => {
				let payload = {};

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// response
				switch (res.code) {
					case 'UserNotFoundException':
						// error payload
						payload = {
							type: ErrorHandlerTypeEnum.COMMON_ERROR,
							payload: {
								title: this._i18n({
									value: 'Title: User Not Found Exception',
									id: 'Auth_Login_Form_Error_UserNotFoundException_Title'
								}),
								message: this._i18n({
									value: 'Description: User Not Found Exception',
									id: 'Auth_Login_Form_Error_UserNotFoundException_Description'
								}),
								buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
							}
						};

						// error dispatch
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));
						break;
					case 'UserNotConfirmedException':
						// error payload
						payload = {
							type: ErrorHandlerTypeEnum.COMMON_ERROR,
							payload: {
								title: this._i18n({
									value: 'Title: User Not Confirmed Exception',
									id: 'Auth_Login_Form_Error_UserNotConfirmedException_Title'
								}),
								message: this._i18n({
									value: 'Description: User Not Confirmed Exception',
									id: 'Auth_Login_Form_Error_UserNotConfirmedException_Description'
								}),
								buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
							}
						};

						// error dispatch
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));
						break;
					case 'NotAuthorizedException':
						// error payload
						payload = {
							type: ErrorHandlerTypeEnum.COMMON_ERROR,
							payload: {
								title: this._i18n({
									value: 'Title: User Not Authorized Exception',
									id: 'Auth_Login_Form_Error_NotAuthorizedException_Title'
								}),
								message: this._i18n({
									value: 'Description: User Not Authorized Exception',
									id: 'Auth_Login_Form_Error_NotAuthorizedException_Description'
								}),
								buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
							}
						};

						// error dispatch
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));
						break;
					case 'Ok':
						// todo
						break;
					default:
						// error payload
						const data = {
							type: ErrorHandlerTypeEnum.COMMON_ERROR,
							payload: {
								title: this._i18n({ value: 'Title: Error Generic', id: 'Auth_Login_Form_Error_Generic_Title' }),
								message: this._i18n({
									value: 'Description: Error Generic',
									id: 'Auth_Login_Form_Error_Generic_Description'
								}),
								buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
							}
						};

						// error dispatch
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
				}
			}, () => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// error payload
				const data = {
					type: ErrorHandlerTypeEnum.COMMON_ERROR,
					payload: {
						title: this._i18n({ value: 'Title: Error Generic', id: 'Auth_Login_Form_Error_Generic_Title' }),
						message: this._i18n({
							value: 'Description: Error Generic',
							id: 'Auth_Login_Form_Error_Generic_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					}
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
			});
	}
}
