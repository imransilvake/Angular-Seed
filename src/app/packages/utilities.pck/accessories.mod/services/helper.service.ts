// angular
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelperService {
	/**
	 * detect: scroll
	 */
	public static detectScroll() {
		return fromEvent(window, 'scroll');
	}
}
