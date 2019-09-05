// app
import { EnvironmentRoutes } from './environment-routes';

// next environment
export const environment = {
	production: true,
	mapBox: {
		accessToken: 'YOUR_TOKEN'
	}
};

export const APP_URL = 'http://localhost:2000';
export const ENV_SERVICE_URL = 'https://7wrr6msrh4.execute-api.eu-central-1.amazonaws.com/prod';

// routing
export const ROUTING = EnvironmentRoutes;
