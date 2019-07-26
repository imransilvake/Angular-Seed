// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { VersionInterface } from '../interfaces/version.interface';
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { VersionViewInterface } from '../interfaces/version-view.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';

@Injectable()
export class VersionService {
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
	 * fetch version list
	 *
	 * @param id
	 */
	public versionFetchList(id: string) {
		const api = AppServices['Management']['Version_List_All'];

		// validate app state
		if (!id) {
			// set table resources
			this.tableServices = {
				api: api,
				uniqueID: 'Release',
				sortDefaultColumn: 'Release'
			};

			// service
			return this._proxyService
				.getAPI(api)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}

	/**
	 * create / update version
	 *
	 * @param formPayload
	 * @param isEditForm
	 * @param changePageView
	 */
	public versionCreateAndUpdate(formPayload: VersionInterface, isEditForm, changePageView: any) {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// text
		let text = { };
		if (isEditForm) {
			text = {
				title: this._i18n({ value: 'Title: Version Updated', id: 'Management_Version_Updated_Form_Success_Title' }),
				message: this._i18n({
					value: 'Description: Version Updated',
					id: 'Management_Version_Updated_Form_Success_Description'
				})
			};
		}
		else {
			text = {
				title: this._i18n({ value: 'Title: Version Created', id: 'Management_Version_Created_Form_Success_Title' }),
				message: this._i18n({
					value: 'Description: Version Created',
					id: 'Management_Version_Created_Form_Success_Description'
				})
			};
		}

		// service
		this._proxyService.postAPI(AppServices['Management']['Version_Form_Create_All'], { bodyParams: formPayload })
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						...text,
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => {
						const viewPayload: VersionViewInterface = {
							view: AppViewTypeEnum.DEFAULT
						};
						changePageView.emit(viewPayload);
					});
			});
	}
}
