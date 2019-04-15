// app
import { ErrorHandlerTypeEnum } from '../enums/error-handler-type.enum';
import { ErrorHandlerPayloadInterface } from './error-handler-payload.interface';

// error handler types interface
export interface ErrorHandlerInterface {
	type: ErrorHandlerTypeEnum;
	payload: ErrorHandlerPayloadInterface;
}
