// angular
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';

// app
import { AutocompleteTypeEnum } from '../../enums/autocomplete-type.enum';
import { AutocompleteDefaultInterface } from '../../interfaces/autocomplete-default-interface';
import { AutocompleteGroupInterface } from '../../interfaces/autocomplete-group.interface';

@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss']
})

export class AutocompleteComponent implements OnInit {
	@Input() autocompleteType: AutocompleteTypeEnum = AutocompleteTypeEnum.DEFAULT;
	@Input() multipleSelection = false;

	@Input() control = new FormControl();
	@Input() dataDefault: AutocompleteDefaultInterface[] = [];
	@Input() dataGroups: AutocompleteGroupInterface[] = [];
	@Input() filteredData: Observable<AutocompleteDefaultInterface[] | AutocompleteGroupInterface[]>;

	@Input() showLabel = false;
	@Input() labelName;

	@Input() autocompleteId = 'ham-input';
	@Input() autocompletePlaceHolder;

	@Input() showHint = false;
	@Input() hintText;

	@Input() autocompleteFocused = false;

	@Input() itemRemovable = false;
	@Input() selectedItems: AutocompleteDefaultInterface[] = [];
	@Output() outputList = new EventEmitter<AutocompleteDefaultInterface[] | string[]>();

	@ViewChild('inputField') inputField: ElementRef;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	ngOnInit() {
		this.filteredData = this.control.valueChanges
			.pipe(
				startWith(''),
				map(res => {
					// validate fields
					this.validateField();

					// set data
					return this.autocompleteType === AutocompleteTypeEnum.GROUP ?
						this.filterDataGroupResults(res, this.dataGroups) :
						this.filterDataResults(res, this.dataDefault);
				})
			);
	}

	/**
	 * set output list format
	 */
	get prepareOutputList() {
		return this.selectedItems.map(item => item.id);
	}

	/**
	 * display value on selection
	 *
	 * @param item
	 */
	displayFn(item?: AutocompleteDefaultInterface) {
		return item && item.text;
	}

	/**
	 * remove item from the list
	 *
	 * @param itemId
	 */
	public removeItem(itemId: string) {
		// update list
		this.selectedItems = this.selectedItems.filter(item => item.id !== itemId);

		// update output list
		this.outputList.emit(this.prepareOutputList);

		// set input empty
		this.control.setValue('');
	}

	/**
	 * push selected item into the list
	 *
	 * @param event
	 */
	public itemSelected(event: MatAutocompleteSelectedEvent) {
		// update list
		this.selectedItems.push(this.control.value);

		// update output list
		this.outputList.emit(this.prepareOutputList);

		// set input empty
		this.control.setValue('');

		// remove focus
		this.inputField.nativeElement.blur();
	}

	/**
	 * filter data group results
	 *
	 * @param value
	 * @param data
	 */
	private filterDataGroupResults(value: string, data: AutocompleteGroupInterface[]) {
		return data
			.map(group => ({
				name: group.name,
				items: this.filterDataResults(value, group.items),
				disabled: group.disabled
			}))
			.filter(group => group.items.length > 0);
	}

	/**
	 * filter data results
	 *
	 * @param value
	 * @param data
	 */
	private filterDataResults(value: string, data: AutocompleteDefaultInterface[]) {
		return data
			.filter(item =>
				item.text && item.text.toLowerCase().indexOf(value && value.toString().toLowerCase()) !== -1 &&
				!this.selectedItems.map(elem => elem.id).includes(item.id)
			);
	}

	/**
	 * validate input field
	 */
	private validateField() {
		if (this.multipleSelection) {
			this.control.valueChanges
				.subscribe(res => {
					if (!res && this.selectedItems && this.selectedItems.length === 0) {
						// set error on empty list
						this.control.setErrors({ required: true });
					} else {
						if (this.selectedItems && this.selectedItems.length === 0) {
							// set error on empty list
							this.control.setErrors({ invalidOption: true });
						} else {
							this.control.setErrors(null);
						}
					}
				});
		}
	}
}
