// app
import { AppViewTypeEnum } from '../enums/app-view-type.enum';

// app view interface
export interface AppViewStateInterface {
	hotelId: string;
	groupId: string;
	text?: string;
	type: AppViewTypeEnum;
}
