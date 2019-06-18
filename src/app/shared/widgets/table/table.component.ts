// angular
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ProxyService } from '../../../packages/core.pck/proxy.mod/services/proxy.service';
import { SidebarService } from '../../../packages/frame.pck/services/sidebar.service';
import { AppOptions } from '../../../../app.config';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {
	@Output() rowId: EventEmitter<any> = new EventEmitter();

	@Input() tableTitle;
	@Input() inputName;
	@Input() inputPlaceHolder;
	@Input() tableColumns = [];
	@Input() tableAdditionalColumns = [];
	@Input() tableData;
	@Input() tablePageSize = AppOptions.tablePageSizeLimit - 1;
	@Input() tablePagination = [5, 10, 20, 50, 100, 200];
	@Input() templateRef;
	@Input() currentApiUrl;

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
		private _sidebarService: SidebarService
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

		// set page info
		this.setTableInformation();

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
		this.dataSource = new MatTableDataSource<any>(this.tableData.data);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	/**
	 * validate whether string contains a text or an image
	 *
	 * @param value
	 */
	public validateExtension(value) {
		return value && value.split('.').pop();
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
	 * get row id
	 *
	 * @param rowId
	 */
	public onClickRow(rowId: number) {
		this.rowId.emit(rowId);
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

			// set payload
			const payload = {
				pathParams: {
					groupId: this._sidebarService.appState.groupId,
					hotelId: this._sidebarService.appState.hotelId
				},
				queryParams: {
					offset: (pageIndex * this.tablePageSize) + 1,
					limit: this.tablePageSize
				}
			};

			// service
			this._proxyService
				.getAPI(this.currentApiUrl, payload)
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(res => {
					// stop animation
					this.loading = false;

					// set table data
					res.data.forEach(item => {
						if (!this.dataSource.data.includes(item)) {
							this.dataSource.data = [...this.dataSource.data, item];
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
