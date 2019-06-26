// app
import { AppViewTypeEnum } from '../enums/app-view-type.enum';
import { UserFormTypeEnum } from '../enums/user-form-type.enum';

// user view interface
export interface UserViewInterface {
	view: AppViewTypeEnum;
	id?: string;
	data?: any;
	state?: UserFormTypeEnum;
}
