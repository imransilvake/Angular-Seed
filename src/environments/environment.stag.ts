// app
import { EnvironmentRoutes } from './environment-routes';

// stag environment
export const environment = {
	production: true,
	mapBox: {
		accessToken: 'YOUR_TOKEN'
	}
};

export const APP_URL = 'http://localhost:3000';
export const ENV_SERVICE_URL = 'https://c7o8rvuk52.execute-api.eu-west-1.amazonaws.com/stag';

// routing
export const ROUTING = EnvironmentRoutes;
