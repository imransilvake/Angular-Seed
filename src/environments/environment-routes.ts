export const EnvironmentRoutes = {
	pages: {
		dashboard: 'dashboard'
	},
	authorization: {
		title: 'authorization',
		routes: {
			login: 'auth/login',
			changePassword: 'auth/change-password'
		}
	},
	tracking: {
		title: 'tracking',
		routes: {
			realtimeMap: 'tracking/map'
		}
	},
	pilgrim: {
		title: 'pilgrim',
		routes: {
			pilgrim: 'pilgrim/overview'
		}
	},
	group: {
		title: 'group',
		routes: {
			group: 'group/overview'
		}
	}
};
