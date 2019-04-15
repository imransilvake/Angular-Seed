// app
import { DialogTypeEnum } from '../enums/dialog-type.enum';
import { DialogPayloadInterface } from './dialog-payload.interface';

// dialog interface
export interface DialogInterface {
	type: DialogTypeEnum;
	payload: DialogPayloadInterface;
}
