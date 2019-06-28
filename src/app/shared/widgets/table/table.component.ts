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

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {
	@Output() rowData: EventEmitter<any> = new EventEmitter();

	@Input() tableTitle;
	@Input() inputName;
	@Input() inputPlaceHolder;
	@Input() tableColumns = [];
	@Input() tableAdditionalColumns = [];
	@Input() tableData;
	@Input() tablePageSize = AppOptions.tablePageSizeLimit - 1;
	@Input() templateRef;
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

	constructor(private _proxyService: ProxyService) {
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
	 * initialize table
	 */
	public initializeTable() {
		// set image url
		this.tableData.data = this.tableData.data && this.tableData.data.map(item => {
			if (item.Image && item.Image.length > 10) {
				const imagePromise = this.getImageSrc(item.Image);
				return {
					...item,
					Image: imagePromise
				};
			} else {
				return item;
			}
		});

		// set data to table
		this.dataSource = new MatTableDataSource<any>(this.tableData.data);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		// set page info
		this.setTableInformation();
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
	 * get page data on page change
	 *
	 * @param pageInfo
	 */
	public onChangePagination(pageInfo) {
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
					offset: (pageIndex * this.tablePageSize) + 1,
					limit: this.tablePageSize
				}
			};

			// service
			this._proxyService
				.getAPI(this.tableResources.api, payload)
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => {
					// stop animation
					this.loading = false;

					// update table data
					res.data.forEach(item => {
						const id = this.tableResources.uniqueID;
						if (!this.dataSource.data.some(row => row[id] === item[id])) {
							console.log(item);
							let newItem;
							if (item.Image && item.Image.length > 10) {
								const imagePromise = this.getImageSrc(item.Image);
								newItem = {
									...item,
									Image: imagePromise
								};
							} else {
								const image = item.Image === null && item.Name ? HelperService.getFirstLetter(item.Name).toUpperCase() : item.Image;
								newItem = {
									...item,
									Image: image
								};
							}

							// update data source
							this.dataSource.data = [...this.dataSource.data, newItem];
						}
					});
				});
		}
	}

	/**
	 * filter table content
	 *
	 * @param inputValue
	 */
	private applyFilter(inputValue: string) {
		this.dataSource.filter = inputValue.trim().toLowerCase();

		// move to first page.
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
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
}
