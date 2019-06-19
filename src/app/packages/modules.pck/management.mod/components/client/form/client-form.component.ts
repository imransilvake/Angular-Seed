// angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { ClientService } from '../../../services/client.service';

@Component({
	selector: 'app-client-form',
	templateUrl: './client-form.component.html',
	styleUrls: ['./client-form.component.scss']
})

export class ClientFormComponent implements OnInit {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();
	@Input() id;

	public currentUserRole: UserRoleEnum;
	public userRoleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// set current user role
		this.currentUserRole = this._clientService.appState.role;
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
