// app
import { AppStateEnum } from '../enums/app-state.enum';

// app view interface
export interface AppViewStateInterface {
	hotelId: string;
	groupId: string;
	type: AppStateEnum;
	role?: string;
}
