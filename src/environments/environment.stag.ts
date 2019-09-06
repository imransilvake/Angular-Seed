// app
import { EnvironmentRoutes } from './environment-routes';

// stag environment
export const environment = {
	production: true,
	mapBox: {
		accessToken: 'pk.eyJ1IjoiaW1yYW5zaWx2YWtlIiwiYSI6ImNqenlmb2JnZjB1bGQzY3FwNTQxYjA4bHIifQ.GDFD-gYA9EjaE6jDZCvyrA'
	}
};

export const APP_URL = 'http://localhost:3000';
export const ENV_SERVICE_URL = 'https://7wrr6msrh4.execute-api.eu-central-1.amazonaws.com/prod';

// routing
export const ROUTING = EnvironmentRoutes;
