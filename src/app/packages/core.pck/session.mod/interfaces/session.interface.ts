// app
import { SessionTypeEnum } from '../enums/session-type.enum';
import { SessionPayloadInterface } from './session-payload.interface';

// session interface
export interface SessionInterface {
	type: SessionTypeEnum;
	payload?: SessionPayloadInterface;
}
