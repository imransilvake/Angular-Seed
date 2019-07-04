// license & system interface
export interface LicenseSystemInterface {
	GroupID: string;
	Name: string;
	Address: AddressInterface;
	License: LicenseInterface;
	System: SystemInterface;
}

// address interface
interface AddressInterface {
	Address1: string;
	Address2: string;
	PostalCode: string;
	City: string;
	Country: string;
}

// license interface
interface LicenseInterface {
	HGA: {
		NumberOfHotels: number;
		NumberOfUsers: number;
		NumberOfUserBlocks: number;
	};
	HSA: {
		NumberOfHotels: number;
		NumberOfUsers: number;
		NumberOfUserBlocks: number;
	};
}

// system interface
interface SystemInterface {
	BackendEndpointURL?: string;
	BackendUsername?: string;
	BackendPassword?: string;
	BackendEndpointToken?: string;
	IsReservationRequired?: boolean;
	UseTargetGroups?: boolean;
	Languages?: Array<string>;
	BackendType?: string;
	SyncInterval?: string;
}
