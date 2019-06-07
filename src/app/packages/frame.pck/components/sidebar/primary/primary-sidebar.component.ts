// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { SidebarInterface } from '../../../interfaces/sidebar.interface';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { AppViewStateInterface } from '../../../interfaces/app-view-state.interfsce';

@Component({
	selector: 'app-sidebar-primary',
	templateUrl: './primary-sidebar.component.html',
	styleUrls: ['./primary-sidebar.component.scss']
})

export class PrimarySidebarComponent implements OnInit, OnDestroy {
	@Input() drawerState;

	public formFields;
	public treeControl = new NestedTreeControl<SidebarInterface>(node => node.children);
	public sidebarMenuList = new MatTreeNestedDataSource<SidebarInterface>();
	public hotelSelectType = SelectTypeEnum.GROUP_CUSTOM;
	public hotelGroupList;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _sidebarService: SidebarService
	) {
		// set side menu
		this.sidebarMenuList.data = SidebarService.getSidebarMenuList();
		this.treeControl.dataNodes = this.sidebarMenuList.data;

		// form group
		this.formFields = new FormGroup({
			hotelByGroupList: new FormControl('')
		});
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

		// listen: get hotel by group list
		this._sidebarService.getHotelsByGroup()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// set hotel by group list
					this.hotelGroupList = res;

					// get app state
					const appState = this._sidebarService.appState;

					// set current value
					this.hotelByGroupList.setValue(appState.id);
				}
			});

		// listen: on hotels by group selection
		this.hotelByGroupList.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				let payload: AppViewStateInterface;
				if (typeof res === 'object') {
					payload = {
						id: res.id,
						text: res.text,
						type: AppViewTypeEnum.HOTEL
					};
				} else {
					payload = {
						id: res,
						type: (res.toLowerCase() === 'all') ? AppViewTypeEnum.ALL : AppViewTypeEnum.GROUP
					};
				}

				// set app state
				this._sidebarService.appState = payload;

				// refresh current route
				this._router.navigate([this._router.url]).then();
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get hotelByGroupList() {
		return this.formFields.get('hotelByGroupList');
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
