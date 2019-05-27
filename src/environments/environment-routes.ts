export const EnvironmentRoutes = {
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
		title: 'member',
		routes: {
			profile: 'member/profile'
		}
	},
	management: {
		title: 'management',
		routes: {
			user: 'management/user',
			client: 'management/client',
			notification: 'management/notification'
		}
	}
};
