// sidebar menu interface
export interface SidebarInterface {
	name: string;
	icon?: any;
	section?: string;
	url?: string;
	children?: SidebarInterface[];
}
