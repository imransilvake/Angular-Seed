// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// app
import { DialogComponent } from '../../dialog.component';

@Component({
	selector: 'app-dialog-confirmation',
	templateUrl: './dialog-confirmation.component.html',
	styleUrls: ['../dialog-common.component.scss']
})

export class DialogConfirmationComponent {
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
