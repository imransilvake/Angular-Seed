// app
import { ClientViewTypeEnum } from '../enums/client-view-type.enum';

export interface ClientViewInterface {
	view: ClientViewTypeEnum;
	hotelId?: number;
}
