// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { MemberService } from '../../../services/member.service';
import { ChangePasswordInterface } from '../../../interfaces/change-password.interface';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnDestroy {
	public formFields;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _memberService: MemberService
	) {
		// form group
		this.formFields = new FormGroup({
			oldPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator
			]),
			confirmPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator,
				ValidationService.confirmPasswordValidator
			])
		});

		// listen to password change: update confirm password
		this.password.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.confirmPassword.updateValueAndValidity());
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get oldPassword() {
		return this.formFields.get('oldPassword');
	}

	get password() {
		return this.formFields.get('password');
	}

	get confirmPassword() {
		return this.formFields.get('confirmPassword');
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
		const formPayload: ChangePasswordInterface = {
			oldPassword: HelperService.hashPassword(this.oldPassword.value),
			newPassword: HelperService.hashPassword(this.password.value)
		};

		// change user password
		this._memberService.memberChangePassword(formPayload);
	}
}
