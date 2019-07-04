// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable()
export class NotificationService {
	public currentUser;
	public appState;
	public notificationTablesServices;
	public notificationDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _dialogService: DialogService,
		private _i18n: I18n
	) {
	}

	/**
	 * fetch notification list
	 */
	public notificationFetchList() {
		// validate app state
		if (this.appState.type === AppStateEnum.HOTEL) {
			const api = AppServices['Notifications']['Notifications_List_Hotel'];
			const clearApi = AppServices['Notifications']['Notifications_Update_Hotel'];
			const queryParamsPayload = {
				offset: 0,
				limit: AppOptions.tablePageSizeLimit,
				user: this.currentUser.profile.email,
				type: 'ALL',
				date: '07/04/2019'
			};

			const payload = {
				pathParams: {
					groupId: this.appState.groupId,
					hotelId: this.appState.hotelId
				},
				queryParams: queryParamsPayload
			};

			// set table resources
			this.notificationTablesServices = {
				api: api,
				clearApi: clearApi,
				payload: payload,
				uniqueID: 'Id'
			};

			// service
			return this._proxyService
				.getAPI(api, payload)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}

	/**
	 * recognize notification
	 *
	 * @param row
	 * @param rowClearEmitter
	 */
	public recognizeNotification(row: any, rowClearEmitter: any) {
		const clearApi = AppServices['Notifications']['Notifications_Update_Hotel'];

		// payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				icon: 'dialog_confirmation',
				title: this._i18n({ value: 'Title: Recognize Row Confirmation', id: 'Notification_Recognize_Row_Title' }),
				message: this._i18n({ value: 'Description: Recognize Row Confirmation', id: 'Notification_Recognize_Row_Description' }),
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					})
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.subscribe(status => {
				if (status) {
					const bodyParamsPayload = [{
						Id: row.Id,
						State: row.State,
						ConfirmUser: this.currentUser.profile.email
					}];

					const payload = {
						pathParams: {
							groupId: this.appState.groupId,
							hotelId: this.appState.hotelId
						},
						bodyParams: bodyParamsPayload
					};

					// service
					this._proxyService
						.postAPI(clearApi, payload)
						.subscribe(() => rowClearEmitter.emit());
				}
			});
	}
}
