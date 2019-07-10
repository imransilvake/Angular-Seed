// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { BroadcastService } from '../../../services/broadcast.service';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

@Component({
	selector: 'app-broadcast-list',
	templateUrl: './broadcast-list.component.html',
	styleUrls: ['./broadcast-list.component.scss']
})

export class BroadcastListComponent implements OnInit {
	@Output() changeBroadcastView: EventEmitter<any> = new EventEmitter();

	public broadcastList;
	public broadcastTable;
	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public buttonType = 0;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _broadcastService: BroadcastService
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._broadcastService.appState.role;

		// listen: fetch broadcast list
		this._broadcastService.broadcastDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set tables resources
				this.broadcastTable = {
					api: this._broadcastService.broadcastTablesServices.api,
					searchApi: this._broadcastService.broadcastTablesServices.api,
					payload: this._broadcastService.broadcastTablesServices.payload,
					uniqueID: this._broadcastService.broadcastTablesServices.uniqueID,
					sortDefaultColumn: this._broadcastService.broadcastTablesServices.sortDefaultColumn
				};

				// set tables data
				if (res && res.broadcastList) {
					this.broadcastList = res.broadcastList;
				}
			});
	}

	/**
	 * resend broadcast
	 */
	public onClickResendBroadcast() {
		this.buttonType = 1;
	}

	/**
	 * broadcast row
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// resend broadcast
		if (this.buttonType === 1) {
			// reset
			this.buttonType = 0;

			// change page view
			this.changePageView(row);
		}
	}

	/**
	 * change page view
	 *
	 * @param data
	 */
	public changePageView(data?: any) {
		// payload
		const payload: UserViewInterface = {
			view: AppViewTypeEnum.FORM,
			data: data ? data : null
		};
		this.changeBroadcastView.emit(payload);
	}
}
