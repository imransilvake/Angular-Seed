// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material';

// store
import { Store } from '@ngrx/store';

// app
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LanguageListService } from '../../services/language-list.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SelectStyleEnum } from '../../../../core.pck/fields.mod/enums/select-style.enum';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { AuthService } from '../../services/auth.service';

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
	public rememberMe: MatCheckboxChange;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _languageListService: LanguageListService,
		private _authService: AuthService,
		private _router: Router
	) {
		// form fields
		this.formFields = new FormGroup({
			languageName: new FormControl(''),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
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

	get email() {
		return this.formFields.get('email');
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
			username: this.email.value,
			password: this.password.value
		};

		// start login process
		this._authService.authLogin(formPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => {
				// set current user state
				this._authService.currentUserState = {
					profile: formPayload,
					credentials: {
						accessToken: res.accessToken.jwtToken,
						idToken: res.idToken.jwtToken,
						refreshToken: res.refreshToken.token
					},
					rememberMe: this.rememberMe && this.rememberMe.checked
				};

				// navigate to dashboard
				this._router
					.navigate([ROUTING.dashboard])
					.then(() =>
						this._loadingAnimationService.stopLoadingAnimation()
					);
			});
	}
}
