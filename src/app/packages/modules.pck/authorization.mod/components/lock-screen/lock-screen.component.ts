// angular
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

// store
import { Store } from '@ngrx/store';

// app
import * as SessionActions from '../../../../core.pck/session.mod/store/actions/session.actions';
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
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { RouterService } from '../../../../utilities.pck/accessories.mod/services/router-service';

@Component({
	selector: 'app-lock-screen',
	templateUrl: './lock-screen.component.html',
	styleUrls: ['./lock-screen.component.scss']
})

export class LockScreenComponent implements OnInit, AfterViewInit, OnDestroy {
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
		private _router: Router,
		private _routerService: RouterService
	) {
		// form fields
		this.formFields = new FormGroup({
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			])
		});

		// start lock screen session
		this._store.dispatch(new SessionActions.SessionCounterStart(SessionsEnum.SESSION_LOCK_SCREEN));
	}

	ngOnInit() {
		// get current user info
		this.currentUser = this._authService.currentUserState;
	}

	ngAfterViewInit() {
		// check previous url and save to local storage
		if (!this._storageService.exist(LocalStorageItems.lockState, StorageTypeEnum.PERSISTANT)) {
			this._storageService.put(LocalStorageItems.lockState, { url: this._routerService.previousUrl }, StorageTypeEnum.PERSISTANT);
		}
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

		// current user
		const currentUser = this._authService.currentUserState;

		// validate password
		if (!currentUser) {
			// logout
			this._authService.logoutUser();

			// stop loading animation
			this._loadingAnimationService.stopLoadingAnimation();
		} else if (currentUser && (HelperService.hashPassword(this.password.value) === currentUser.profile.password)) {
			// authenticate user
			this._authService.authenticateUser()
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => {
					if (res && res.status === 'OK') {
						// remove lock state from local storage
						this._storageService.remove(LocalStorageItems.lockState);

						// navigate to dashboard
						// stop loading animation
						this._router.navigate([this._routerService.previousUrl])
							.then(() =>
								this._loadingAnimationService.stopLoadingAnimation()
							);
					} else {
						// logout
						this._authService.logoutUser();

						// stop loading animation
						this._loadingAnimationService.stopLoadingAnimation();
					}
				});
		} else {
			// payload
			const formPayload: AuthLoginInterface = {
				username: currentUser.profile.email,
				password: HelperService.hashPassword(this.password.value)
			};

			// start login process
			this._authService.authLogin(formPayload, currentUser.rememberMe);
		}
	}
}
