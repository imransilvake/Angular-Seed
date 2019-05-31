// angular
import { Component, EventEmitter, Output } from '@angular/core';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['./hotel-guest-app.component.scss']
})

export class HotelGuestAppComponent {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

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
