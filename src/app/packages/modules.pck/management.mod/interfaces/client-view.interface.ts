// app
import { AppViewTypeEnum } from '../enums/app-view-type.enum';

// client view interface
export interface ClientViewInterface {
	view?: AppViewTypeEnum;
	id?: string;
	name?: string;
}
