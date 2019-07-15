// push message interface
export interface PushMessageInterface {
	Type: string;
	State: string;
	Title: object;
	Text: object;
	Link: string;
	Colour: string;
	Trigger: string;
	SendDate: string;
	ExpDate: string;
	Targets: Array<string>;
	HotelID: string;
	Access: string;
}
