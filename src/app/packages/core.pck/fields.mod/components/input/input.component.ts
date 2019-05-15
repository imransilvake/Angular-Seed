// angular
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// app
import { InputStyleEnum } from '../../enums/input-style.enum';
import { InputStyleInterface } from '../../interfaces/input-style.interface';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
	@Input() layoutStyleType: InputStyleEnum = InputStyleEnum.DEFAULT;
	@Input() layoutStyleData: InputStyleInterface;

	@Input() control = new FormControl();

	@Input() showLabel = false;
	@Input() labelName;

	@Input() inputId = 'ham-input';
	@Input() inputName;
	@Input() inputType = 'text';
	@Input() inputPlaceHolder;
	@Input() autocomplete = 'off';

	@Input() showHidePassword = false;
	@Input() hidePassword = false;

	@Input() showHint = false;
	@Input() hintText;

	@Input() inputFocused = false;

	ngOnInit() {
		// case: show password on click
		this.inputType = this.showHidePassword ? 'text' : this.inputType;
	}
}
