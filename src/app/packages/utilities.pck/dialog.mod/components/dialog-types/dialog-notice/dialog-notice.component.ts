// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { DialogComponent } from '../../dialog.component';
import { LoadingAnimationService } from '../../../../loading-animation.mod/services/loading-animation.service';

@Component({
	selector: 'app-dialog-notice',
	templateUrl: './dialog-notice.component.html',
	styleUrls: ['./dialog-notice.component.scss']
})

export class DialogNoticeComponent {
	@Input() data: any;

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		public dialogRef: MatDialogRef<DialogComponent>
	) {
	}

	/**
	 * close dialog window
	 *
	 * @param {boolean} status
	 */
	public onClickCloseDialog(status?: boolean): void {
		if (status) {
			// start loading animation
			this._loadingAnimationService.startLoadingAnimation();
		}

		// close modal
		this.dialogRef.close(status);
	}
}
