// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { ClientService } from '../../../../services/client.service';
import { HelperService } from '../../../../../../utilities.pck/accessories.mod/services/helper.service';
import { DialogService } from '../../../../../../utilities.pck/dialog.mod/services/dialog.service';
import { DialogTypeEnum } from '../../../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { LoadingAnimationService } from '../../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { HgaOverrideInterface } from '../../../../interfaces/hga-override.interface';
import { ClientAppTypeEnum } from '../../../../enums/client-app-type.enum';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['../hotel-common.component.scss']
})

export class HotelGuestAppComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public modulesList = [];
	public flatModulesList = [];
	public licenseActive = true;
	public formValid = false;
	public groupId;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _clientService: ClientService,
		private _dialogService: DialogService,
		private _loadingAnimationService: LoadingAnimationService,
		private _i18n: I18n
	) {
		// form fields
		this.formFields = new FormGroup({
			hgaState: new FormControl(false),
			modules: new FormArray([
				HotelGuestAppComponent.moduleItems({
					Licensed: false,
					Active: false,
					Preferred: 0
				})
			])
		});
	}

	ngOnInit() {
		// listen: get modules
		this._clientService.clientDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.hgaModules && res.licenseSystemData && res.hgaOverride) {
					// set override state
					this.hgaState.setValue(res.hgaOverride && res.hgaOverride.HotelManagerOverride);

					// set group id
					this.groupId = res.licenseSystemData.GroupID;

					// module list
					this.modulesList = res.hgaModules;

					// not on refresh (header)
					if (this.modulesList && this.modulesList.length > 0) {
						// flat modules
						this.flatModulesList = HelperService.flatNestedArrays(this.modulesList.map(block => block.modules));

						// count modules length
						const modulesCount = this.flatModulesList.length;

						// add & update modules
						// update: 0
						// add: 1 onwards
						for (let i = 0; i < modulesCount; i++) {
							this.updateAndAddModule(this.flatModulesList[i], i);
						}
					}
				} else {
					// clear modules list
					this.modulesList = [];
				}
			});

		// listen: validate form
		this.modules.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const activeModules = this.modules.value.filter(module => module.Licensed);
				this.formValid = activeModules.length >= 1;
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get hgaState() {
		return this.formFields.get('hgaState');
	}

	get modules() {
		return this.formFields.controls.modules;
	}

	get isFormValid() {
		return this.formValid;
	}

	/**
	 * validate HGA state
	 */
	public onChangeHGAState() {
		// payload
		const dialogPayload = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				icon: 'dialog_confirmation',
				title: this._i18n({ value: 'Title: HGA Activation Confirmation', id: 'HGA_Activation_Title' }),
				message: this._i18n({ value: 'Description: HGA Activation Confirmation', id: 'HGA_Activation_Description' }),
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

		// dialog service
		this._dialogService.showDialog(dialogPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// override value
					const value = this.hgaState.value;

					// set override state
					this.hgaState.setValue(value);

					// payload
					const payload: HgaOverrideInterface = {
						AppID: ClientAppTypeEnum.HGA,
						GroupID: this.groupId,
						HotelManagerOverride: value
					};

					// service
					this._clientService.clientUpdateOverrideHGA(payload);
				} else {
					// set override state
					this.hgaState.setValue(!this.hgaState.value);
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * list of module items
	 *
	 * @param result
	 */
	public static moduleItems(result) {
		return new FormGroup({
			Licensed: new FormControl(result.Licensed),
			Active: new FormControl(result.Active),
			Preferred: new FormControl(result.Preferred)
		});
	}

	/**
	 * update & add module
	 *
	 * @param result
	 * @param type (0 = update | 1-9 = add)
	 */
	public updateAndAddModule(result: any, type: number) {
		const output = {
			Licensed: result.data && result.data.Licensed ? result.data.Licensed : false,
			Active: result.data && result.data.Active ? result.data.Active : false,
			Preferred: result.data && result.data.Preferred ? result.data.Preferred : 0
		};

		// update & add form fields
		if (this.modules.at(type)) {
			this.modules.at(type).setValue(output);
		} else {
			this.modules.push(HotelGuestAppComponent.moduleItems(output));
		}

		// disable fields
		if (!this.modules.at(type).get('Licensed').value) {
			this.modules.at(type).get('Active').disable();
			this.modules.at(type).get('Preferred').disable();
		}
	}

	/**
	 * get module index
	 *
	 * @param mIndex
	 * @param iIndex
	 */
	public getModuleIndex(mIndex, iIndex) {
		const result = this.modulesList.map(res => res.modules.length);

		// slice till current index
		// sum array values till slice array
		return (mIndex === 0) ? iIndex : result.slice(0, mIndex).reduce((a, b) => a + b, 0) + iIndex;
	}

	/**
	 * on change license
	 *
	 * @param mIndex
	 * @param iIndex
	 */
	public onChangeLicense(mIndex, iIndex) {
		const idx = this.getModuleIndex(mIndex, iIndex);
		const licensed = this.modules.controls[idx].get('Licensed');
		const licensedValue = licensed.value;
		const active = this.modules.controls[idx].get('Active');
		const preferred = this.modules.controls[idx].get('Preferred');

		// validate license
		if (licensedValue) {
			active.enable();
			preferred.enable();
		} else {
			active.disable();
			preferred.disable();
			preferred.setValue(0);
		}
	}

	/**
	 * on change preferred
	 *
	 * @param mIndex
	 * @param iIndex
	 */
	public onChangePreferred(mIndex, iIndex) {
		const idx = this.getModuleIndex(mIndex, iIndex);
		const preferred = this.modules.controls[idx].get('Preferred');
		const preferredValue = preferred.value;
		const modulesList = this.formFields.controls.modules.value;
		const count = modulesList.filter(module => module.Licensed && (module.Preferred || module.Preferred.value)).length;

		// check all current license preferred value
		if (count > 2 && preferredValue) {
			preferred.setValue(0);
		}
	}

	/**
	 * open params modal
	 *
	 * @param index
	 */
	public onClickOpenParamsModal(index: number) {
		// const module = this.modules.at(index).value;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// service
		this._clientService.clientUpdateAppModules(ClientAppTypeEnum.HGA, this.formFields.value, this.flatModulesList);
	}

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
