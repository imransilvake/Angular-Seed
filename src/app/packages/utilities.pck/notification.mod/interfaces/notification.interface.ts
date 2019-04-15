// app
import { NotificationTypeEnum } from '../enums/notification-type.enum';
import { NotificationPayloadInterface } from './notification-payload.interface';

// notification interface
export interface NotificationInterface {
	type: NotificationTypeEnum;
	payload: NotificationPayloadInterface;
}
