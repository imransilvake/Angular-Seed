// hga interface
export interface ClientAppInterface {
	AppID: string;
	GroupID: string;
	Modules: Array<HGAModulesInterface>;
}

interface HGAModulesInterface {
	ModuleID: string;
	Licensed: boolean;
	Active: boolean;
	Preferred: number | boolean;
	Params: object;
}
