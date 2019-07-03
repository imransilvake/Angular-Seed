// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { SidebarInterface } from '../../../interfaces/sidebar.interface';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { AppViewStateInterface } from '../../../interfaces/app-view-state.interfsce';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { AppStateEnum } from '../../../enums/app-state.enum';
import { RouterService } from '../../../../utilities.pck/accessories.mod/services/router.service';
import { UserRoleEnum } from '../../../../modules.pck/authorization.mod/enums/user-role.enum';

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
	public hotelGroupSelectType = SelectTypeEnum.GROUP_CUSTOM;
	public hotelGroupList;
	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _sidebarService: SidebarService,
		private _authService: AuthService,
		private _routerService: RouterService
	) {
		// set side menu
		this.sidebarMenuList.data = this._sidebarService.getSidebarMenuList();
		this.treeControl.dataNodes = this.sidebarMenuList.data;

		// form group
		this.formFields = new FormGroup({
			hotelByGroupList: new FormControl('')
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._sidebarService.appState.role;

		// listen: update hotel by groups dropdown on route view change
		this._sidebarService.hotelGroupListEvent
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				this.updateHotelByGroupList(res);
			});

		// listen: show hotel group list dropdown on selected routes
		this._routerService.routeChanged
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const isAllow = this._sidebarService.hotelGroupListRoutes.includes(this._router.url);
				this.updateHotelByGroupList(isAllow);
			});

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

					// select option
					if (appState.type === 0) {
						this.hotelByGroupList.setValue('All');
					} else if (appState.type === 1) {
						this.hotelByGroupList.setValue(appState.groupId);
					} else {
						this.hotelByGroupList.setValue(appState.hotelId);
					}
				}
			});

		// listen: on hotels by group selection
		this.hotelByGroupList.valueChanges
			.pipe(
				takeUntil(this._ngUnSubscribe),
				distinctUntilChanged()
			)
			.subscribe(res => {
				if (res) {
					let payload: AppViewStateInterface;
					if (res !== 'All') {
						payload = {
							hotelId: res,
							groupId: res.split('_')[0],
							type: res.split('_')[1] ? AppStateEnum.HOTEL : AppStateEnum.GROUP
						};
					} else {
						payload = {
							hotelId: res,
							groupId: res.split('_')[0],
							type: AppStateEnum.ALL
						};
					}

					// set app state
					this._sidebarService.appState = {
						...payload,
						role: this._authService.currentUserState.profile['cognito:groups'][0]
					};

					// refresh current route
					this._router.navigate([this._router.url]).then();
				}
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

	/**
	 * update hotel by groups dropdown
	 *
	 * @param status
	 */
	public updateHotelByGroupList(status: boolean) {
		if (status) {
			if (this.hotelByGroupList.disabled) {
				this.hotelByGroupList.enable();
			}
		} else {
			if (!this.hotelByGroupList.disabled) {
				this.hotelByGroupList.disable();
			}
		}
	}

	/**
	 * filter menu list based on role
	 *
	 * @param page
	 */
	public filterMenuListByRole(page: string) {
		return page !== 'Broadcast' || page === 'Broadcast' && this.currentRole === this.roleAdmin;
	}
}
