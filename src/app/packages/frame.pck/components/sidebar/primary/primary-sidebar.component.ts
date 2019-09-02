// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

// app
import { SidebarInterface } from '../../../interfaces/sidebar.interface';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { UserRoleEnum } from '../../../../modules.pck/authorization.mod/enums/user-role.enum';

@Component({
	selector: 'app-sidebar-primary',
	templateUrl: './primary-sidebar.component.html',
	styleUrls: ['./primary-sidebar.component.scss']
})

export class PrimarySidebarComponent implements OnInit, OnDestroy {
	@Input() drawerState;

	public treeControl = new NestedTreeControl<SidebarInterface>(node => node.children);
	public sidebarMenuList = new MatTreeNestedDataSource<SidebarInterface>();

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _sidebarService: SidebarService,
		private _authService: AuthService
	) {
		// set side menu
		this.sidebarMenuList.data = SidebarService.getSidebarMenuList();
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

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
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
