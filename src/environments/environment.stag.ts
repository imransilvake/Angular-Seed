// stag environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:6000';
export const ENV_SERVICE_URL = 'https://x83n6pnzlj.execute-api.eu-west-1.amazonaws.com/stag';

// routing
export const ROUTING = {
	dashboard: 'dashboard',
	authorization: {
		login: 'auth/login',
		register: 'auth/register',
		forgot: 'auth/forgot',
		confirm: 'auth/confirm',
		lock: 'auth/lock'
	}
};
