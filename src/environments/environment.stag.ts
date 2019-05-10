// stag environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:3000';
export const ENV_SERVICE_URL = 'https://c7o8rvuk52.execute-api.eu-west-1.amazonaws.com/stag';

// routing
export const ROUTING = {
	dashboard: 'dashboard',
	pages: {
		maintenance: 'maintenance'
	},
	authorization: {
		login: 'auth/login',
		register: 'auth/register',
		forgot: 'auth/forgot',
		reset: 'auth/reset',
		lock: 'auth/lock'
	},
	member: {
		profile: 'member/profile'
	}
};
