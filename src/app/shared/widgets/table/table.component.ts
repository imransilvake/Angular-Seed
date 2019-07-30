// angular
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// app
import { ROUTING } from '../../../../environments/environment';
import { faBan, faEllipsisV, faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { ProxyService } from '../../../packages/core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../app.config';
import { HelperService } from '../../../packages/utilities.pck/accessories.mod/services/helper.service';
import { UtilityService } from '../../../packages/utilities.pck/accessories.mod/services/utility.service';
import { AuthService } from '../../../packages/modules.pck/authorization.mod/services/auth.service';
import { DialogTypeEnum } from '../../../packages/utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../packages/utilities.pck/dialog.mod/services/dialog.service';
import { NotificationsFiltersEnums } from '../../../packages/modules.pck/notification.mod/enums/notifications-filters.enums';
import { SidebarService } from '../../../packages/frame.pck/services/sidebar.service';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {
	@Output() rowClear: EventEmitter<boolean> = new EventEmitter();
	@Output() rowData: EventEmitter<any> = new EventEmitter();

	@Input() tableTitle;
	@Input() tableDragDisabled = true;
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

	public faIcons = [faPlayCircle, faPauseCircle, faBan, faEllipsisV];
	public allColumns = [];
	public formFields;
	public dataSource;
	public loading = false;
	public tableInfo;
	public sortColumn;
	public sortOrder;
	public clearRows = [];
	public checkAllRows = false;
	public staticColors = ['#3b7fc4'];

	public currentRole;
	public permissionLevel2 = false;
	public permissionLevel4 = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _proxyService: ProxyService,
		private _utilityService: UtilityService,
		private _helperService: HelperService,
		private _authService: AuthService,
		private _dialogService: DialogService,
		private _sidebarService: SidebarService,
		private _i18n: I18n
	) {
		// form group
		this.formFields = new FormGroup({
			search: new FormControl(''),
			clearAll: new FormControl(false)
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._sidebarService.appState.role;
		if (this.currentRole) {
			this.permissionLevel2 = this._helperService.permissionLevel2(this.currentRole);
			this.permissionLevel4 = this._helperService.permissionLevel4(this.currentRole);
		}

		// add additional columns
		this.allColumns = this.tableColumns.concat(this.tableAdditionalColumns);

		// initialize table
		this.initializeTable();

		// listen: filter search results
		this.search.valueChanges
			.pipe(
				debounceTime(250),
				takeUntil(this._ngUnSubscribe)
			)
			.subscribe(res => this.applyFilter(res));
	}

	ngOnChanges() {
		// move to first page when clicked on refresh button from header area.
		// when component input is changed
		if (this.dataSource && this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}

		// reset clear rows
		if (this.clearRows.length > 0) {
			// clear list
			this.clearRows = [];

			// stop loading
			this.loading = false;

			// uncheck clear column
			this.clearAll.setValue(false);

			// uncheck rows
			this.checkAllRows = false;
		}

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

	get clearAll() {
		return this.formFields.get('clearAll');
	}

	/**
	 * drag/drop table rows
	 *
	 * @param event
	 */
	public onListDrop(event: CdkDragDrop<any>) {
		// data replica
		const data = this.dataSource.data;

		// move items
		moveItemInArray(data, event.previousIndex, event.currentIndex);

		// update table
		this.dataSource.data = [];
		this.dataSource.data = data;

		let value = 0;
		if (event.currentIndex === 0) {
			const value1 = Number(data[event.currentIndex + 1].Sort);
			const value2 = Number(data[event.currentIndex].Sort);
			value = value1 + value2;
		} else if ((data.length - 1) === event.currentIndex) {
			const value1 = Number(data[event.currentIndex - 1].Sort);
			const value2 = 0;
			value = (value1 + value2) / 2;
		} else {
			const value1 = Number(data[event.currentIndex - 1].Sort);
			const value2 = Number(data[event.currentIndex + 1].Sort);
			value = (value1 + value2) / 2;
		}

		// payload
		const payload = {
			pathParams: {
				...this.tableResources.payload.pathParams
			},
			queryParams: {
				type: 'sort'
			},
			bodyParams:  {
				ID: data[event.currentIndex].ID,
				Sort: Math.floor(value)
			}
		};

		// service
		this._proxyService
			.postAPI(this.tableResources.dragApi, payload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe();
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
	 * validate extension
	 *
	 * @param value
	 */
	public validateExtension(value) {
		if (value) {
			if (value === 'N/A') {
				return true;
			}
			const stringArray = value.split('.');
			const extension = stringArray[stringArray.length - 1];
			return extension === 'png' || extension === 'jpg' || extension === 'jpeg';
		}
		return false;
	}

	/**
	 * async wait for image
	 *
	 * @param imageName
	 */
	async getImageSrc(imageName) {
		const response = await this._proxyService
			.postAPI(AppServices['Utilities']['Profile_Image_Fetch'], { bodyParams: { image: imageName } })
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

			// add client side sorting
			// this.dataSource.sort = this.sort;

			// update table data
			if (dataSource) {
				this.tableData = dataSource;
			}

			// set page info
			this.setTableInformation();
		} else {
			// empty table data
			this.tableData = [];

			// set data to table
			this.dataSource = new MatTableDataSource<any>([]);
		}
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
			// start loading
			this.loading = true;

			// set search
			let searchData = {};
			if (this.search.value) {
				searchData = {
					searchKey: this.search.value.toLowerCase()
				};
			}

			// set sort data
			let sortData = {};
			if (this.sortColumn) {
				sortData = {
					column: this.sortColumn,
					sort: this.sortOrder ? this.sortOrder : 'desc'
				};
			}

			// payload
			const payload = {
				...this.tableResources.payload,
				queryParams: {
					...this.tableResources.payload.queryParams,
					offset: pageIndex ? (pageIndex * this.tablePageSize) + 1 : 0,
					limit: this.tablePageSize,
					...searchData,
					...sortData
				}
			};

			// load next data
			this.loadNextData(
				this.search.value ? this.tableResources.searchApi : this.tableResources.api,
				payload,
				pageIndex
			);
		}
	}

	/**
	 * check / uncheck a single row
	 *
	 * @param element
	 */
	public onClickClearRow(element) {
		// set / unset row checkbox
		const result = this.clearRows && this.clearRows.some(r => r.Id === element.Id);
		if (!result) {
			const payload = {
				Id: element.Id,
				State: element.State,
				ConfirmUser: this._authService.currentUserState.profile.email
			};
			this.clearRows.push(payload);
		} else {
			this.clearRows = this.clearRows && this.clearRows.filter(r => r.Id !== element.Id);
		}

		// set / unset main checkbox
		const all = this.dataSource.data && this.dataSource.data.filter(r => !(!!r.ConfirmUser && !!r.ConfirmDate));
		if (this.clearRows.length === all.length) {
			this.clearAll.setValue(true);
			this.checkAllRows = true;
		}

		if (this.clearRows.length === 0) {
			this.clearAll.setValue(false);
			this.checkAllRows = false;
		}
	}

	/**
	 * check / uncheck all rows
	 */
	public onClickCheckAllRows() {
		this.checkAllRows = !this.checkAllRows;
		if (!this.checkAllRows) {
			this.clearRows = [];
		} else {
			this.clearRows = this.dataSource.data
				.filter(r => !(!!r.ConfirmUser && !!r.ConfirmDate))
				.map(r => {
					return {
						Id: r.Id,
						State: r.State,
						ConfirmUser: this._authService.currentUserState.profile.email
					};
				});
		}
	}

	/**
	 * confirm checked rows
	 */
	public onClickConfirmCheckedRows(event: any) {
		// stop propagation
		HelperService.stopPropagation(event);

		// clear tick rows
		if (this.clearRows && this.clearRows.length > 0) {
			// payload
			const data = {
				type: DialogTypeEnum.CONFIRMATION,
				payload: {
					icon: 'dialog_confirmation',
					title: this._i18n({ value: 'Title: Clear Row Confirmation', id: 'Table_Clear_Row_Title' }),
					message: this._i18n({ value: 'Description: Clear Row Confirmation', id: 'Table_Clear_Row_Description' }),
					buttonTexts: [
						this._i18n({
							value: 'Button - OK',
							id: 'Common_Button_OK'
						}),
						this._i18n({
							value: 'Button - Cancel',
							id: 'Common_Button_Cancel'
						})
					]
				}
			};

			// listen: dialog service
			this._dialogService
				.showDialog(data)
				.pipe(takeUntil(this._ngUnSubscribe))
				.subscribe(status => {
					if (status) {
						// start loading
						this.loading = true;

						const api = this.tableResources.clearApi;
						const payload = {
							pathParams: this.tableResources.payload.pathParams,
							bodyParams: this.clearRows
						};

						// service
						this._proxyService
							.postAPI(api, payload)
							.pipe(
								takeUntil(this._ngUnSubscribe),
								delay(1000)
							)
							.subscribe(() => this.rowClear.emit());
					}
				});
		}
	}

	/**
	 * map data before passing it to the data source
	 *
	 * @param data
	 * @param init
	 */
	private mapData(data, init?: boolean) {
		if (data) {
			data.forEach((item, index) => {
				const id = this.tableResources.uniqueID;
				if (!this.dataSource.data.some(row => row[id] === item[id])) {
					const language = this._authService.currentUserState.profile.language;
					let newItem = item;

					// Country
					if (item.hasOwnProperty('Country')) {
						newItem = {
							...newItem,
							Country: this._utilityService.countryList.filter(
								country => country.id === item.Country
							)[0].text
						};
					}

					// Image
					if (item.hasOwnProperty('Image')) {
						if (item.Image && item.Image.length > 20) {
							const imagePromise = this.getImageSrc(item.Image);
							newItem = {
								...newItem,
								Image: imagePromise
							};
						} else {
							const image = item.Image === null && item.Name ? HelperService.getFirstLetter(item.Name).toUpperCase() : 'N/A';
							newItem = {
								...newItem,
								Image: image
							};
						}
					}

					// Role
					if (item.hasOwnProperty('Role')) {
						const role = item.Role ? HelperService.capitalizeString(item.Role.replace(/_/g, ' ').toLowerCase()) : '-';
						newItem = {
							...newItem,
							Role: role
						};
					}

					// Type
					if (item.hasOwnProperty('Type')) {
						const type = item.Type;
						let color =  data[index]['Message'] && data[index]['Message'].Colour;

						// type: REG
						if (type && type === NotificationsFiltersEnums.REGISTRATIONS) {
							color = this.staticColors[0];
						}

						newItem = {
							...newItem,
							TypeRaw: type,
							Type: `<span>${type}</span>`,
							Color: color
						};
					}

					// Hotels
					if (item.hasOwnProperty('HotelIDs')) {
						let hotels = [];
						if (item && item.HotelIDs && typeof item.HotelIDs !== 'string') {
							item.HotelIDs.forEach(hotel => {
								if (hotel.split('_')[1]) {
									hotels.push(this._utilityService.hotelList[hotel]);
								}
							});
						}

						// remove hotel label
						hotels = hotels && hotels.length && hotels.map(hotel => hotel.split(' - ')[1]);

						newItem = {
							...newItem,
							Hotels: hotels && hotels.length ? hotels.join(', ') : 'ALL'
						};
					}

					// Create Date
					if (item.hasOwnProperty('CreateDate')) {
						const date = item.CreateDate ? HelperService.getDateTime(language, item.CreateDate) : '-';
						newItem = {
							...newItem,
							'Reg. Date': date
						};
					}

					// Login Date
					if (item.hasOwnProperty('LoginDate')) {
						const date = item.LoginDate ? HelperService.getDateTime(language, item.LoginDate) : '-';
						newItem = {
							...newItem,
							'Last Login': date
						};
					}

					// Date
					if (item.hasOwnProperty('Date')) {
						const date = item.Date ? HelperService.getDateTime(language, item.Date) : '-';
						newItem = {
							...newItem,
							'Date': date
						};
					}

					// Creator
					if (item.hasOwnProperty('Creator')) {
						newItem = {
							...newItem,
							Creator: item.Creator ? item.Creator : '-'
						};
					}

					// Received
					if (item.hasOwnProperty('Received')) {
						const date = item.Received ? HelperService.getDateFromNow(language, item.Received) : '-';
						newItem = {
							...newItem,
							Received: date
						};
					}

					// Confirm Date
					if (item.hasOwnProperty('ConfirmDate')) {
						const date = item.ConfirmDate ? HelperService.getDateFromNow(language, item.ConfirmDate) : '-';
						newItem = {
							...newItem,
							ConfirmDate: date,
							Notification: true
						};
					}

					// Message
					if (item.hasOwnProperty('Message')) {
						let messageTitle = item.Message ? item.Message.Title : '-';
						const type = data && data[index]['Type'];

						// type: REG
						if (type && type === 'REG') {
							messageTitle = this._i18n({
								value: `New Registration from '{{name}}'`,
								id: 'Table_Notification_Message_Title'
							}, {
								name: data[index]['SendUser']
							});
						}

						newItem = {
							...newItem,
							Message: messageTitle
						};
					}

					// Sent Date
					if (item.hasOwnProperty('SendDate')) {
						const date = item.SendDate ? HelperService.getDateTime(language, item.SendDate) : '-';
						newItem = {
							...newItem,
							Sent: date
						};
					}

					// Target Group
					if (item.hasOwnProperty('Targets')) {
						const targets = item.Targets ? item.Targets.join(', ') : '-';
						newItem = {
							...newItem,
							'Target Group': targets
						};
					}

					// Period
					if (item.hasOwnProperty('Trigger')) {
						const period = item.Trigger ? this._utilityService.getGuestPeriods().filter(periodItem => periodItem.id === item.Trigger)[0].text : '-';
						newItem = {
							...newItem,
							Period: period
						};
					}

					// Validity
					if (item.hasOwnProperty('ExpDate')) {
						const createDate = data[index].CreateDate ? HelperService.getDate(language, data[index].CreateDate) : '-';
						const expDate = item.ExpDate ? HelperService.getDate(language, item.ExpDate) : '-';

						newItem = {
							...newItem,
							Validity: `${createDate} - ${expDate}`
						};
					}

					// module: content
					if (
						this._router.url === `/${ ROUTING.content.routes.guestPushMessage }` ||
						this._router.url === `/${ ROUTING.content.routes.guestOffers }` ||
						this._router.url === `/${ ROUTING.content.routes.guestRepairs }`
					) {
						// Title
						if (item.hasOwnProperty('Title')) {
							newItem = {
								...newItem,
								Title: item.Title[language],
								Titles: item.Title,
								Guest: true
							};
						}

						// Data
						if (item.hasOwnProperty('Data')) {
							const image = item.Data && item.Data.Image ? item.Data.Image : 'N/A';
							if (image && image.length > 20) {
								const imagePromise = this.getImageSrc(image);
								newItem = {
									...newItem,
									Image: imagePromise
								};
							} else {
								newItem = {
									...newItem,
									Image: image
								};
							}
						}

						// Category
						if (item.hasOwnProperty('Name')) {
							newItem = {
								...newItem,
								Category: item.Name[language],
								Name: item.Name
							};
						}
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
		if (this.tableData && this.tableData.total) {
			const pageSize = this.tablePageSize;
			const from = (pageSize * pageIndex) + 1;
			const to = (pageSize * (pageIndex + 1) > total) ? total : pageSize * (pageIndex + 1);
			this.tableInfo = total > 0 ? `${ from } - ${ to } of ${ total }` : null;
		}
	}

	/**
	 * filter table content
	 *
	 * @param inputValue
	 */
	private applyFilter(inputValue: string) {
		// start loading
		this.loading = true;

		// set sort data
		let sortData = {};
		if (this.sortColumn) {
			sortData = {
				column: this.tableResources.sortDefaultColumn,
				sort: 'desc'
			};
		}

		// payload
		const payload = {
			...this.tableResources.payload,
			queryParams: {
				...this.tableResources.payload.queryParams,
				offset: 0,
				limit: this.tablePageSize + 1,
				...sortData
			}
		};

		// case: text search
		if (inputValue) {
			const payloadWithInput = {
				...payload,
				queryParams: {
					...payload.queryParams,
					searchKey: inputValue.toLowerCase()
				}
			};

			// load next data
			this.loadNextData(this.tableResources.searchApi, payloadWithInput, -1);
		} else {
			// load next data
			this.loadNextData(this.tableResources.api, payload, 0);
		}

		// move to first page.
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * sort by column name
	 *
	 * @param column
	 */
	private onClickSortByColumn(column: string) {
		if (column !== 'Clear') {
			let sortOrder;
			let columnName;
			if (column === 'Last Login') {
				columnName = 'LoginDate';
			} else if (column === 'Hotels(HGA)' || column === 'Hotels(HSA)') {
				columnName = 'TotalHotels';
			} else if (column === 'Users(HGA)' || column === 'Users(HSA)') {
				columnName = 'TotalUsers';
			} else if (column === 'Date' || column === 'Sent') {
				columnName = 'SendDate';
			}

			// reset when new sorting column is clicked
			if (this.sortColumn !== columnName) {
				this.sortColumn = '';
				this.sortOrder = '';
			}

			// sorting logic
			if (this.sortOrder === 'asc' || !columnName) {
				this.sortColumn = this.tableResources.sortDefaultColumn;
				this.sortOrder = '';
				sortOrder = 'desc';
			} else {
				this.sortColumn = columnName;
				this.sortOrder = (!this.sortOrder) ? 'desc' : 'asc';
				sortOrder = this.sortOrder;
			}

			// set sorting data
			let sortData = {};
			if (this.sortColumn) {
				sortData = {
					column: this.sortColumn,
					sort: sortOrder
				};
			}

			// payload
			const payload = {
				...this.tableResources.payload,
				queryParams: {
					...this.tableResources.payload.queryParams,
					offset: 0,
					limit: this.tablePageSize + 1,
					...sortData
				}
			};

			// load next data
			this.loadNextData(this.tableResources.api, payload, 0);

			// move to first page.
			if (this.dataSource.paginator) {
				this.dataSource.paginator.firstPage();
			}
		}
	}

	/**
	 * load next set of data
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
				// stop loading
				this.loading = false;

				// when input is changed
				if (pageIndex <= 0) {
					this.initializeTable(res);
				} else { // when next button is clicked
					this.mapData(res.data);
				}
			});
	}
}
