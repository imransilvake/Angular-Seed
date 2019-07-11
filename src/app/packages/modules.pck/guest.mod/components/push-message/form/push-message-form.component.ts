// angular
import { Component, EventEmitter, Output } from '@angular/core';

// app
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';

@Component({
	selector: 'app-push-message-form',
	templateUrl: './push-message-form.component.html',
	styleUrls: ['./push-message-form.component.scss']
})

export class PushMessageFormComponent {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestPushMessageViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changePushMessageView.emit(payload);
	}
}
