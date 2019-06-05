// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientService } from '../../../services/client.service';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { AppOptions, AppServices } from '../../../../../../../app.config';

@Component({
	selector: 'app-client-default',
	templateUrl: './client-default.component.html',
	styleUrls: ['./client-default.component.scss']
})

export class ClientDefaultComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public clientHotelsList;
	public tablePageSize = AppOptions.tablePageSizeLimit - 1;
	public tableApiUrl = AppServices['Management']['Client_HotelGroup_List'];
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// listen: get client hotels
		this._clientService.clientDataEmitter
			.pipe(
				startWith(0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res =>
				this.clientHotelsList = res.hotelGroupList ||
					this._clientService.clientData && this._clientService.clientData.hotelGroupList
			);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * show client form
	 *
	 * @param hotelId
	 */
	public onClickFetchId(hotelId?: string) {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.FORM,
			hotelId: hotelId
		};
		this.changeClientView.emit(payload);
	}
}
