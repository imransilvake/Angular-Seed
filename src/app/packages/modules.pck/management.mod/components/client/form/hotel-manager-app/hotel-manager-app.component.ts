// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';

// app
import { ClientService } from '../../../../services/client.service';
import { HelperService } from '../../../../../../utilities.pck/accessories.mod/services/helper.service';
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';

@Component({
	selector: 'app-hotel-manager-app',
	templateUrl: './hotel-manager-app.component.html',
	styleUrls: ['../hotel-common.component.scss']
})

export class HotelManagerAppComponent implements OnInit {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public modulesList = [];
	public licenseActive = true;
	public formValid = false;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _clientService: ClientService) {
		// form fields
		this.formFields = new FormGroup({
			modules: new FormArray([
				HotelManagerAppComponent.moduleItems({
					Licensed: false,
					Active: false
				})
			])
		});
	}

	ngOnInit() {
		// listen: get modules
		this._clientService.clientDataEmitter
			.pipe(
				startWith(0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res => {
				// module list
				this.modulesList = res.hmaModules || this._clientService.clientData.hmaModules;

				// not on refresh (header)
				if (this.modules.value.length === 1) {
					// flat modules
					const modules = HelperService.flatNestedArrays(this.modulesList.map(block => block.modules));

					// count modules length
					const modulesCount = modules.length;

					// add & update modules
					// update: 0
					// add: 1 onwards
					for (let i = 0; i < modulesCount; i++) {
						this.updateAndAddModule(modules[i], i);
					}
				}
			});

		// listen: validate form
		this.modules.valueChanges
			.pipe(
				startWith(0),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(() => {
				const activeModules = this.modules.value.filter(module => module.Licensed);
				this.formValid = activeModules.length >= 1;
			});
	}

	/**
	 * getters
	 */
	get modules() {
		return this.formFields.controls.modules;
	}

	get isFormValid() {
		return this.formValid;
	}

	/**
	 * list of module items
	 *
	 * @param result
	 */
	public static moduleItems(result) {
		return new FormGroup({
			Licensed: new FormControl(result.Licensed),
			Active: new FormControl(result.Active)
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
			Licensed: result.data.Licensed,
			Active: result.data.Active
		};

		// update & add form fields
		if (type === 0) {
			this.modules.at(type).setValue(output);
		} else {
			this.modules.push(HotelManagerAppComponent.moduleItems(output));
		}

		// disable fields
		if (!this.modules.at(type).get('Licensed').value) {
			this.modules.at(type).get('Active').disable();
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

		// validate license
		if (licensedValue) {
			// set active
			active.enable();
		} else {
			// unset active
			active.disable();
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
		console.log(this.formFields.value);
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
