// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Router } from '@angular/router';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../../../../core.pck/session.mod/store/actions/session.actions';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { ROUTING } from '../../../../../../environments/environment';
import { InputStyleEnum } from '../../../../core.pck/fields.mod/enums/input-style.enum';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { SessionsEnum } from '../../../../core.pck/session.mod/enums/sessions.enum';
import { SessionInterface } from '../../../../core.pck/session.mod/interfaces/session.interface';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';
import { LocalStorageItems } from '../../../../../../app.config';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-lock-screen',
	templateUrl: './lock-screen.component.html',
	styleUrls: ['./lock-screen.component.scss']
})

export class LockScreenComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public lockPasswordIcons = [faLock, faLockOpen];
	public lockPasswordStyleType = InputStyleEnum.INFO;
	public currentUser;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _store: Store<{ SessionInterface: SessionInterface }>,
		private _storageService: StorageService,
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService,
		private _i18n: I18n,
		private _router: Router
	) {
		// form fields
		this.formFields = new FormGroup({
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				ValidationService.passwordValidator
			])
		});

		// start lock screen session
		this._store.dispatch(new SessionActions.SessionCounterStart(SessionsEnum.SESSION_LOCK_SCREEN));

		// save state to local storage
		this._storageService.put(LocalStorageItems.lockState, { status: 'true' }, StorageTypeEnum.PERSISTANT);
	}

	ngOnInit() {
		// get current user info
		this.currentUser = this._authService.currentUserState
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();

		// stop lock screen session
		this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_LOCK_SCREEN));
	}

	/**
	 * getters
	 */
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

		// validate password
		if (this.password.value === this._authService.currentUserState.profile.password) {
			// authenticate user
			this._authService.authenticateUser()
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => {
					if (res && res.status === 'OK') {
						// remove lock state from local storage
						this._storageService.remove(LocalStorageItems.lockState);

						// navigate to dashboard
						this._router.navigate([ROUTING.dashboard]).then(
							() => this._loadingAnimationService.stopLoadingAnimation()
						);
					} else {
						// logout
						this._authService.logoutUser();

						// stop loading animation
						this._loadingAnimationService.stopLoadingAnimation();
					}
				});
		} else {
			// stop loading animation
			this._loadingAnimationService.stopLoadingAnimation();

			// common error
			const payload = {
				title: this._i18n({
					value: 'Title: Password Invalid Exception',
					id: 'Error_PasswordInvalid_Title'
				}),
				message: this._i18n({
					value: 'Description: Password Invalid Exception',
					id: 'Error_PasswordInvalid_Description'
				}),
				buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
			};
			this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
		}
	}
}
