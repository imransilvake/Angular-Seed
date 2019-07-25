// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { ClientService } from '../../../services/client.service';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-client-list',
	templateUrl: './client-list.component.html',
	styleUrls: ['./client-list.component.scss']
})

export class ClientListComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public overrideState = false;
	public clientGroupHotelsList;
	public clientsTable;

	public currentRole: UserRoleEnum;
	public permissionLevel2 = false;
	public permissionLevel3 = false;
	public permissionLevel4 = false;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	private buttonType = -1;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _clientService: ClientService,
		private _helperService: HelperService,
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._clientService.appState && this._clientService.appState.role;
		if (this.currentRole) {
			this.permissionLevel2 = this._helperService.permissionLevel2(this.currentRole);
			this.permissionLevel3 = this._helperService.permissionLevel3(this.currentRole);
			this.permissionLevel4 = this._helperService.permissionLevel4(this.currentRole);
		}

		// listen: get client hotels
		this._clientService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set table data
				if (res && res.hotelGroupList) {
					// set tables resources
					this.clientsTable = {
						api: this._clientService.tableServices.hotelsByGroup,
						searchApi: this._clientService.tableServices.hotelsByGroup,
						payload: this._clientService.tableServices.payload,
						uniqueID: this._clientService.tableServices.uniqueID
					};

					// set override state
					this.overrideState = res.hgaOverride && res.hgaOverride.HotelManagerOverride;

					// set hotel group list
					this.clientGroupHotelsList = res.hotelGroupList;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * create hotel group
	 */
	public onClickCreateHotelGroup() {
		this.buttonType = 0;

		// change page view
		this.changePageView({
			id: null,
			name: null
		});
	}

	/**
	 * edit hotel group
	 */
	public onClickEditHotelGroup() {
		this.buttonType = 1;
	}

	/**
	 * show client form
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// edit hotel group
		if (this.buttonType === 1) {
			// group name
			const groupName = this.clientGroupHotelsList.data
				.filter(res => res.Id === row.Id)
				.map(group => group.Name)[0];

			// change page view
			this.changePageView({
				id: row.Id,
				name: groupName
			});
		}

		// reset
		this.buttonType = -1;
	}

	/**
	 * change page view
	 *
	 * @param data
	 */
	public changePageView(data?: any) {
		// payload
		const payload: ClientViewInterface = {
			view: AppViewTypeEnum.FORM,
			id: data.id,
			name: data.name
		};
		this.changeClientView.emit(payload);
	}
}
