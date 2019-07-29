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
	content: {
		title: 'content',
		routes: {
			guestOffers: 'content/guest-offers',
			guestPushMessage: 'content/guest-push-message',
			guestRepairs: 'content/guest-repairs'
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
			broadcast: 'management/broadcast',
			version: 'management/version'
		}
	}
};
