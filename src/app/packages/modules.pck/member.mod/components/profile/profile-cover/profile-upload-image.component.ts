// angular
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { MemberService } from '../../../services/member.service';

@Component({
	selector: 'app-profile-upload-image',
	templateUrl: './profile-upload-image.component.html',
	styleUrls: ['./profile-upload-image.component.scss']
})

export class ProfileUploadImageComponent {
	public fileFormats = ['image/jpeg', 'image/jpg'];
	public maxFileSize = 1024;
	public previewSrc;
	public errorMessage;

	constructor(
		private _memberService: MemberService,
		public dialogRef: MatDialogRef<ProfileUploadImageComponent>) {
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this.dialogRef.close();
	}

	/**
	 * listener: drop over
	 *
	 * @param $event
	 */
	public onDragOver($event) {
		$event.stopPropagation();
		$event.preventDefault();
	}

	/**
	 * listener: runs when file drops on the drop area
	 *
	 * @param $event
	 */
	public onDrop($event) {
		$event.stopPropagation();
		event.preventDefault();

		const transfer = $event.dataTransfer;
		const file = transfer.files[0];

		// set file
		this.setFile(file);
	}

	/**
	 * selected file
	 *
	 * @param file
	 */
	public setFile(file) {
		if (file) {
			const fileType = file.type;
			const fileSize = file.size / 1000;

			// validate file-format
			if (this.fileFormats.includes(fileType)) {
				// validate file-size
				if (fileSize <= this.maxFileSize) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						this.previewSrc = reader.result;
						this.errorMessage = null;
					};
				} else {
					this.previewSrc = null;
					this.errorMessage = 'Filesize is greater than 1MB!';
				}
			} else {
				this.previewSrc = null;
				this.errorMessage = 'Wrong file format!';
			}
		}
	}

	/**
	 * upload image to the database
	 */
	public onClickSaveImage() {
		this._memberService.memberChangeImage(this.previewSrc, this.dialogRef);
	}
}
