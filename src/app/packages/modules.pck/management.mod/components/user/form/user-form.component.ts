// angular
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { UserService } from '../../../services/user.service';

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
	public currentRole;
	public roleList: SelectDefaultInterface[] = [];
	public errorMessage;

	constructor(
		private _userService: UserService,
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
			]),
			role: new FormControl('', [
				Validators.required
			]),
			hotels: new FormControl('', [
				Validators.required
			])
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._userService.appState.role;

		// set language list
		this.languageList = this._utilityService.getAuthLanguageList();

		// set salutation list
		this.salutationList = this._utilityService.getSalutationList();

		// set salutation list
		this.roleList = this._utilityService.userRoleList;

		// fill form with data
		if (this.data) {
			// language
			if (this.data.Language) {
				const language = this.languageList.filter(item => item.id === this.data.Language.toLowerCase());
				this.languageName.setValue(...language);
			}

			// salutation
			if (this.data.Gender) {
				const salutation = this.salutationList.filter(item => item.id === this.data.Gender.toLowerCase());
				this.salutation.setValue(...salutation);
			}

			// update form
			this.firstName.setValue(this.data.Lastname);
			this.lastName.setValue(this.data.Lastname);
			this.email.setValue(this.data.Email);
			this.email.disable();

			// role
			if (this.currentRole === UserRoleEnum[UserRoleEnum.GROUP_MANAGER]) {
				this.roleList = this.roleList.slice(1, 5);
			}

			if (this.currentRole === UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]) {
				this.roleList = this.roleList.slice(2, 5);
			}

			if (this.data.Role) {
				//const roleId = this.data.Role.replace(' ', '_').toUpperCase();
				//this.role.setValue(roleId);
				//console.log(this.roleList, this.role.value, roleId);
			}

			// hotels is disabled initially
			this.hotels.disable();
		}
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

	get role() {
		return this.formFields.get('role');
	}

	get hotels() {
		return this.formFields.get('hotels');
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
