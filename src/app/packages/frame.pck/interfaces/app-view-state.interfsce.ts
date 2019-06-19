// app
import { AppViewStateEnum } from '../enums/app-view-state.enum';

// app view interface
export interface AppViewStateInterface {
	hotelId: string;
	groupId: string;
	type: AppViewStateEnum;
	role?: string;
}
