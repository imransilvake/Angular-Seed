// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as zxcvbn from 'zxcvbn';

@Component({
	selector: 'app-password-strength',
	templateUrl: './password-strength.component.html',
	styleUrls: ['./password-strength.component.scss']
})

export class PasswordStrengthComponent implements OnInit, OnDestroy {
	@Input() cPassword;

	public score = 0;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor() {
	}

	ngOnInit() {
		// listen: control value change event
		this.cPassword.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					const result = zxcvbn(res);
					this.score = result.score;
				} else {
					this.score = 0;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
