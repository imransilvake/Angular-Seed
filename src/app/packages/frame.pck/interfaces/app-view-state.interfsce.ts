// app
import { AppViewTypeEnum } from '../enums/app-view-type.enum';

// app view interface
export interface AppViewStateInterface {
	id: string;
	text?: string;
	type: AppViewTypeEnum;
}
