// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientService } from '../../../services/client.service';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { AppOptions } from '../../../../../../../app.config';

@Component({
	selector: 'app-client-default',
	templateUrl: './client-default.component.html',
	styleUrls: ['./client-default.component.scss']
})

export class ClientDefaultComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public overrideState = false;
	public clientGroupHotelsList;
	public tablePageSize = AppOptions.tablePageSizeLimit - 1;
	public tableApiUrl;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// set table api
		this.tableApiUrl = this._clientService.clientTablesServices &&
			this._clientService.clientTablesServices.hotelsByGroup;

		// listen: get client hotels
		this._clientService.clientDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set override state
				this.overrideState = res.hgaOverride && res.hgaOverride.HotelManagerOverride;

				// set
				this.clientGroupHotelsList = res.hotelGroupList ||
					this._clientService.clientData && this._clientService.clientData.hotelGroupList;
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * show client form
	 *
	 * @param id
	 */
	public onClickFetchId(id?: string) {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.FORM,
			id: id
		};
		this.changeClientView.emit(payload);
	}
}
