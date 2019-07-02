// angular
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})

export class DatepickerComponent {
	@Input() control = new FormControl();

	@Input() minDate;
	@Input() maxDate;

	@Input() showLabel = false;
	@Input() labelName;

	@Input() inputId = 'ham-input';
	@Input() inputName;
	@Input() inputType = 'text';
	@Input() inputPlaceHolder;
	@Input() autocomplete = 'off';

	@Input() showHint = false;
	@Input() hintText;

	@Input() inputFocused = false;
}
