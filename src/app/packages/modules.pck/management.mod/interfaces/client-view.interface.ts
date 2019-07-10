// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

// client view interface
export interface ClientViewInterface {
	view?: AppViewTypeEnum;
	id?: string;
	name?: string;
}
