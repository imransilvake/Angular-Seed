// next environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:5000';
export const ENV_REST_SERVICE_URL = '/cms/rest';
export const ENV_AUTH_TOKEN = 'f691733b04f0b0faf0df80a500542490fdf27c334e66d7f7c9e7980c960f6afc';

// routing
export const ROUTING = {
	dashboard: 'dashboard',
	authorization: {
		login: 'auth/login',
		register: 'auth/register',
		reset: 'auth/reset',
		lock: 'auth/lock'
	}
};
