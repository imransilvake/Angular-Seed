// angular
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import * as moment from 'moment';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { BroadcastInterface } from '../../../interfaces/broadcast.interface';
import { BroadcastService } from '../../../services/broadcast.service';
import { DialogTypeEnum } from '../../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../../../utilities.pck/dialog.mod/services/dialog.service';

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
		private _broadcastService: BroadcastService,
		private _i18n: I18n,
		private _dialogService: DialogService
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
			date: new FormControl({ value: '', disabled: true }, [
				Validators.required
			]),
			time: new FormControl('', [
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
		this._broadcastService.formLoadingState
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.loading = false);

		// listen: error message
		this._broadcastService.errorMessage
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

		// payload
		const dialogPayload = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				icon: 'dialog_confirmation',
				title: this._i18n({
					value: 'Title: Broadcast Create Confirmation',
					id: 'Management_BroadcastCreateConfirmation_Form_Success_Title'
				}),
				message: this._i18n({
					value: 'Description: Broadcast Create Confirmation',
					id: 'Management_BroadcastCreateConfirmation_Form_Success_Description'
				}),
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// dialog service
		this._dialogService
			.showDialog(dialogPayload)
			.subscribe((res) => {
				if (res) {
					// concatenate date and time
					const dateStr = formFields.date,
						timeStr = formFields.time,
						date = moment(dateStr),
						time = moment(timeStr, 'HH:mm');

					date.set({
						hour: time.get('hour'),
						minute: time.get('minute'),
						second: time.get('second')
					});

					// utc format
					const utc = date.utc().format();

					// form payload
					const formPayload: BroadcastInterface = {
						Title: formFields.title,
						Text: formFields.description,
						Link: formFields.link,
						Colour: formFields.color,
						SendUser: this._broadcastService.currentUser.profile.email,
						ExpDate: utc
					};

					// service
					this._broadcastService.broadcastCreate(formPayload, this._dialogRef);
				}
			});
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this._dialogRef.close();
	}
}
