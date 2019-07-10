// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { ClientService } from '../../../services/client.service';

@Component({
	selector: 'app-client-form',
	templateUrl: './client-form.component.html',
	styleUrls: ['./client-form.component.scss']
})

export class ClientFormComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();
	@Output() updateViewOnNewGroup: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() groupName;

	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._clientService.appState.role;

		// listen: update group id when new group is created
		this._clientService.newlyCreatedGroupId
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// update group id
				this.id = res;

				// trigger form services
				const payload: ClientViewInterface = {
					id: res
				};
				this.updateViewOnNewGroup.emit(payload);
			});
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
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
