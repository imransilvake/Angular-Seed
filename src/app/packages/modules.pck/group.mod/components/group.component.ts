// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

// app
import { AuthService } from '../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../frame.pck/services/sidebar.service';
import { GroupService } from '../services/group.service';

@Component({
	selector: 'app-group',
	templateUrl: './group.component.html'
})

export class GroupComponent implements OnInit, OnDestroy {
	public groupData;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _groupService: GroupService,
		private _authService: AuthService,
		private _sidebarService: SidebarService
	) {
		// listen: router event
		this._router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
	}

	ngOnInit() {
		// listen: fetch group data
		this._groupService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.groupData) {
					this.groupData = res.groupData;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * trigger all components services
	 */
	public triggerServices() {
		// set current user state
		this._groupService.currentUser = this._authService.currentUserState;

		// set app state
		this._groupService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			groupData: this._groupService.fetchGroupData()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				groupData: res.groupData
			};

			// emit result
			this._groupService.dataEmitter.next(result);
		});
	}
}
