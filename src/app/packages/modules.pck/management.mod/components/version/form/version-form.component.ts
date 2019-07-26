// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { VersionViewInterface } from '../../../interfaces/version-view.interface';
import { VersionService } from '../../../services/version.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-version-form',
	templateUrl: './version-form.component.html',
	styleUrls: ['./version-form.component.scss']
})

export class VersionFormComponent implements OnInit, OnDestroy {
	@Output() changeVersionView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public formFields;
	public versionNr = 'Form';
	public tabsList = [];
	public systemLanguages;
	public systemInfo;
	public minDate = moment().toDate();

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _formBuilder: FormBuilder,
		private _versionService: VersionService,
		private _utilityService: UtilityService
	) {
		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			versionId: new FormControl('', [Validators.required]),
			date: new FormControl(this.minDate, [Validators.required])
		});
	}

	ngOnInit() {
		// listen: fetch form languages
		this._versionService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset tab list
					this.tabsList = [];

					// tabs list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach((language, index) => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add tabs
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);

							// text
							const text = this.formFields.controls['languages'].controls[index].controls['description'];

							// update existing data
							if (this.data) {
								text.setValue(this.data.Text[language]);
							}
						});
					}

					// update existing data
					if (this.data) {

					}
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get formArray() {
		return <FormArray>this.formFields.controls.languages.controls;
	}

	get versionId() {
		return this.formFields.get('versionId');
	}

	get releaseDate() {
		return this.formFields.get('date');
	}

	/**
	 * add forms groups for each language
	 */
	public addLanguageSpecificFields() {
		(<FormArray>this.formFields.controls['languages']).push(
			new FormGroup({
				description: new FormControl('', [
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(5000)
				])
			})
		);
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {

	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: VersionViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeVersionView.emit(payload);
	}
}
