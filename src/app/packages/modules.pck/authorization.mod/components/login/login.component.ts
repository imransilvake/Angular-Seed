// angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { LanguageListService } from '../../services/language-list.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SelectStyleEnum } from '../../../../core.pck/fields.mod/enums/select-style.enum';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth.component.scss']
})

export class LoginComponent implements OnInit {
	public routing = ROUTING;
	public formFields;
	public loginHotelNameSelectType = SelectTypeEnum.DEFAULT;
	public loginHotelNameSelectStyleType = SelectStyleEnum.INFO;
	public loginHotelNameIcons = [faGlobeEurope];
	public languageList: SelectDefaultInterface[] = [];

	constructor(private _languageListService: LanguageListService) {
		// form fields
		this.formFields = new FormGroup({
			languageName: new FormControl(''),
			username: new FormControl('', [
				Validators.required,
				ValidationService.usernameValidator
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(5),
				ValidationService.passwordValidator
			])
		});
	}

	ngOnInit() {
		// set language list
		this.languageList = this._languageListService.getLanguageList();

		// check for language
		this.languageName.valueChanges.subscribe(url => {
			location.href = url;
		});
	}

	/**
	 * setters
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

	get validForm() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// console.info(this.formFields);
	}
}
