// app
import { AppServicesInterface } from './app/packages/core.pck/proxy.mod/interfaces/app-services.interface';

// general
export const AppOptions = {
	secretKey: 'ham',
	languages: {
		en: 'en',
		de: 'de',
		fr: 'fr',
		es: 'es'
	},
	sessionTime: {
		auth: 3300 * 1000, // 55 minutes
	},
	rememberMeValidityInDays: 90,
	tablePageSizeLimit: 21,
	tablePageSizeWithoutLimit: 1000
};

// services
export const AppServices: { [moduleName: string]: { [name: string]: AppServicesInterface } } = {
	Utilities: {
		CountryList: { serviceUrl: '/config/countries/list' }
	},
	Auth: {
		Register: { serviceUrl: '/ham/auth/signup' },
		Login: { serviceUrl: '/ham/auth/authenticate' },
		Forgot_Password: { serviceUrl: '/ham/auth/forgotpassword' },
		Reset_Password: { serviceUrl: '/ham/auth/confirmpassword' },
		Logout: { serviceUrl: '/ham/auth/signout' },
		Session_Validity: { serviceUrl: '/ham/auth/sessionvalidity' }
	}
};

// local-storage items
export const LocalStorageItems = {
	userState: 'ham-local-us',
	appState: 'ham-local-as'
};

// session-storage items
export const SessionStorageItems = {
	userState: 'ham-session-us',
	appState: 'ham-session-as'
};

// headers for a request to backend
export const RequestHeaders = {
	get: {
		'Accept': 'application/json'
	},
	post: {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
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
