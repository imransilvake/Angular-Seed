export interface SidebarInterface {
	section?: string;
	name: string;
	icon?: any;
	externalIcon?: any;
	url?: string;
	enabled?: boolean;
	children?: SidebarInterface[];
}
