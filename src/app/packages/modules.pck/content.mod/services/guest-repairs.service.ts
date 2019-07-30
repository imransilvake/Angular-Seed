// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { GuestRepairInterface } from '../interfaces/guest-repair.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../../app.config';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { map } from 'rxjs/operators';

@Injectable()
export class GuestRepairsService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor(
		private _proxyService: ProxyService,
		private _loadingAnimationService: LoadingAnimationService,
		private _i18n: I18n,
		private _dialogService: DialogService
	) {
	}

	/**
	 * fetch guest repair categories
	 *
	 * @param id
	 */
	public guestRepairsFetch(id: number) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Content']['Guest_Repairs_Form_List_Hotel'];
		const dragApi = AppServices['Content']['Guest_Repairs_Form_Create_Hotel'];

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeWithoutLimit
			}
		};

		// set table resources
		this.tableServices = {
			api: api,
			dragApi: dragApi,
			payload: payload,
			uniqueID: 'ID',
			sortDefaultColumn: 'Sort'
		};

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}

	/**
	 * fetch guest repair sub categories
	 *
	 * @param row
	 */
	public guestRepairsSubCategoriesFetch(row: any) {
		const api = AppServices['Content']['Guest_Repairs_Form_List_Sub_Hotel'];

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				ID: row.ID
			}
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
	public guestRemoveRepair(row: any, refreshEmitter: any) {
		console.log(row);
	}

	/**
	 * create / update guest repair
	 *
	 * @param formPayload
	 * @param rowData
	 * @param categoryEmitter
	 */
	public guestUpdateRepair(formPayload: GuestRepairInterface, rowData: any, categoryEmitter: any) {
		const isEditForm = !!rowData;
		const api = AppServices['Content']['Guest_Repairs_Form_Create_Hotel'];

		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			bodyParams: formPayload
		};

		// service: update data
		this._proxyService.postAPI(api, payload)
			.subscribe((res) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				const text = isEditForm ? {
					title: this._i18n({ value: 'Title: Repair Updated', id: 'Guest_Repairs_Form_Success_Updated_Title' }),
					message: this._i18n({
						value: 'Description: Repair Updated',
						id: 'Guest_Repairs_Form_Success_Updated_Description'
					}),
				} : {
					title: this._i18n({ value: 'Title: Repair Created', id: 'Guest_Repairs_Form_Success_Created_Title' }),
					message: this._i18n({
						value: 'Description: Repair Created',
						id: 'Guest_Repairs_Form_Success_Created_Description'
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
					.subscribe(() => res && res.data && categoryEmitter.emit(res.data));
			});
	}
}
