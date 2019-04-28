// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

// app
import { ErrorHandlerComponent } from '../../error-handler.component';
import { ROUTING } from '../../../../../../../environments/environment';

@Component({
	selector: 'app-error-system',
	templateUrl: './error-system.component.html',
	styleUrls: ['../errors.component.scss']
})

export class ErrorSystemComponent {
	@Input() data: any;

	constructor(
		public dialogRef: MatDialogRef<ErrorHandlerComponent>,
		private _router: Router
	) {
	}

	/**
	 * close dialog window
	 */
	public onClickCloseDialog(): void {
		// navigate to login
		this._router.navigate([ROUTING.authorization.login]).then();

		// close dialog
		this.dialogRef.close();
	}
}
