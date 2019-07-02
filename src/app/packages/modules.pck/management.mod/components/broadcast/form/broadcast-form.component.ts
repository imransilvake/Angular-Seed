// angular
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';

@Component({
	selector: 'app-broadcast-form',
	templateUrl: './broadcast-form.component.html',
	styleUrls: ['./broadcast-form.component.scss']
})

export class BroadcastFormComponent implements OnInit, OnDestroy {
	public faIcons = [faSpinner];
	public formFields;
	public currentRole;
	public minDate = moment(moment()).add(1, 'days').toDate();
	public formTitle = 'Create';
	public errorMessage;
	public loading = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public _dialogRef: MatDialogRef<BroadcastFormComponent>,
		private _proxyService: ProxyService,
		private _userService: UserService
	) {
		// form group
		this.formFields = new FormGroup({
			title: new FormControl('', [
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(128)
			]),
			description: new FormControl('', [
				Validators.required,
				Validators.maxLength(5000)
			]),
			link: new FormControl('', [
				ValidationService.urlValidator
			]),
			color: new FormControl('#71c578', [
				Validators.required
			]),
			date:  new FormControl({ value: '', disabled: true }, [
				Validators.required
			]),
			time:  new FormControl('', [
				Validators.required,
				ValidationService.timeValidator
			])
		});
	}

	ngOnInit() {
		// fill form with data
		if (this.data) {
			// change form title
			this.formTitle = 'Resend';

			// title
			this.title.setValue(this.data.Title);

			// description
			this.description.setValue(this.data.Text);
		}

		// listen: form loading state
		this._userService.formLoadingState
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.loading = false);

		// listen: error message
		this._userService.errorMessage
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// update loading state
				this.loading = false;

				// error message
				this.errorMessage = res;
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
	get title() {
		return this.formFields.get('title');
	}

	get description() {
		return this.formFields.get('description');
	}

	get link() {
		return this.formFields.get('link');
	}

	get color() {
		return this.formFields.get('color');
	}

	get date() {
		return this.formFields.get('date');
	}

	get time() {
		return this.formFields.get('time');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		const formFields = this.formFields.getRawValue();
		console.log(formFields);
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this._dialogRef.close();
	}
}
