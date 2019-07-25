// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

// guest view interface
export interface GuestViewInterface {
	view: AppViewTypeEnum;
	id?: string;
	data?: any;
}
