// angular
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// app
import { ErrorHandlerComponent } from '../../error-handler.component';
import { AuthService } from '../../../../../modules.pck/authorization.mod/services/auth.service';

@Component({
	selector: 'app-error-system',
	templateUrl: './error-system.component.html',
	styleUrls: ['../errors.component.scss']
})

export class ErrorSystemComponent {
	@Input() data: any;

	constructor(
		public dialogRef: MatDialogRef<ErrorHandlerComponent>,
		private _authService: AuthService
	) {
	}

	/**
	 * close dialog window
	 */
	public onClickCloseDialog() {
		// logout
		this._authService.authLogoutUser();

		// close dialog
		this.dialogRef.close();
	}
}
