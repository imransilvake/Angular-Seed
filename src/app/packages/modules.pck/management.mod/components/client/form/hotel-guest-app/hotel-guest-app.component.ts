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

	constructor(
		private _clientService: ClientService
	) {
		// form fields
		this.formFields = new FormGroup({
			modules: new FormArray([
				HotelGuestAppComponent.moduleItems()
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

				// add form modules but not on refresh
				if (this.formFieldsModules.value.length === 1) {
					for (let i = 1; i < this.totalNumberOfModules; i++) {
						this.addModule();
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
	 */
	public static moduleItems() {
		return new FormGroup({
			License: new FormControl(false),
			Active: new FormControl(false),
			Preferred: new FormControl(false)
		});
	}

	/**
	 * add empty module
	 */
	public addModule() {
		const control = this.formFields.controls.modules;
		control.push(HotelGuestAppComponent.moduleItems());
	}

	/**
	 * get module index
	 *
	 * @param mIndex
	 * @param iIndex
	 */
	public getModuleIndex(mIndex, iIndex) {
		const res = this.modulesList.map(res => res.modules.length);

		// slice till current index
		// sum array values till slice array
		return (mIndex === 0) ? iIndex : res.slice(0, mIndex).reduce((a, b) => a + b, 0) + iIndex;
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
