// angular
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-head',
	templateUrl: './head.component.html',
	styleUrls: ['./head.component.scss']
})

export class HeadComponent {
	@Input() pageTitle;
	@Input() notification;
	@Input() showPageHint = false;
	@Input() pageHintTitle;
	@Input() pageHintText;

	/**
	 * close page hint
	 */
	public onClickClosePageHint() {
		// hide page hint
		this.showPageHint = false;
	}
}
