// app
import { AppViewTypeEnum } from '../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

// version view interface
export interface VersionViewInterface {
	view: AppViewTypeEnum;
	id?: string;
	data?: any;
}
