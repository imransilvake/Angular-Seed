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
		HotelListGroup: { serviceUrl: '/hotels/list/group/:groupId' },
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
		Client_Default_List_Hotel_Group: { serviceUrl: '/management/hotelgroup/list/group/:groupId' },
		Client_Default_List_Hotel: { serviceUrl: '/management/hotelgroup/list/group/:groupId/hotel/:hotelId' },

		Client_Form_License_HotelGroup_Fetch: { serviceUrl: '/management/group/:groupId' },
		Client_Form_License_HotelGroup_Validate: { serviceUrl: '/management/hotelgroup/validate' },
		Client_Form_System_HotelGroup_Validate: { serviceUrl: '/management/endpoint/validate' },
		Client_Form_License_System_Hotel_Update: { serviceUrl: '/management/hotel' },
		Client_Form_License_System_HotelGroup_Update: { serviceUrl: '/management/group' },

		Client_Form_HGA_Override_All_Fetch: { serviceUrl: '/management/module/override/group/:groupId/app/:appId' },
		Client_Form_HGA_Override_Hotel_Fetch: { serviceUrl: '/management/module/override/group/:groupId/hotel/:hotelId/app/:appId' },
		Client_Form_HGA_Override_Update: { serviceUrl: '/management/module/override/group/:groupId' },

		Client_Form_App_Hotel_Fetch: { serviceUrl: '/management/module/group/:groupId/hotel/:hotelId/app/:appId' },
		Client_Form_App_HotelGroup_Fetch: { serviceUrl: '/management/module/group/:groupId/app/:appId' },
		Client_Form_App_Hotel_Update: { serviceUrl: '/management/module/group/:groupId/hotel/:hotelId' },
		Client_Form_App_HotelGroup_Update: { serviceUrl: '/management/module/group/:groupId' },

		User_Default_List: { serviceUrl: '/ham/auth/listusers' },
		User_Default_List_Hotel_Group: { serviceUrl: '/ham/auth/listusers/group/:groupId' },
		User_Default_List_Hotel: { serviceUrl: '/ham/auth/listusers/group/:groupId/hotel/:hotelId' }
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
