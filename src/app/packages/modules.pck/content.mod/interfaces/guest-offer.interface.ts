// offers interface
export interface GuestOfferInterface {
	Type: string;
	State: string;
	Title: object;
	Text: object;
	Image: string;
	Barcode: boolean;
	Redeem: boolean;
	Trigger: string;
	SendDate: string;
	ExpDate: string;
	Targets: Array<string>;
	HotelID: string;
	Access: string;
}
