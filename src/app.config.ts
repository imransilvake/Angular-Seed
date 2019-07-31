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
		notification: 60 * 1000 // 1 minute
	},
	rememberMeValidityInDays: 90,
	tablePageSizeLimit: 21,
	tablePageSizeWithoutLimit: 1000
};

// services
export const AppServices: { [moduleName: string]: { [name: string]: AppServicesInterface } } = {
	Utilities: {
		CountryList: { serviceUrl: '/config/countries/list' },
		Hotels_List: { serviceUrl: '/hotels/list' },
		Hotels_List_All: { serviceUrl: '/hotels/list/all' },
		Hotels_List_Group: { serviceUrl: '/hotels/list/group/:groupId' },
		Profile_Image_Fetch: { serviceUrl: '/getimage' },
		Profile_Image_Change: { serviceUrl: '/imageupload' },
		Page_Hints_List: { serviceUrl: '/config/pagehints/status' },
		Page_Hints_Update: { serviceUrl: '/config/pagehints/save' },
		System_Languages: { serviceUrl: '/config/group/:groupId' }
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
		Profile_List: { serviceUrl: '/profile/getuser' },
		Profile_Update: { serviceUrl: '/profile/update' },
		Profile_Change_Password: { serviceUrl: '/profile/changepassword' }
	},
	Content: {
		Guest_Offers_And_Notifications_List_Hotel: { serviceUrl: '/notification/guest/list/group/:groupId/hotel/:hotelId' },
		Guest_Offers_And_Notifications_Remove_Hotel: { serviceUrl: '/notification/guest/delete/group/:groupId/hotel/:hotelId' },
		Guest_Offers_And_Notifications_Form_Create_Hotel: { serviceUrl: '/notification/guest/create/group/:groupId/hotel/:hotelId' },
		Guest_Offers_And_Notifications_Form_Update_Hotel: { serviceUrl: '/notification/guest/update/group/:groupId/hotel/:hotelId' },
		Guest_Repairs_List_Hotel: { serviceUrl: '/config/category/list/group/:groupId/hotel/:hotelId' },
		Guest_Repairs_List_Remove_Hotel: { serviceUrl: '/config/category/delete/group/:groupId/hotel/:hotelId' },
		Guest_Repairs_Form_Create_Hotel: { serviceUrl: '/config/category/create/group/:groupId/hotel/:hotelId' },
		Guest_Repairs_Form_List_Sub_Hotel: { serviceUrl: '/config/subcategory/list/group/:groupId/hotel/:hotelId' }
	},
	Notifications: {
		Notifications_List_Hotel: { serviceUrl: '/notification/list/group/:groupId/hotel/:hotelId' },
		Notifications_Alert_Hotel: { serviceUrl: '/notification/alert/group/:groupId/hotel/:hotelId' },
		Notifications_Update_Hotel: { serviceUrl: '/notification/confirm/group/:groupId/hotel/:hotelId' },
		Notifications_ClearAll_Hotel: { serviceUrl: '/notification/clear/group/:groupId/hotel/:hotelId' },

		Notifications_Status : { serviceUrl: '/notification/status/group/:groupId/hotel/:hotelId' },
		Notifications_Update_LRT : { serviceUrl: '/notification/savetime/group/:groupId/hotel/:hotelId' }
	},
	Management: {
		Client_List_All: { serviceUrl: '/management/hotelgroup/list' },
		Client_List_Group: { serviceUrl: '/management/hotelgroup/list/group/:groupId' },
		Client_List_Hotel: { serviceUrl: '/management/hotelgroup/list/group/:groupId/hotel/:hotelId' },
		Client_Form_License_And_System: { serviceUrl: '/management/group/:groupId' },
		Client_Form_Validate_License_Group: { serviceUrl: '/management/hotelgroup/validate' },
		Client_Form_Validate_System_Endpoint: { serviceUrl: '/management/endpoint/validate' },
		Client_Form_Update_License_And_System_Hotel: { serviceUrl: '/management/hotel' },
		Client_Form_Update_License_And_System_Group: { serviceUrl: '/management/group' },
		Client_Form_HGA_Override_All: { serviceUrl: '/management/module/override/group/:groupId/app/:appId' },
		Client_Form_HGA_Override_Group: { serviceUrl: '/management/module/override/group/:groupId' },
		Client_Form_HGA_Override_Hotel: { serviceUrl: '/management/module/override/group/:groupId/hotel/:hotelId/app/:appId' },
		Client_Form_App_List_Group: { serviceUrl: '/management/module/group/:groupId/app/:appId' },
		Client_Form_App_List_Hotel: { serviceUrl: '/management/module/group/:groupId/hotel/:hotelId/app/:appId' },
		Client_Form_App_Update_Group: { serviceUrl: '/management/module/group/:groupId' },
		Client_Form_App_Update_Hotel: { serviceUrl: '/management/module/group/:groupId/hotel/:hotelId' },

		User_List_All: { serviceUrl: '/ham/auth/listusers' },
		User_List_Group: { serviceUrl: '/ham/auth/listusers/group/:groupId' },
		User_List_Hotel: { serviceUrl: '/ham/auth/listusers/group/:groupId/hotel/:hotelId' },
		User_List_Remove_All: { serviceUrl: '/ham/auth/deleteuser' },
		User_List_Remove_Group: { serviceUrl: '/ham/auth/deleteuser/group/:groupId' },
		User_List_Remove_Hotel: { serviceUrl: '/ham/auth/deleteuser/group/:groupId/hotel/:hotelId' },
		User_List_Search_All: { serviceUrl: '/ham/auth/searchusers' },
		User_List_Search_Group: { serviceUrl: '/ham/auth/searchusers/group/:groupId' },
		User_List_Search_Hotel: { serviceUrl: '/ham/auth/searchusers/group/:groupId/hotel/:hotelId' },
		User_Form_Update_All: { serviceUrl: '/ham/auth/updateuser' },
		User_Form_Update_Group: { serviceUrl: '/ham/auth/updateuser/group/:groupId' },
		User_Form_Update_Hotel: { serviceUrl: '/ham/auth/updateuser/group/:groupId/hotel/:hotelId' },
		User_Form_Create_All: { serviceUrl: '/ham/auth/createuser' },
		User_Form_Create_Group: { serviceUrl: '/ham/auth/createuser/group/:groupId' },
		User_Form_Create_Hotel: { serviceUrl: '/ham/auth/createuser/group/:groupId/hotel/:hotelId' },
		User_Form_Confirm_All: { serviceUrl: '/ham/auth/confirmuser' },
		User_Form_Confirm_Group: { serviceUrl: '/ham/auth/confirmuser/group/:groupId' },
		User_Form_Confirm_Hotel: { serviceUrl: '/ham/auth/confirmuser/group/:groupId/hotel/:hotelId' },

		Broadcast_List_All: { serviceUrl: '/notification/broadcast/list' },
		Broadcast_Form_Create_All: { serviceUrl: '/notification/broadcast/create' },

		Version_List_All: { serviceUrl: '/config/version' },
		Version_List_Remove_All: { serviceUrl: '/config/version/delete' },
		Version_Form_Create_All: { serviceUrl: '/config/version/create' }
	}
};

// local-storage items
export const LocalStorageItems = {
	userState: 'ham-local-us',
	appState: 'ham-local-as',
	notificationState: 'ham-local-ns'
};

// session-storage items
export const SessionStorageItems = {
	userState: 'ham-session-us',
	appState: 'ham-session-as',
	notificationState: 'ham-session-ns'
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
