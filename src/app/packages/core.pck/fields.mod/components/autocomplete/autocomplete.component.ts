// angular
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

// app
import { AutocompleteTypeEnum } from '../../enums/autocomplete-type.enum';
import { AutocompleteDefaultInterface } from '../../interfaces/autocomplete-default-interface';
import { AutocompleteGroupInterface } from '../../interfaces/autocomplete-group.interface';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';

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
	@Input() selectedItems = [];
	@Output() outputList = new EventEmitter<string[]>();

	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	ngOnInit() {
		this.filteredData = this.control.valueChanges
			.pipe(
				startWith(''),
				map(res =>
					this.autocompleteType === AutocompleteTypeEnum.GROUP ?
						this.filterDataGroupResults(res, this.dataGroups) :
						this.filterDataResults(res, this.dataDefault)
				)
			);
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
	 * @param item
	 */
	public remove(item: string) {
		const index = this.selectedItems.indexOf(item);
		if (index >= 0) {
			// set error on empty list
			if (index === 0) {
				this.control.setErrors({ required: true });
			}

			// remove item
			this.selectedItems.splice(index, 1);
		}
	}

	/**
	 * push selected item into the list
	 *
	 * @param event
	 */
	public selected(event: MatAutocompleteSelectedEvent) {
		this.selectedItems.push(this.control.value.id);
		this.outputList.emit(this.selectedItems);
		this.control.setValue('');
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
			.filter(item => item.text && item.text.toLowerCase().indexOf(value.toString().toLowerCase()) !== -1);
	}
}
