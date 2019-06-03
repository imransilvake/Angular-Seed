// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { ClientService } from '../../../../services/client.service';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['./hotel-guest-app.component.scss']
})

export class HotelGuestAppComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public licenseActive = true;
	public modulesList = [];
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// listen: get HGA modules
		this._clientService.clientDataEmitter
			.pipe(
				startWith(0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res =>
				this.modulesList = res.hgaModules ||
					this._clientService.clientData.hgaModules
			);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
