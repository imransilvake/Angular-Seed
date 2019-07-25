// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { GuestOfferInterface } from '../interfaces/guest-offer.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { GuestViewInterface } from '../interfaces/guest-view.interface';
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { UtilityService } from '../../../utilities.pck/accessories.mod/services/utility.service';

@Injectable()
export class GuestOffersService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _utilityService: UtilityService,
		private _loadingAnimationService: LoadingAnimationService
	) {
	}

	/**
	 * fetch active hotel offers
	 *
	 * @param id
	 */
	public guestHotelOffersFetch(id: number) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Content']['Guest_Offers_And_Notifications_List_Hotel'];
		const updateApi = AppServices['Content']['Guest_Offers_And_Notifications_Form_Update_Hotel'];

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeWithoutLimit,
				type: GuestTypeEnum.OFFER,
				column: 'Sort',
				sort: 'desc'
			}
		};

		// set table resources
		this.tableServices = {
			api: api,
			dragApi: updateApi,
			payload: payload,
			uniqueID: 'ID',
			sortDefaultColumn: 'Sort'
		};

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}

	/**
	 * delete guest offer
	 *
	 * @param row
	 * @param refreshEmitter
	 */
	public guestRemoveOffer(row: any, refreshEmitter: any) {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				title: this._i18n({ value: 'Title: Delete Guest Offer', id: 'Guest_Offer_Delete_Title' }),
				message: this._i18n({ value: 'Description: Delete Guest Offer', id: 'Guest_Offer_Delete_Description' }),
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
						.postAPI(AppServices['Content']['Guest_Offers_And_Notifications_Remove_Hotel'], payload)
						.pipe(delay(1000))
						.subscribe(() => refreshEmitter.emit());
				}
			});
	}

	/**
	 * create / update guest offer
	 *
	 * @param formPayload
	 * @param rowData
	 * @param changePageView
	 */
	public guestUpdateOffer(formPayload: GuestOfferInterface, rowData: any, changePageView: any) {
		const isEditForm = !!rowData;

		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// api
		const api = isEditForm ? AppServices['Content']['Guest_Offers_And_Notifications_Form_Update_Hotel'] : AppServices['Content']['Guest_Offers_And_Notifications_Form_Create_Hotel'];

		// payload
		let payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			bodyParams: formPayload
		};

		// extra payload for image upload
		const extra = isEditForm && rowData.Data && rowData.Data.Image ? {
			oldImage: rowData.Data.Image,
			type: formPayload.Type
		} : {
			type: formPayload.Type
		};

		// upload image
		const imageSource = formPayload.Image && formPayload.Image.length > 200 ? this._utilityService.uploadImage(formPayload.Image, extra) : of(null);
		imageSource.subscribe((res) => {
			// add image to payload
			payload = res && res.name ? {
				...payload,
				bodyParams: {
					...payload.bodyParams,
					Image: res.name
				}
			} : payload;

			// service: update data
			this._proxyService.postAPI(api, payload)
				.pipe(delay(1000))
				.subscribe(() => {
					// stop loading animation
					this._loadingAnimationService.stopLoadingAnimation();

					const text = isEditForm ? {
						title: this._i18n({ value: 'Title: Offer Updated', id: 'Guest_Offers_Form_Success_Updated_Title' }),
						message: this._i18n({
							value: 'Description: Offer Updated',
							id: 'Guest_Offers_Form_Success_Updated_Description'
						}),
					} : {
						title: this._i18n({ value: 'Title: Offer Created', id: 'Guest_Offers_Form_Success_Created_Title' }),
						message: this._i18n({
							value: 'Description: Offer Created',
							id: 'Guest_Offers_Form_Success_Created_Description'
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
							const viewPayload: GuestViewInterface = {
								view: AppViewTypeEnum.DEFAULT
							};
							changePageView.emit(viewPayload);
						});
				});
		});
	}
}
