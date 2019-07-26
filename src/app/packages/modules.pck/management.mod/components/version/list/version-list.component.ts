// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { VersionService } from '../../../services/version.service';
import { VersionViewInterface } from '../../../interfaces/version-view.interface';

@Component({
	selector: 'app-version-list',
	templateUrl: './version-list.component.html',
	styleUrls: ['./version-list.component.scss']
})

export class VersionListComponent implements OnInit {
	@Output() changeVersionView: EventEmitter<any> = new EventEmitter();

	public versionList;
	public versionTable;

	public currentRole: UserRoleEnum;
	public permissionLevel3 = false;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	private buttonType = -1;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _versionService: VersionService,
		private _helperService: HelperService
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._versionService.appState.role;
		if (this.currentRole) {
			this.permissionLevel3 = this._helperService.permissionLevel3(this.currentRole);
		}

		// listen: fetch version list
		this._versionService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set tables data
				if (res && res.versionList) {
					// set tables resources
					this.versionTable = {
						api: this._versionService.tableServices.api,
						searchApi: this._versionService.tableServices.api,
						payload: this._versionService.tableServices.payload,
						uniqueID: this._versionService.tableServices.uniqueID,
						sortDefaultColumn: this._versionService.tableServices.sortDefaultColumn
					};

					// set version list
					this.versionList = res.versionList;
				}
			});
	}

	/**
	 * edit version
	 */
	public onClickEditVersion() {
		this.buttonType = 1;
	}

	/**
	 * delete version
	 */
	public onClickDeleteVersion() {
		this.buttonType = 2;
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// edit version
		if (this.buttonType === 1) {
			// change page view
			this.changePageView(row);
		}

		// delete version
		if (this.buttonType === 2) {
			console.log('ss');
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
		const payload: VersionViewInterface = {
			view: AppViewTypeEnum.FORM,
			data: data ? data : null
		};
		this.changeVersionView.emit(payload);
	}
}
