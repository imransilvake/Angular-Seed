// autocomplete type interface
export interface AutocompleteGroupInterface {
	disabled?: boolean;
	name: string;
	items?: AutocompleteGroupItems[];
}

// group items
export interface AutocompleteGroupItems {
	id: string;
	text: string;
}
