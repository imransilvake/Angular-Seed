// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { DialogComponent } from '../../dialog.component';

@Component({
	selector: 'app-dialog-notice',
	templateUrl: './dialog-notice.component.html',
	styleUrls: ['../dialog-common.component.scss']
})

export class DialogNoticeComponent {
	@Input() data: any;

	constructor(public dialogRef: MatDialogRef<DialogComponent>) {
	}

	/**
	 * close dialog window
	 *
	 * @param {boolean} status
	 */
	public onClickCloseDialog(status?: boolean) {
		this.dialogRef.close(status);
	}
}
