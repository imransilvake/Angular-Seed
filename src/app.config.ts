// app
import { AppServicesInterface } from './app/packages/core.pck/proxy.mod/interfaces/app-services.interface';

// general
export const AppOptions = {
	secretKey: 'ham',
	lockScreenSessionTime: 3600 * 1000
};

// services
export const AppServices: { [moduleName: string]: { [name: string]: AppServicesInterface } } = {
	Auth: {
		Register: { serviceUrl: '/ham/auth/signup' },
		Login: { serviceUrl: '/ham/auth/authenticate' },
		Forgot_Password: { serviceUrl: '/ham/auth/forgotpassword' },
		Reset_Password: { serviceUrl: '/ham/auth/confirmpassword' },
		Logout: { serviceUrl: '/ham/auth/signout' },
		Session_Validity: { serviceUrl: '/ham/auth/sessionvalidity' }
	},
	Utilities: {
		HotelList: { serviceUrl: '/hotels/list' }
	}
};

// local-storage items
export const LocalStorageItems = {
	userState: 'ham-local-us',
	lockState: 'ham-local-ls'
};

// session-storage items
export const SessionStorageItems = {
	userState: 'ham-session-us'
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
		timeout: 360 * 1000 // 6 minutes
	},
	post: {
		timeout: 120 * 1000 // 2 minutes
	}
};
