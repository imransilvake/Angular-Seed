// app
import { AppServicesInterface } from './app/packages/core.pck/proxy.mod/interfaces/app-services.interface';

// general
export const AppOptions = {
	secretKey: 'ham',
	lockScreenSessionTime: 3600 * 1000,
	languages: {
		en: 'en',
		de: 'de',
		fr: 'fr',
		es: 'es'
	},
	rememberMeValidityInDays: 90,
	tablePageSizeLimit: 21
};

// services
export const AppServices: { [moduleName: string]: { [name: string]: AppServicesInterface } } = {
	Utilities: {
		CountryList: { serviceUrl: '/config/countries/list' },
		HotelList: { serviceUrl: '/hotels/list' },
		Fetch_Profile_Image: { serviceUrl: '/getimage' },
		Change_Profile_Image: { serviceUrl: '/imageupload' }
	},
	Auth: {
		Register: { serviceUrl: '/ham/auth/signup' },
		Login: { serviceUrl: '/ham/auth/authenticate' },
		Forgot_Password: { serviceUrl: '/ham/auth/forgotpassword' },
		Reset_Password: { serviceUrl: '/ham/auth/confirmpassword' },
		Logout: { serviceUrl: '/ham/auth/signout' },
		Session_Validity: { serviceUrl: '/ham/auth/sessionvalidity' }
	},
	Member: {
		Fetch_Profile: { serviceUrl: '/profile/getuser' },
		Update_Profile: { serviceUrl: '/profile/update' },
		Change_Password: { serviceUrl: '/profile/changepassword' }
	},
	Management: {
		Client_Default_List: { serviceUrl: '/management/hotelgroup/list' },
		Client_Default_List_Hotel: { serviceUrl: '/management/hotelgroup/list/:id' },
		Client_Form_Update_License_Hotel: { serviceUrl: '/management/hotel' },
		Client_Form_Update_License_HotelGroup: { serviceUrl: '/management/hotelgroup' },
		Client_Form_Update_License_HotelGroup_Validate: { serviceUrl: '/management/hotelgroup/validate' },
		Client_Form_Fetch_License_HotelGroup: { serviceUrl: '/management/hotelgroup/:id' }
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

// neutral-storage items
export const NeutralStorageItems = {
	appState: 'ham-local-as'
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
