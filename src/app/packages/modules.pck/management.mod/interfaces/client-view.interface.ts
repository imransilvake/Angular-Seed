// app
import { ClientViewTypeEnum } from '../enums/client-view-type.enum';

// client view interface
export interface ClientViewInterface {
	view: ClientViewTypeEnum;
	id?: string;
}
