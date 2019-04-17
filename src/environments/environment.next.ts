// next environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:5000';
export const ENV_SERVICE_URL = 'https://x83n6pnzlj.execute-api.eu-west-1.amazonaws.com/next';

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
