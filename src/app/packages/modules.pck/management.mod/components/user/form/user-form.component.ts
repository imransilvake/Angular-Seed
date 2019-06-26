// angular
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent {
	public formFields;
	public selectType = SelectTypeEnum.DEFAULT;
	public languageList: SelectDefaultInterface[] = [];
	public salutationList: SelectDefaultInterface[] = [];
	public errorMessage;

	constructor(
		private _utilityService: UtilityService,
		public dialogRef: MatDialogRef<UserFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		// form group
		this.formFields = new FormGroup({
			languageName: new FormControl('', [
				Validators.required
			]),
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
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// set language list
		this.languageList = this._utilityService.getAuthLanguageList();

		// set salutation list
		this.salutationList = this._utilityService.getSalutationList();
	}

	/**
	 * getters
	 */
	get languageName() {
		return this.formFields.get('languageName');
	}

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
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this.dialogRef.close();
	}
}
