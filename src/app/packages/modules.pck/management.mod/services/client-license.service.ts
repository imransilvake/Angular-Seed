// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable()
export class ClientLicenseService {
	constructor(private _i18n: I18n) {
	}

	/**
	 * HGA/HSA license list
	 */
	public getLicenseList() {
		return [
			{
				id: 1,
				text: this._i18n({
					value: '1 Hotel',
					id: 'HGA_License_List_1'
				}),
				payload: {
					value: 2,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 5,
				text: this._i18n({
					value: '2 to 5 Hotels',
					id: 'HGA_License_List_2_5'
				}),
				payload: {
					value: 12,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 20,
				text: this._i18n({
					value: '6 to 20 Hotels',
					id: 'HGA_License_List_6_20'
				}),
				payload: {
					value: 56,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 50,
				text: this._i18n({
					value: '21 to 50 Hotels',
					id: 'HGA_License_List_21_50'
				}),
				payload: {
					value: 150,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 100,
				text: this._i18n({
					value: '51 to 100 Hotels',
					id: 'HGA_License_List_51_100'
				}),
				payload: {
					value: 320,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 150,
				text: this._i18n({
					value: '101 to 150 Hotels',
					id: 'HGA_License_List_101_150'
				}),
				payload: {
					value: 510,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			},
			{
				id: 250,
				text: this._i18n({
					value: '151 to 250 hotels',
					id: 'HGA_License_List_151_250'
				}),
				payload: {
					value: 900,
					text: this._i18n({
						value: 'Users',
						id: 'HGA_License_Users'
					})
				}
			}
		];
	}
}
