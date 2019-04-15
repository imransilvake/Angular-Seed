// angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { HotelListService } from '../../services/hotel-list.service';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { SelectStyleEnum } from '../../../../core.pck/fields.mod/enums/select-style.enum';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['../auth.component.scss']
})

export class RegisterComponent implements OnInit {
	public routing = ROUTING;
	public formFields;
	public registerHotelNameSelectType = SelectTypeEnum.DEFAULT;
	public registerHotelNameSelectStyleType = SelectStyleEnum.INFO;
	public registerHotelNameIcons = [faHotel];
	public hotelList: SelectDefaultInterface[] = [];

	constructor(private _hotelListService: HotelListService) {
		// form fields
		this.formFields = new FormGroup({
			hotelName: new FormControl('', [
				Validators.required
			]),
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(30)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(30)
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				ValidationService.passwordValidator
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// set hotel list
		this.hotelList = this._hotelListService.getHotelList();
	}

	/**
	 * setters
	 */
	get hotelName() {
		return this.formFields.get('hotelName');
	}

	get firstName() {
		return this.formFields.get('firstName');
	}

	get lastName() {
		return this.formFields.get('lastName');
	}

	get password() {
		return this.formFields.get('password');
	}

	get email() {
		return this.formFields.get('email');
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// console.info(this.formFields);
	}
}
