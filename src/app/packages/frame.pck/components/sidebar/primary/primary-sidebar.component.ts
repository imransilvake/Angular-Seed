// angular
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';

// app
import { SidebarInterface } from '../../../interfaces/sidebar.interface';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
	selector: 'app-sidebar-primary',
	templateUrl: './primary-sidebar.component.html'
})

export class PrimarySidebarComponent implements OnInit {
	@Input() drawerState;

	public treeControl = new NestedTreeControl<SidebarInterface>(node => node.children);
	public sidebarMenuList = new MatTreeNestedDataSource<SidebarInterface>();

	constructor(
		private _router: Router,
		private _sidebarService: SidebarService
	) {
		this.sidebarMenuList.data = this._sidebarService.getSidebarMenuList();
		this.treeControl.dataNodes = this.sidebarMenuList.data;
	}

	ngOnInit() {
		// open node based on current url
		if (this.treeControl.dataNodes.length > 0) {
			this.treeControl.dataNodes.forEach(node => {
				if (node.children && node.children.length > 0) {
					node.children.forEach(innerNode => {
						if (this._router.url === innerNode.url) {
							this.expandNode(node);
						}
					});
				}
			});
		}
	}

	/**
	 * check child
	 *
	 * @param _
	 * @param node
	 */
	public hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

	/**
	 * expand specific nodes
	 */
	public expandNode(node: SidebarInterface) {
		this.treeControl.expand(node);
	}
}
