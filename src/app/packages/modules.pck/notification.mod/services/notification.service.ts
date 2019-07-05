// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import * as moment from 'moment';
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { NotificationsFiltersEnums } from '../enums/notifications-filters.enums';

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
	 *
	 * @param dataPayload
	 */
	public notificationFetchList(dataPayload: any) {
		// filter: open or others
		let uniqueProperty = {};
		if (dataPayload && dataPayload.filter === NotificationsFiltersEnums.OPEN) {
			uniqueProperty = {
				state: dataPayload.filter,
			};
		} else {
			uniqueProperty = {
				type: dataPayload && dataPayload.filter ? dataPayload.filter : 'ALL'
			}
		}

		// validate app state
		if (this.appState.type === AppStateEnum.HOTEL) {
			const api = AppServices['Notifications']['Notifications_List_Hotel'];
			const clearApi = AppServices['Notifications']['Notifications_Update_Hotel'];
			const queryParamsPayload = {
				offset: 0,
				limit: AppOptions.tablePageSizeLimit,
				user: this.currentUser.profile.email,
				date: dataPayload && dataPayload.date ? dataPayload.date : moment().toDate(),
				...uniqueProperty
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
	 * clear all notifications
	 *
	 * @param refreshEmitter
	 * @param payload
	 */
	public notificationClearAll(refreshEmitter: any, payload: any) {
		const clearAllApi = AppServices['Notifications']['Notifications_ClearAll_Hotel'];

		// payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				icon: 'dialog_confirmation',
				title: this._i18n({ value: 'Title: Clear All Confirmation', id: 'Notification_Clear_All_Title' }),
				message: this._i18n({ value: 'Description: Clear All Confirmation', id: 'Notification_Clear_All_Description' }),
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
					const bodyParamsPayload = {
						ConfirmUser: this.currentUser.profile.email
					};

					const payload = {
						pathParams: {
							groupId: this.appState.groupId,
							hotelId: this.appState.hotelId
						},
						bodyParams: bodyParamsPayload
					};

					// service
					this._proxyService
						.postAPI(clearAllApi, payload)
						.subscribe(() => refreshEmitter.emit(payload));
				}
			});
	}

	/**
	 * recognize notification
	 *
	 * @param row
	 * @param refreshEmitter
	 * @param payload
	 */
	public notificationRecognize(row: any, refreshEmitter: any, payload: any) {
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
						.subscribe(() => refreshEmitter.emit(payload));
				}
			});
	}
}
