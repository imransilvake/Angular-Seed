// angular
import { Component, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';

// app
import { SidebarInterface } from '../../../interfaces/sidebar.interface';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
	selector: 'app-sidebar-primary',
	templateUrl: './primary-sidebar.component.html'
})

export class PrimarySidebarComponent {
	@Input() drawerState;

	public treeControl = new NestedTreeControl<SidebarInterface>(node => node.children);
	public sidebarMenuList = new MatTreeNestedDataSource<SidebarInterface>();

	constructor(private _sidebarService: SidebarService) {
		this.sidebarMenuList.data = this._sidebarService.getSidebarMenuList();
	}

	/**
	 * check child
	 *
	 * @param _
	 * @param node
	 */
	public hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
}
