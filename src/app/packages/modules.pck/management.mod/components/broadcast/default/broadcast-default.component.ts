// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
	selector: 'app-broadcast-default',
	templateUrl: './broadcast-default.component.html',
	styleUrls: ['./broadcast-default.component.scss']
})

export class BroadcastDefaultComponent implements OnInit {
	@Output() changeBroadcastView: EventEmitter<any> = new EventEmitter();

	public broadcastList;
	public broadcastTable;
	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public buttonType;

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
				console.log(res);
			});
	}

	/**
	 * create new broadcast
	 */
	public onClickCreateNewBroadcast() {

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
			console.log(row);
		}
	}
}
