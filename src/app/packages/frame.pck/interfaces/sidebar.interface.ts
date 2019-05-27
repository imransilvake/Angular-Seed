export interface SidebarInterface {
	section?: string;
	name: string;
	icon?: any;
	externalIcon?: any;
	url?: string;
	children?: SidebarInterface[];
}
