// angular
import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';

// app
import { UserRoleEnum } from '../../../modules.pck/authorization.mod/enums/user-role.enum';
import * as jwt_decode from 'jwt-decode';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
declare const document: any;

@Injectable({ providedIn: 'root' })
export class HelperService {
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	/**
	 * toggle: overflow class on html and body element.
	 *
	 * @param {boolean} status
	 */
	public static overflowToggle(status: boolean) {
		if (status) {
			const root = document.getElementsByTagName('html')[0];
			const body = document.getElementsByTagName('body')[0];

			// add class to body: hide overflow
			root.setAttribute('class', 'cd-hide-overflow');
			body.setAttribute('class', 'cd-hide-overflow');
		} else {
			// remove class from body: show overflow
			document.body.className = document.body.className.replace('cd-hide-overflow', '');
			document.documentElement.className = document.documentElement.className.replace('cd-hide-overflow', '');
		}
	}

	/**
	 * detect view: app or desktop
	 */
	static get isDesktopView() {
		return window && window.innerWidth >= 768;
	}

	/**
	 * detect: window resize
	 */
	public static detectWindowResize() {
		return fromEvent(window, 'resize');
	}

	/**
	 * detect: scroll
	 */
	public static detectScroll() {
		return fromEvent(window, 'scroll');
	}

	/**
	 * detect: full-screen
	 */
	public static detectFullScreen() {
		return merge(
			fromEvent(document, 'fullscreenchange').pipe(debounceTime(200)),
			fromEvent(document, 'webkitfullscreenchange').pipe(debounceTime(200)),
			fromEvent(document, 'mozfullscreenchange').pipe(debounceTime(200)),
			fromEvent(document, 'MSFullscreenChange').pipe(debounceTime(200))
		);
	}

	/**
	 * open document in full-screen
	 */
	public static showFullScreen() {
		// request
		const elem = document.documentElement;
		const methodToBeInvoked =
			elem.requestFullscreen ||
			elem.webkitRequestFullScreen ||
			elem.mozRequestFullScreen ||
			elem.msRequestFullscreen;

		// invoke
		if (methodToBeInvoked) {
			methodToBeInvoked.call(elem);
		}
	}

	/**
	 * decode jwt token
	 *
	 * @param token
	 */
	public static decodeJWTToken(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	/**
	 * hash the password
	 *
	 * @param password
	 */
	public static hashPassword(password: string) {
		return CryptoJS.SHA3(password).toString();
	}

	/**
	 * stop propagation
	 */
	public static stopPropagation($event) {
		$event.stopPropagation();
	}

	/**
	 * prevent default
	 */
	public static preventDefault($event) {
		$event.preventDefault();
	}

	/**
	 * stop propagation from active element
	 *
	 * @param event
	 */
	public static stopPropagationFromActiveElement(event: any) {
		if (event && event.target && event.target.childNodes) {
			event.target.childNodes.forEach(element => {
				if (element && element.className && element.className.indexOf('ham-active') !== -1) {
					HelperService.stopPropagation(event);
				}
			});
		}
	}

	/**
	 * make first letter uppercase of each word in a string
	 *
	 * @param value
	 */
	public static capitalizeString(value: string) {
		return value.replace(/\w\S*/g, (txt) => {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	/**
	 * get first letter of each word in a string
	 *
	 * @param value
	 */
	public static getFirstLetter(value: string) {
		return value.match(/\b\w/g).join('');
	}

	/**
	 * flat nested arrays
	 *
	 * @param array
	 */
	public static flatNestedArrays(array: any) {
		return [].concat(...array);
	}

	/**
	 * multilingual date
	 *
	 * @param lang
	 * @param date
	 * @param dateFormat
	 */
	public static getDate(lang: string, date: any, dateFormat?: string) {
		const format = dateFormat ? dateFormat : 'DD. MMMM YYYY';
		return moment(date).locale(lang).format(format);
	}

	/**
	 * multilingual date time
	 *
	 * @param lang
	 * @param date
	 * @param dateFormat
	 */
	public static getDateTime(lang: string, date: any, dateFormat?: string) {
		const format = dateFormat ? dateFormat : 'DD. MMMM YYYY, HH:mm:ss';
		return moment(date).locale(lang).format(format);
	}

	/**
	 * multilingual from now
	 *
	 * @param lang
	 * @param date
	 */
	public static getDateFromNow(lang: string, date: any) {
		return moment(date).locale(lang).fromNow();
	}

	/**
	 * utc date
	 *
	 * @param date
	 */
	public static getUTCDate(date: any) {
		return date.utc().format();
	}

	/**
	 * permission level 1: Admin
	 *
	 * @param currentRole
	 */
	public permissionLevel1(currentRole: string) {
		return (currentRole === this.roleAdmin);
	}
}
