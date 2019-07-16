// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';
import { GuestNotificationTypeEnum } from '../enums/guest-notification-type.enum';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { PushMessageInterface } from '../interfaces/push-message.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { GuestPushMessageViewInterface } from '../interfaces/guest-push-message-view.interface';

@Injectable()
export class PushMessageService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _loadingAnimationService: LoadingAnimationService
	) {
	}

	/**
	 * fetch periodic / recently sent guest notifications
	 *
	 * @param id
	 * @param type
	 */
	public guestNotificationsFetch(id: number, type: GuestNotificationTypeEnum) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Guest']['Guest_Notifications_List_Hotel'];

		// payload
		let payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeLimit,
				type: GuestTypeEnum.NOTIFICATION,
				column: 'CreateDate',
				sort: 'desc'
			}
		};

		switch (type) {
			case GuestNotificationTypeEnum.PERIODIC:
				// set table resources
				this.tableServices = {
					...this.tableServices,
					periodic : {
						api: api,
						payload: payload,
						uniqueID: 'ID',
						sortDefaultColumn: 'CreateDate'
					}
				};
				break;
			case GuestNotificationTypeEnum.RECENT:
				payload = {
					...payload,
					queryParams: {
						...payload.queryParams,
						trigger: 'ADHOC'
					}
				};

				// set table resources
				this.tableServices = {
					...this.tableServices,
					recent : {
						api: api,
						payload: payload,
						uniqueID: 'ID',
						sortDefaultColumn: 'SendDate'
					}
				};
				break;
		}

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}

	/**
	 * delete periodic notification
	 *
	 * @param row
	 * @param refreshEmitter
	 */
	public guestDeletePeriodicNotification(row: any, refreshEmitter: any) {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				title: this._i18n({ value: 'Title: Delete Push Notification', id: 'Guest_Push_Periodic_Notification_Delete_Title' }),
				message: this._i18n({ value: 'Description: Delete Push Notification', id: 'Guest_Push_Periodic_Notification_Delete_Description' }),
				icon: 'dialog_confirmation',
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.subscribe(res => {
				if (res) {
					// payload
					const payload: any = {
						pathParams: {
							groupId: this.appState.groupId,
							hotelId: this.appState.hotelId
						},
						bodyParams: {
							ID: row.ID
						}
					};

					// service
					this._proxyService
						.postAPI(AppServices['Guest']['Guest_Notifications_Remove_Hotel'], payload)
						.subscribe(() => {
							// payload
							const dialogPayload = {
								type: DialogTypeEnum.NOTICE,
								payload: {
									title: this._i18n({ value: 'Title: Push Message Deleted', id: 'Guest_Push_Message_Form_Success_Deleted_Title' }),
									message: this._i18n({
										value: 'Description: Push Message Deleted',
										id: 'Guest_Push_Message_Form_Success_Deleted_Description'
									}),
									icon: 'dialog_tick',
									buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
								}
							};

							// listen: dialog service
							this._dialogService
								.showDialog(dialogPayload)
								.subscribe(() => refreshEmitter.emit());
						});
				}
			});
	}

	/**
	 * form languages
	 *
	 * @param pageView
	 */
	public guestFormLanguagesFetch(pageView: AppViewTypeEnum) {
		if (pageView === AppViewTypeEnum.DEFAULT) {
			return of(null);
		}

		// payload
		const payload = {
			pathParams: {
				groupId: this.appState.groupId
			}
		};

		// service
		return this._proxyService
			.getAPI(AppServices['Guest']['Guest_Notifications_Form_Group'], payload)
			.pipe(map(res => res));
	}

	/**
	 * create / update push message
	 *
	 * @param formPayload
	 * @param isEditForm
	 * @param changePageView
	 */
	public guestUpdatePushMessage(formPayload: PushMessageInterface, isEditForm: boolean, changePageView: any) {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// api
		const api = isEditForm ? AppServices['Guest']['Guest_Notifications_Form_Update_Hotel'] : AppServices['Guest']['Guest_Notifications_Form_Create_Hotel'];

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			bodyParams: formPayload
		};

		// service
		this._proxyService.postAPI(api, payload)
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				const text = isEditForm ? {
					title: this._i18n({ value: 'Title: Push Message Updated', id: 'Guest_Push_Message_Form_Success_Updated_Title' }),
					message: this._i18n({
						value: 'Description: Notification Updated',
						id: 'Guest_Push_Message_Form_Success_Updated_Description'
					}),
				} : {
					title: this._i18n({ value: 'Title: Push Message Created', id: 'Guest_Push_Message_Form_Success_Created_Title' }),
					message: this._i18n({
						value: 'Description: Notification Created',
						id: 'Guest_Push_Message_Form_Success_Created_Description'
					}),
				};

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						...text,
						icon: 'dialog_tick',
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// listen: dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => {
						const viewPayload: GuestPushMessageViewInterface = {
							view: AppViewTypeEnum.DEFAULT
						};
						changePageView.emit(viewPayload);
					});
			});
	}
}
