// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { DialogComponent } from '../../dialog.component';
import { LoadingAnimationService } from '../../../../loading-animation.mod/services/loading-animation.service';

@Component({
	selector: 'app-dialog-confirmation',
	templateUrl: './dialog-confirmation.component.html',
	styleUrls: ['./dialog-confirmation.component.scss']
})

export class DialogConfirmationComponent {
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
	public onClickCloseDialog(status?: boolean) {
		if (status) {
			// start loading animation
			this._loadingAnimationService.startLoadingAnimation();
		}

		// close modal
		this.dialogRef.close(status);
	}
}
