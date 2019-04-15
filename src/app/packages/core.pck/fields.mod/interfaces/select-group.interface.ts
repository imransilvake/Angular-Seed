// select type interface
export interface SelectGroupInterface {
	disabled?: boolean;
	name: string;
	items: SelectGroupItems[];
}

// group items
export interface SelectGroupItems {
	value: string;
	viewValue: string;
}
