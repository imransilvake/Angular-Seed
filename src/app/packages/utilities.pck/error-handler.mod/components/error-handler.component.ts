// angular
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// app
import { ErrorHandlerTypeEnum } from '../enums/error-handler-type.enum';

@Component({
	selector: 'app-error-handler',
	templateUrl: './error-handler.component.html',
	styleUrls: ['./error-handler.component.scss']
})

export class ErrorHandlerComponent {
	constructor(
		public dialogRef: MatDialogRef<ErrorHandlerComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
	}

	/**
	 * close dialog window
	 *
	 * @param {ErrorHandlerTypeEnum} errorType
	 */
	public onClickCloseDialog(errorType: ErrorHandlerTypeEnum): void {
		this.dialogRef.close(errorType); // close modal
	}
}
