// app
import { AppServicesInterface } from './app/packages/core.pck/proxy.mod/interfaces/app-services.interface';

// general
export const AppOptions = {
	secretKey: 'ham'
};

// services
export const AppServices: { [name: string]: AppServicesInterface } = {
	authRegister: { serviceUrl: '/ham/auth/signup' },
	authLogin: { serviceUrl: '/ham/auth/authenticate' },
	authForgotPassword: { serviceUrl: '/ham/auth/forgotpassword' },
	authResetPassword: { serviceUrl: '/ham/auth/confirmpassword' }
};

// local-storage items
export const localStorageItems = {
	userState: 'ham-ls-us'
};

// session-storage items
export const sessionStorageItems = {
	userState: 'ham-ss-us'
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
