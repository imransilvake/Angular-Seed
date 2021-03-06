// select type interface
export interface SelectGroupInterface {
	disabled?: boolean;
	name: string;
	id?: string;
	items?: SelectGroupItems[];
}

// group items
export interface SelectGroupItems {
	id: string;
	text: string;
}
