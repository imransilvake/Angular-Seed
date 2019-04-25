// angular
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';

// app
declare const document: any;
declare const event: Event;

@Injectable({ providedIn: 'root' })
export class HelperService {
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
	 * detect device: app or browser
	 *
	 * @returns {boolean}
	 */
	public get isApp(): boolean {
		return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
	}

	/**
	 * detect view: app or desktop
	 *
	 * @returns {boolean}
	 */
	public static get isDesktopView(): boolean {
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
	 * detect: key press
	 */
	public static detectKeyPress() {
		return fromEvent(document, 'keyup').pipe(debounceTime(200));
	}

	/**
	 * stop propagation
	 */
	public static stopPropagation() {
		event.stopPropagation();
	}
}
