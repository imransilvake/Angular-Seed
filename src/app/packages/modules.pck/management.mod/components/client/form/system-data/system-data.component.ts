// angular
import { Component, EventEmitter, Output } from '@angular/core';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { SelectTypeEnum } from '../../../../../../core.pck/fields.mod/enums/select-type.enum';

@Component({
	selector: 'app-system-data',
	templateUrl: './system-data.component.html',
	styleUrls: ['./system-data.component.scss']
})

export class SystemDataComponent {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public formFields;
	public licenseSelectType = SelectTypeEnum.DEFAULT;

	constructor() {
	}

	/**
	 * getters
	 */
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
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
