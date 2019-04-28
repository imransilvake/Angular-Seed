// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { ErrorHandlerComponent } from '../../error-handler.component';

@Component({
	selector: 'app-error-common',
	templateUrl: './error-common.component.html',
	styleUrls: ['../errors.component.scss']
})

export class ErrorCommonComponent {
	@Input() data: any;

	constructor(public dialogRef: MatDialogRef<ErrorHandlerComponent>) {
	}

	/**
	 * close dialog window
	 *
	 * @param status
	 */
	public onClickCloseDialog(status?: boolean): void {
		this.dialogRef.close(status);
	}
}
