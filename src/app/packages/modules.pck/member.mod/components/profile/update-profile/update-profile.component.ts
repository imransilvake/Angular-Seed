// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SalutationListService } from '../../../../authorization.mod/services/salutation-list.service';
import { LoadingAnimationService } from '../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { MemberService } from '../../../services/member.service';
import { UpdateProfileInterface } from '../../../interfaces/update-profile.interface';

@Component({
	selector: 'app-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss']
})

export class UpdateProfileComponent implements OnInit, OnDestroy {
	public formFields;
	public profileSalutationSelectType = SelectTypeEnum.DEFAULT;
	public salutationList: SelectDefaultInterface[] = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _salutationList: SalutationListService,
		private _memberService: MemberService
	) {
		// form group
		this.formFields = new FormGroup({
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
			email: new FormControl({ value: '', disabled: true }, [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// salutation
		this.salutationList = this._salutationList.getSalutationList();

		// listen: profile data event
		this._memberService.memberData
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.profileInfo) {
					this.salutation.setValue(res.profileInfo.gender);
					this.firstName.setValue(res.profileInfo.given_name);
					this.lastName.setValue(res.profileInfo.family_name);
					this.email.setValue(res.profileInfo.email);
				}
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
	get salutation() {
		return this.formFields.get('salutation');
	}

	get firstName() {
		return this.formFields.get('firstName');
	}

	get lastName() {
		return this.formFields.get('lastName');
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
		const formPayload: UpdateProfileInterface = {
			salutation: this.salutation.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value
		};

		// update user profile
		this._memberService.memberUpdateProfile(formPayload);
	}
}
