// angular
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
		return item.text;
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
		return data.filter(item => item.text.toLowerCase().indexOf(value.toLowerCase()) !== -1);
	}
}
