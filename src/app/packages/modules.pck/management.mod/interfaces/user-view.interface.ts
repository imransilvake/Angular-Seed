// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

// user view interface
export interface UserViewInterface {
	view: AppViewTypeEnum;
	id?: string;
	data?: any;
}
