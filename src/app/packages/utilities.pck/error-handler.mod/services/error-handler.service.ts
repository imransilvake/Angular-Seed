// angular
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

// store
import { Store } from '@ngrx/store';

// app
import { ErrorHandlerInterface } from '../interfaces/error-handler.interface';
import { ErrorHandlerComponent } from '../components/error-handler.component';
import { LoadingAnimationService } from '../../loading-animation.mod/services/loading-animation.service';

@Injectable()
export class ErrorHandlerService {
	constructor(
		private _dialog: MatDialog,
		private _store: Store<ErrorHandlerInterface>,
		private _loadingAnimationService: LoadingAnimationService
	) {
		// subscribe: error handler
		this._store.select('errorHandler')
			.subscribe((res) => {
				if (res && res.type !== null) {
					// show error
					const dialogRef = this._dialog.open(ErrorHandlerComponent, {
						width: '500px',
						data: res.payload
					});

					// after dialog closed
					dialogRef.afterClosed()
						.subscribe(() => {
							// stop loading animation
							this._loadingAnimationService.stopLoadingAnimation();
						});
				}
			});
	}
}
