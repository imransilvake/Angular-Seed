// angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SalutationListService } from '../../../../authorization.mod/services/salutation-list.service';
import { LoadingAnimationService } from '../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectStyleEnum } from '../../../../../core.pck/fields.mod/enums/select-style.enum';

@Component({
	selector: 'app-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss']
})

export class UpdateProfileComponent implements OnInit {
	public formFields;
	public profileIcon = faUser;
	public profileSalutationSelectType = SelectTypeEnum.DEFAULT;
	public profileSalutationSelectStyleType = SelectStyleEnum.INFO;
	public salutationList: SelectDefaultInterface[] = [];

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _salutationList: SalutationListService
	) {
		// form group
		this.formFields = new FormGroup({
			salutation: new FormControl('', [
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
			email: new FormControl({ value: '', disabled: true }, [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// salutation
		this.salutationList = this._salutationList.getSalutationList();
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
		console.log(this.formFields);
	}
}
