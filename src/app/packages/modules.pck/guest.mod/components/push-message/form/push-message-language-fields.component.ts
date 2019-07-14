// angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-push-message-language-fields',
	templateUrl: './push-message-language-fields.component.html',
	styleUrls: ['./push-message-language-fields.component.scss']
})

export class PushMessageLanguageFieldsComponent implements OnInit {
	@Output() changeFormTitle: EventEmitter<any> = new EventEmitter();

	@Input() language;
	@Input() data;
	@Input() multiLanguageFields = null;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	ngOnInit() {
		if (this.multiLanguageFields) {
			const title = this.multiLanguageFields.controls['title'];
			const text = this.multiLanguageFields.controls['description'];

			// update form with existing data
			if (this.data) {
				title.setValue(this.data.Title);
				text.setValue(this.data.Text[this.language]);
			}

			// listen: title field
			title.valueChanges
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => this.changeFormTitle.emit(res));
		}
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
