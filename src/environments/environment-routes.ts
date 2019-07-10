export const EnvironmentRoutes = {
	pages: {
		dashboard: 'dashboard'
	},
	authorization: {
		title: 'authorization',
		routes: {
			login: 'auth/login',
			register: 'auth/register',
			forgot: 'auth/forgot',
			reset: 'auth/reset'
		}
	},
	member: {
		title: 'member',
		routes: {
			profile: 'member/profile'
		}
	},
	guest: {
		title: 'guest',
		routes: {
			offer: 'guest/offer',
			pushMessage: 'guest/push-message'
		}
	},
	notifications: {
		title: 'notifications',
		routes: {
			overview: 'notifications/overview'
		}
	},
	management: {
		title: 'management',
		routes: {
			user: 'management/user',
			client: 'management/client',
			broadcast: 'management/broadcast'
		}
	}
};
