// app
import { AppServicesInterface } from './app/packages/core.pck/proxy.mod/interfaces/app-services.interface';

// general
export const AppOptions = {};

// services
export const AppServices: { [moduleName: string]: { [name: string]: AppServicesInterface } } = {
	Utilities: {
		CountryList: { serviceUrl: '' }
	}
};

// local-storage items
export const LocalStorageItems = {
	userState: 'app-local-us',
	appState: 'app-local-as'
};

// session-storage items
export const SessionStorageItems = {
	userState: 'app-session-us',
	appState: 'app-session-as'
};

// headers for a request to backend
export const RequestHeaders = {
	get: {
		'Accept': 'application/json'
	},
	post: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
};

// REST API config
export const RESTAPIConfig = {
	get: {
		retry: 3,
		timeout: 10 * 1000 // 10 seconds
	},
	post: {
		timeout: 20 * 1000 // 20 seconds
	}
};
