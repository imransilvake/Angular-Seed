// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { ClientService } from '../../../../services/client.service';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['./hotel-guest-app.component.scss']
})

export class HotelGuestAppComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public modulesList = [];
	public licenseActive = true;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
		// form fields
		this.formFields = new FormGroup({
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
		// listen: get HGA modules
		this._clientService.clientDataEmitter
			.pipe(
				startWith(0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res => {
				// module list
				this.modulesList = res.hgaModules || this._clientService.clientData.hgaModules;

				// not on refresh (header)
				if (this.formFieldsModules.value.length === 1) {
					// refactor
					const modules = [];
					this.modulesList.forEach(module => modules.push(...module.modules));

					// add & update modules
					// update: 0
					// add: 1-9
					for (let i = 0; i < this.totalNumberOfModules; i++) {
						this.updateAndAddModule(modules[i], i);
					}
				}
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
	get totalNumberOfModules() {
		return this.modulesList
			.map(res => res.modules.length)
			.reduce((a, b) => a + b, 0);
	}

	get formFieldsModules() {
		return this.formFields.controls.modules;
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		console.log(this.formFields.value);
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
		const control = this.formFields.controls.modules;
		const output = {
			Licensed: result.data.Licensed,
			Active: { value: result.data.Active, disabled: !result.data.Licensed },
			Preferred: { value: result.data.Preferred, disabled: !result.data.Licensed },
		};

		// update & add form fields
		if (type === 0) {
			control.at(0).patchValue(output);
		} else {
			control.push(HotelGuestAppComponent.moduleItems(output));
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
		const licensed = this.formFieldsModules.controls[idx].get('Licensed');
		const licensedValue = licensed.value;
		const active = this.formFieldsModules.controls[idx].get('Active');
		const preferred = this.formFieldsModules.controls[idx].get('Preferred');

		if (licensedValue) {
			// set active & preferred
			active.enable();
			preferred.enable();
		} else {
			// unset active & preferred
			active.disable();
			preferred.disable();
			preferred.setValue(false);
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
		const preferred = this.formFieldsModules.controls[idx].get('Preferred');
		const preferredValue = preferred.value;
		const modulesList = this.formFields.controls.modules.value;
		const count = modulesList.filter(module => module.Licensed && (module.Preferred || module.Preferred.value)).length;

		// check all current license preferred value
		if (count > 2 && preferredValue) {
			preferred.setValue(false);
		}
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
