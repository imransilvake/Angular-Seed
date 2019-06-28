// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

// app
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';

@Component({
	selector: 'app-broadcast-default',
	templateUrl: './broadcast-default.component.html',
	styleUrls: ['./broadcast-default.component.scss']
})

export class BroadcastDefaultComponent implements OnInit {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();

	public broadcastTable;
	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(

	) {
	}

	ngOnInit() {
	}
}
