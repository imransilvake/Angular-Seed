// angular
import { Component, EventEmitter, Input, Output } from '@angular/core';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';

@Component({
	selector: 'app-client-form',
	templateUrl: './client-form.component.html',
	styleUrls: ['./client-form.component.scss']
})

export class ClientFormComponent {
	@Input() hotelId;
	@Output() onChangeClientView: EventEmitter<any> = new EventEmitter();

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.onChangeClientView.emit(payload);
	}
}
