// angular
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ProxyService } from '../../../packages/core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../app.config';
import { HelperService } from '../../../packages/utilities.pck/accessories.mod/services/helper.service';
import { UtilityService } from '../../../packages/utilities.pck/accessories.mod/services/utility.service';
import { AuthService } from '../../../packages/modules.pck/authorization.mod/services/auth.service';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {
	@Output() rowData: EventEmitter<any> = new EventEmitter();

	@Input() tableTitle;
	@Input() tableShowFilterInput = true;
	@Input() tableFilterInputName;
	@Input() tableFilterInputPlaceHolder;
	@Input() tableColumns = [];
	@Input() tableApplySorting = true;
	@Input() tableSorting = [];
	@Input() tableAdditionalColumns = [];
	@Input() tableData;
	@Input() tablePageSize = AppOptions.tablePageSizeLimit - 1;
	@Input() tableTemplateRef;
	@Input() tableResources;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('filterInput', { static: false }) filterInput: ElementRef;

	public allColumns = [];
	public formFields;
	public dataSource;
	public loading = false;
	public tableInfo;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _proxyService: ProxyService,
		private _utilityService: UtilityService,
		private _authService: AuthService
	) {
		// form group
		this.formFields = new FormGroup({
			search: new FormControl('')
		});
	}

	ngOnInit() {
		// add additional columns
		this.allColumns = this.tableColumns.concat(this.tableAdditionalColumns);

		// initialize table
		this.initializeTable();

		// filter search results
		this.search.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.applyFilter(res));
	}

	ngOnChanges() {
		// move to first page when clicked on refresh button from header area.
		// when component input is changed
		if (this.dataSource && this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}

		// clear input
		this.search.setValue('');

		// re-initialize table
		this.initializeTable();
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get search() {
		return this.formFields.get('search');
	}

	/**
	 * validate variable type
	 *
	 * @param value
	 */
	public validateType(value) {
		return typeof value;
	}

	/**
	 * async wait for image
	 *
	 * @param imageName
	 */
	async getImageSrc(imageName) {
		const response = await this._proxyService
			.postAPI(AppServices['Utilities']['Fetch_Profile_Image'], { bodyParams: { image: imageName } })
			.toPromise();

		return typeof response.image === 'string' ? response.image : null;
	}

	/**
	 * get row id
	 *
	 * @param row
	 */
	public onClickRow(row: number) {
		this.rowData.emit(row);
	}

	/**
	 * initialize table
	 */
	public initializeTable(dataSource?: any) {
		const d = dataSource ? dataSource.data : this.tableData.data;
		if (d) {
			// set data to table
			this.dataSource = new MatTableDataSource<any>([]);

			// update table data
			this.mapData(d, !!dataSource);

			// add pagination
			this.dataSource.paginator = this.paginator;

			// add sorting
			this.dataSource.sort = this.sort;

			// update table data
			if (dataSource) {
				this.tableData = dataSource;
			}

			// set page info
			this.setTableInformation();
		} else {
			// set data to table
			this.dataSource = new MatTableDataSource<any>([]);
		}
	}

	/**
	 * map user
	 *
	 * @param data
	 * @param init
	 */
	private mapData(data, init?: boolean) {
		if (data) {
			data.forEach(item => {
				const id = this.tableResources.uniqueID;
				if (!this.dataSource.data.some(row => row[id] === item[id])) {
					let newItem = item;
					// Image
					if (item.hasOwnProperty('Image')) {
						if (item.Image && item.Image.length > 10) {
							const imagePromise = this.getImageSrc(item.Image);
							newItem = {
								...newItem,
								Image: imagePromise
							};
						} else {
							const image = item.Image === null && item.Name ? HelperService.getFirstLetter(item.Name).toUpperCase() : item.Image;
							newItem = {
								...newItem,
								Image: image
							};
						}
					}

					// Role
					if (item.hasOwnProperty('Type')) {
						const role = item.Type ? HelperService.capitalizeString(item.Type.replace(/_/g, ' ').toLowerCase()) : '-';
						newItem = {
							...newItem,
							Role: role
						};
					}

					// Hotels
					if (item.hasOwnProperty('HotelIDs')) {
						const hotels = [];
						if (item && item.HotelIDs && typeof item.HotelIDs !== 'string') {
							item.HotelIDs.forEach(hotel => {
								if (hotel.split('_')[1]) {
									hotels.push(this._utilityService.hotelList[hotel]);
								}
							});
						}
						newItem = {
							...newItem,
							Hotels: hotels && hotels.length ? hotels.join(', ') : 'ALL'
						};
					}

					// Create Date
					if (item.hasOwnProperty('CreateDate')) {
						const date = item.CreateDate ? HelperService.getUTC(this._authService.currentUserState.profile.language, item.CreateDate) : '-';
						newItem = {
							...newItem,
							'Reg. Date': date
						};
					}

					// Login Date
					if (item.hasOwnProperty('LoginDate')) {
						const date = item.LoginDate ? HelperService.getUTC(this._authService.currentUserState.profile.language, item.LoginDate) : '-';
						newItem = {
							...newItem,
							'Last Login': date
						};
					}

					// Creator
					if (item.hasOwnProperty('LoginDate')) {
						newItem = {
							...newItem,
							Creator: item.Creator ? item.Creator : '-'
						};
					}

					// update data source
					if (!init) {
						this.dataSource.data = [...this.dataSource.data, newItem];
					} else {
						this.dataSource.data.push(newItem);
					}
				}
			});
		}
	}

	/**
	 * set table information
	 */
	private setTableInformation(currentPageIndex?: number) {
		const pageIndex = currentPageIndex || 0;
		const total = this.tableData.total;
		const pageSize = this.tablePageSize;
		const from = (pageSize * pageIndex) + 1;
		const to = (pageSize * (pageIndex + 1) > total) ? total : pageSize * (pageIndex + 1);
		this.tableInfo = total > 0 ? `${from} - ${to} of ${total}` : null;
	}

	/**
	 * get page data on page change
	 *
	 * @param pageInfo
	 */
	public onChangeNextPage(pageInfo) {
		const prevPageIndex = pageInfo.previousPageIndex;
		const pageIndex = pageInfo.pageIndex;

		// set page info
		this.setTableInformation(pageIndex);

		// validate next click
		if (pageInfo.pageIndex > prevPageIndex) {
			// start animation
			this.loading = true;

			// payload
			const payload = {
				...this.tableResources.payload,
				queryParams: {
					...this.tableResources.payload.queryParams,
					offset: pageIndex ? (pageIndex * this.tablePageSize) + 1 : 0,
					limit: this.tablePageSize
				}
			};

			// load next data
			this.loadNextData(this.tableResources.api, payload, pageIndex);
		}
	}

	/**
	 * filter table content
	 *
	 * @param inputValue
	 */
	private applyFilter(inputValue: string) {
		// start animation
		this.loading = true;

		// payload
		const payload = {
			...this.tableResources.payload,
			queryParams: {
				...this.tableResources.payload.queryParams,
				offset: 0,
				limit: this.tablePageSize
			}
		};

		// case: text search
		if (inputValue) {
			const payloadWithInput = {
				...payload,
				queryParams: {
					...payload.queryParams,
					term: inputValue.toLowerCase()
				}
			};

			// load next data
			this.loadNextData(this.tableResources.searchApi, payloadWithInput, -1);
		} else {
			const payloadUpdate = {
				...payload,
				queryParams: {
					...payload.queryParams,
					limit: this.tablePageSize + 1
				}
			};

			// load next data
			this.loadNextData(this.tableResources.api, payloadUpdate, 0);
		}

		// move to first page.
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * load next data
	 *
	 * @param pageIndex
	 * @param api
	 * @param payload
	 */
	private loadNextData(api: any, payload: any, pageIndex?: number) {
		this._proxyService
			.getAPI(api, payload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// stop animation
				this.loading = false;

				// works when search is empty
				if (pageIndex === 0) {
					// update table data
					this.tableData = res;

					// update pagination info
					this.setTableInformation();
				}

				// case: text search
				if (pageIndex === -1) {
					this.initializeTable(res);
				} else {
					this.mapData(res.data);
				}
			});
	}
}
