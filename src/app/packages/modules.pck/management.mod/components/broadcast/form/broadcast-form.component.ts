// angular
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { UserService } from '../../../services/user.service';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-broadcast-form',
	templateUrl: './broadcast-form.component.html',
	styleUrls: ['./broadcast-form.component.scss']
})

export class BroadcastFormComponent implements OnInit, OnDestroy {
	public faIcons = [faSpinner];
	public formFields;
	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
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
			])
		});
	}

	ngOnInit() {
		// fill form with data
		if (this.data) {
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
		this._dialogRef.close();
	}
}
