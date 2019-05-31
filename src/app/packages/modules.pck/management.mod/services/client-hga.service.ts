// angular
import { Injectable } from '@angular/core';

// app
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable()
export class ClientHgaService {
	constructor(private _i18n: I18n) {
	}

	/**
	 * get HGA modules
	 *
	 */
	public fetchHGAModules() {
		const response = [
			{
				'ModuleID': 'HGA_GUEST_NOTIFICATIONS',
				'Licensed': true,
				'Active': true,
				'Preferred': 1,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_KEY',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_CLEANING_STATUS',
				'Licensed': true,
				'Active': false,
				'Preferred': 1,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_EMERGENCY_BUTTON',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_REPAIR_MESSAGE',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_DEALS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_DETAILS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_GUEST_DETAILS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_MAGAZINE_HOTEL_MAGAZINE',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_REVIEWS_TRUSTYOU',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			}
		];
		return this.mapHGAModules(response);
	}

	/**
	 * map HGA modules
	 *
	 * @param response
	 */
	public mapHGAModules(response) {
		return [
			{
				'name': 'General',
				'modules': [
					...(response.filter(module => module.ModuleID === 'HGA_GUEST_NOTIFICATIONS'))
				]
			},
			{
				'name': 'Hotel Room',
				'modules': [
					...(
						response.filter(module =>
							module.ModuleID === 'HGA_ROOM_KEY' ||
							module.ModuleID === 'HGA_ROOM_CLEANING_STATUS' ||
							module.ModuleID === 'HGA_ROOM_EMERGENCY_BUTTON' ||
							module.ModuleID === 'HGA_ROOM_REPAIR_MESSAGE'
						)
					)
				]
			},
			{
				'name': 'Hotel General',
				'modules': [
					...(
						response.filter(module =>
							module.ModuleID === 'HGA_HOTEL_DEALS' ||
							module.ModuleID === 'HGA_HOTEL_DETAILS' ||
							module.ModuleID === 'HGA_HOTEL_GUEST_DETAILS'
						)
					)
				]
			},
			{
				'name': 'Hotel Magazine',
				'modules': [
					...(response.filter(module => module.ModuleID === 'HGA_MAGAZINE_HOTEL_MAGAZINE'))
				]
			},
			{
				'name': 'Hotel Reviews',
				'modules': [
					...(response.filter(module => module.ModuleID === 'HGA_REVIEWS_TRUSTYOU'))
				]
			}
		];
	}
}
