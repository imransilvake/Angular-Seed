// angular
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

// app
import { AppViewTypeEnum } from '../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { GuestOffersService } from '../../services/guest-offers.service';
import { UtilityService } from '../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-guest-offers',
	templateUrl: './guest-offers.component.html'
})

export class GuestOffersComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;
	public data;
	public isHotel = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _utilityService: UtilityService,
		private _guestOffersService: GuestOffersService
	) {
		// listen: router event
		this.router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
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
		this._guestOffersService.currentUser = this._authService.currentUserState;

		// set app state
		this._guestOffersService.appState = this._sidebarService.appState;

		// validate hotel selection
		this.isHotel = this._sidebarService.appState.hotelId.split('_')[1];

		// only available when hotel is selected
		if (this.isHotel) {
			// refresh services
			forkJoin({
				activeHotelOffers: this._guestOffersService.guestHotelOffersFetch(this.id),
				formLanguages: this._utilityService.getSystemSelectedLanguages(this.pageView, this._guestOffersService.appState)
			}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
				const result = {
					activeHotelOffers: res.activeHotelOffers,
					formLanguages: res.formLanguages
				};

				// emit result
				this._guestOffersService.dataEmitter.next(result);
			});
		}
	}
}
