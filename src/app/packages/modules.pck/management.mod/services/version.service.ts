// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { BroadcastInterface } from '../interfaces/broadcast.interface';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable()
export class VersionService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();
	public formLoadingState: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService
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
	 * @param dialogRef
	 */
	public versionCreateAndUpdate(formPayload: BroadcastInterface, dialogRef: any) {
		this._proxyService.postAPI(AppServices['Management']['Broadcast_Form_Create_All'], { bodyParams: formPayload })
			.subscribe(() => {
				// update loading state
				this.formLoadingState.emit();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: Broadcast Created', id: 'Management_BroadcastCreated_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Broadcast Created',
							id: 'Management_BroadcastCreated_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => dialogRef.close(true));
			});
	}
}
