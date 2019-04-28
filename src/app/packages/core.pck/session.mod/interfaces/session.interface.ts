// app
import { SessionTypeEnum } from '../enums/session-type.enum';
import { SessionsEnum } from '../enums/sessions.enum';

// session interface
export interface SessionInterface {
	type: SessionTypeEnum;
	payload?: SessionsEnum
}
