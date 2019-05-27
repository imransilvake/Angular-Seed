// app
import { EnvironmentRoutes } from './environment-routes';

// prod environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:4000';
export const ENV_SERVICE_URL = 'https://c7o8rvuk52.execute-api.eu-west-1.amazonaws.com/dev';

// routing
export const ROUTING = EnvironmentRoutes;
