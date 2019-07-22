// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { HelperService } from '../../../packages/utilities.pck/accessories.mod/services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit, OnDestroy {
	@Input() fileFormats = ['image/jpeg', 'image/jpg', 'image/png'];
	@Input() maxFileSize = 1024;
	@Input() dimensionSize = 1;
	@Input() image;
	@Output() preview: EventEmitter<any> = new EventEmitter();

	public errorMessage;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _i18n: I18n) {
	}

	ngOnInit() {
		// listen: image preview
		this.preview
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.image = res);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * listener: drop over
	 *
	 * @param $event
	 */
	public onDragOver($event) {
		HelperService.stopPropagation($event);
		HelperService.preventDefault($event);
	}

	/**
	 * listener: runs when file drops on the drop area
	 *
	 * @param $event
	 */
	public onDrop($event) {
		HelperService.stopPropagation($event);
		HelperService.preventDefault($event);

		const transfer = $event.dataTransfer;
		const file = transfer.files[0];

		// set file
		this.setFilePreview(file);
	}

	/**
	 * selected file
	 *
	 * @param file
	 */
	public setFilePreview(file) {
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
						this.preview.emit(reader.result);
						this.errorMessage = null;
					};
				} else {
					this.preview.emit(null);
					this.errorMessage = this._i18n({
						value: 'Description: FileSize Error',
						id: 'Upload_Image_Error_FileSize'
					});
				}
			} else {
				this.preview.emit(null);
				this.errorMessage = this._i18n({
					value: 'Description: Wrong Format Error',
					id: 'Upload_Image_Error_Wrong_Format'
				});
			}
		}
	}
}
