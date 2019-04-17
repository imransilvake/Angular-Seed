// angular
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// app
import { ScrollTopService } from './packages/utilities.pck/accessories.mod/services/scroll-top.service';
import { HelperService } from './packages/utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-layout',
	templateUrl: './app-layout.component.html',
	styleUrls: ['./app-layout.component.scss']
})

export class AppLayoutComponent implements AfterViewInit {
	@ViewChild('topHead') topHead: ElementRef;

	public drawerState = false;
	public topHeadHeight = 67;

	constructor(
		private _scrollTopService: ScrollTopService,
		private _helperService: HelperService
	) {
	}

	ngAfterViewInit() {
		// listen scroll to top
		this._scrollTopService.scrollTopListener();

		// listen to scroll event
		this._helperService.detectScroll().subscribe(() => {
			// set top Head height
			this.calculateTopHeadHeight();
		});

		// listen to resize event
		this._helperService.detectWindowResize().subscribe(() => {
			// set top Head height
			this.calculateTopHeadHeight();
		});
	}

	/**
	 * on click top head block
	 */
	public onClickTopHead() {
		// set top Head height
		this.calculateTopHeadHeight();
	}

	/**
	 * calculate and set top Head height
	 */
	public calculateTopHeadHeight() {
		const topHeadHeight = this.topHead && this.topHead.nativeElement && this.topHead.nativeElement.offsetHeight;
		if (topHeadHeight !== this.topHeadHeight) {
			this.topHeadHeight = topHeadHeight;
		}
	}
}
