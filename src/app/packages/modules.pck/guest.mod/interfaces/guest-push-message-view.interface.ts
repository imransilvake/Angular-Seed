// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

// guest push message view interface
export interface GuestPushMessageViewInterface {
	view: AppViewTypeEnum;
	id?: string;
	data?: any;
}
