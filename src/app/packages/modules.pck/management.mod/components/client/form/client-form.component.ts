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
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();
	@Input() hotelId;

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
