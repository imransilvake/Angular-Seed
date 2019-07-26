// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

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
	 * @param formFields
	 */
	public versionCreateAndUpdate(formPayload: VersionInterface, isEditForm, changePageView: any, formFields: FormGroup) {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// text
		let text = { };
		let extraPayload = { };
		if (isEditForm) {
			text = {
				title: this._i18n({ value: 'Title: Version Updated', id: 'Management_Version_Updated_Form_Success_Title' }),
				message: this._i18n({
					value: 'Description: Version Updated',
					id: 'Management_Version_Updated_Form_Success_Description'
				})
			};

			extraPayload = {
				type: 'update',
				...formPayload
			}
		}
		else {
			text = {
				title: this._i18n({ value: 'Title: Version Created', id: 'Management_Version_Created_Form_Success_Title' }),
				message: this._i18n({
					value: 'Description: Version Created',
					id: 'Management_Version_Created_Form_Success_Description'
				})
			};

			extraPayload = {
				...formPayload
			}
		}

		// service
		this._proxyService.postAPI(AppServices['Management']['Version_Form_Create_All'], { bodyParams: extraPayload })
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
			}, (err: HttpErrorResponse) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				if (err.error.detail.code === 'InvalidVersion') {
					const message = this._i18n({
						value: 'Description: Invalid Version ID Exception',
						id: 'Management_Version_Error_Invalid_VersionID_Description'
					});

					// set field to show error message
					formFields.get('versionId').setErrors({ invalidVersion: true });

					// message
					this.errorMessage.emit(message);
				}
			});
	}
}
