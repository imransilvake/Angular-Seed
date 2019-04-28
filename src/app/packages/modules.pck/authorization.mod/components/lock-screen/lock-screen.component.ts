// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { InputStyleEnum } from '../../../../core.pck/fields.mod/enums/input-style.enum';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { SessionsEnum } from '../../../../core.pck/session.mod/enums/sessions.enum';
import { SessionInterface } from '../../../../core.pck/session.mod/interfaces/session.interface';
import * as SessionActions from '../../../../core.pck/session.mod/store/actions/session.actions';

@Component({
	selector: 'app-lock-screen',
	templateUrl: './lock-screen.component.html',
	styleUrls: ['./lock-screen.component.scss']
})

export class LockScreenComponent implements OnDestroy {
	public routing = ROUTING;
	public formFields;
	public lockPasswordIcons = [faLock, faLockOpen];
	public lockPasswordStyleType = InputStyleEnum.INFO;

	constructor(private _store: Store<{ SessionInterface: SessionInterface }>) {
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
	}

	ngOnDestroy() {
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
		// console.info(this.formFields);
	}
}
