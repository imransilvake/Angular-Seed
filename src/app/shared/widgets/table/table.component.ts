// angular
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnDestroy {
	@Input() tableTitle;
	@Input() inputName;
	@Input() inputPlaceHolder;
	@Input() tableColumns = [];
	@Input() tableAdditionalColumns = [];
	@Input() tableData;
	@Input() tablePagination = [5, 10, 20, 50, 100, 200];
	@Input() templateRef;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filterInput') filterInput: ElementRef;

	public allColumns = [];
	public formFields;
	public dataSource: any;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor() {
		// form group
		this.formFields = new FormGroup({
			search: new FormControl('')
		});
	}

	ngOnInit() {
		// add additional columns
		this.allColumns = this.tableColumns.concat(this.tableAdditionalColumns);

		// initialize
		this.dataSource = new MatTableDataSource<any>(this.tableData);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		// filter search results
		this.search.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.applyFilter(res));
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
}
