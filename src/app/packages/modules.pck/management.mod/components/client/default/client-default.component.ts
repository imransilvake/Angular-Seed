// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientService } from '../../../services/client.service';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';

@Component({
	selector: 'app-client-default',
	templateUrl: './client-default.component.html',
	styleUrls: ['./client-default.component.scss']
})

export class ClientDefaultComponent implements OnInit, OnDestroy {
	@Output() onChangeClientView: EventEmitter<any> = new EventEmitter();

	public clientHotelsList;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// listen: fetch client hotels
		this._clientService.clientData
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.clientHotelsList = res.hotelsList);
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
	public onClickShowClientForm(hotelId?: number) {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.FORM,
			hotelId: hotelId
		};
		this.onChangeClientView.emit(payload);
	}
}
