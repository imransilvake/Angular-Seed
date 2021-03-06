// angular
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
	@Input() typeTextArea = false;

	@Input() control = new FormControl();

	@Input() showLabel = false;
	@Input() labelName;

	@Input() inputId = 'app-input';
	@Input() inputName;
	@Input() inputType = 'text';
	@Input() inputPlaceHolder;
	@Input() autocomplete = 'off';

	@Input() showHidePassword = false;
	@Input() hidePassword = false;

	@Input() showHint = false;
	@Input() hintText;

	@Input() inputFocused = false;

	@Input() textareaMinRows;
	@Input() textareaMaxRows = 5;

	ngOnInit() {
		// case: show password on click
		this.inputType = this.showHidePassword ? 'text' : this.inputType;
	}
}
