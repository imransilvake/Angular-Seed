// angular
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { MemberService } from '../../../services/member.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-profile-modal',
	templateUrl: './profile-modal.component.html',
	styleUrls: ['./profile-modal.component.scss']
})

export class ProfileModalComponent implements OnInit, OnDestroy {
	public faIcons = [faSpinner];
	public previewSource;
	public loading = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _i18n: I18n,
		private _memberService: MemberService,
		public dialogRef: MatDialogRef<ProfileModalComponent>) {
	}

	ngOnInit() {
		// set image
		if (this.data && this.data.image) {
			this.previewSource = this.data.image;
		}

		// listen: on new image upload
		this._memberService.profileImageUpdate
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.loading = false);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this.dialogRef.close();
	}

	/**
	 * upload image to the database
	 */
	public onClickSaveImage() {
		// show spinner and lock button
		this.loading = true;

		// service
		this._memberService.memberChangeImage(this.previewSource, this.dialogRef);
	}
}
